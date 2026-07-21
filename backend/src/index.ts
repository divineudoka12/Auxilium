import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { riskScoringRouter } from "./routes/riskScoring.route";
import { documentAnalysisRouter } from "./routes/documentAnalysis.route";
import { creditMemoRouter } from "./routes/creditMemo.route";
import { applicantsRouter } from "./routes/applicants.route";
import { agentServicesRouter } from "./routes/agentServices.route";

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection] Payment facilitator or other async error:", reason);
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use((req, _res, next) => {
  console.log(`→ ${req.method} ${req.path}`);
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Paid ASP endpoint — this is what gets listed on OKX.AI
app.use(agentServicesRouter);

// Free internal routes — used only by CreditPilot's own frontend
app.use(riskScoringRouter);
app.use(documentAnalysisRouter);
app.use(creditMemoRouter);
app.use(applicantsRouter);

app.listen(env.port, () => {
  console.log(`Auxilium backend running on http://localhost:${env.port}`);
});