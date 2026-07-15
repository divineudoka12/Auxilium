import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { riskScoringRouter } from "./routes/riskScoring.route";
import { documentAnalysisRouter } from "./routes/documentAnalysis.route";
import { creditMemoRouter } from "./routes/creditMemo.route";
import { buildPaymentMiddleware } from "./payments/middleware";

process.on("unhandledRejection", (reason) => {
  console.error("[unhandledRejection] Payment facilitator or other async error:", reason);
});

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const paymentMiddleware = buildPaymentMiddleware({
  "POST /score": "$0.01",
});
if (paymentMiddleware) {
  app.use(paymentMiddleware);
}

app.use(riskScoringRouter);
app.use(documentAnalysisRouter);
app.use(creditMemoRouter);

app.listen(env.port, () => {
  console.log(`Auxilium backend running on http://localhost:${env.port}`);
});
