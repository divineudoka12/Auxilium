import express from "express";
import cors from "cors";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { env } from "./config/env";
import { riskScoringRouter } from "./routes/riskScoring.route";
import { documentAnalysisRouter } from "./routes/documentAnalysis.route";
import { creditMemoRouter } from "./routes/creditMemo.route";
import { buildPaymentMiddleware } from "./payments/middleware";
import { applicantsRouter } from "./routes/applicants.route";
import { agentScoreRouter } from "./routes/agentScore.route";
import { startMcpServer } from "./mcp/server";

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection] Payment facilitator or other async error:", reason);
});

// Start FastMCP internally (localhost only, not public)
startMcpServer();

const MCP_INTERNAL_PORT = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 4100;
const MCP_TARGET = `http://127.0.0.1:${MCP_INTERNAL_PORT}`;

// Per-call pricing for MCP tools — all three gated
const PAID_MCP_TOOLS: Record<string, string> = {
  score_loan_applicant: "$0.001",
  analyze_document: "$0.001",
  generate_credit_memo: "$0.001",
};

const app = express();

app.use(cors());

app.use((req, _res, next) => {
  console.log(`→ ${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// --- MCP proxy with per-tool x402 gating ------------------------------
const mcpProxy = createProxyMiddleware({
  target: MCP_TARGET,
  changeOrigin: true,
  ws: true,
  pathRewrite: { "^/": "/mcp" },
  on: {
    proxyReq: fixRequestBody,
  },
});

app.use(
  "/mcp",
  express.json({ limit: "10mb" }), // documents come in as base64 in the JSON body
  (req, res, next) => {
    if (req.method !== "POST") return mcpProxy(req, res, next);

    const body = req.body as { method?: string; params?: { name?: string } };
    const toolName = body?.params?.name;
    const isPaidToolCall = body?.method === "tools/call" && toolName && PAID_MCP_TOOLS[toolName];

    if (!isPaidToolCall) {
      return mcpProxy(req, res, next);
    }

    console.log("[payment gate] req.method:", req.method, "| req.path:", req.path, "| tool:", toolName);

    const gate = buildPaymentMiddleware({ "POST /": PAID_MCP_TOOLS[toolName] });

    if (!gate) {
      return mcpProxy(req, res, next);
    }

    gate(req, res, (err?: unknown) => {
      if (err) return next(err as Error);
      return mcpProxy(req, res, next);
    });
  }
);

app.use(
  "/sse",
  createProxyMiddleware({
    target: MCP_TARGET,
    changeOrigin: true,
    ws: true,
    pathRewrite: { "^/": "/sse" },
  })
);

// --- Existing REST routes (unaffected) ---------------------------------
app.use(express.json());
app.use(riskScoringRouter);
app.use(documentAnalysisRouter);
app.use(creditMemoRouter);
app.use(applicantsRouter);
app.use(agentScoreRouter);

app.listen(env.port, () => {
  console.log(`Auxilium backend running on http://localhost:${env.port}`);
});