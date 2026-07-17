console.log("✅ agentScore.route loaded");
import { Router } from "express";
import { fetchWithAgentPayment } from "../services/agentPaymentClient";
import { env } from "../config/env";

export const agentScoreRouter = Router();

agentScoreRouter.post("/agent/score", async (req, res) => {
  try {
    const response = await fetchWithAgentPayment(
      `http://localhost:${env.port}/score`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const body = await response.json();

    return res.status(response.status).json(body);
  } catch (err) {
    console.error("[agent/score] payment failed:", err);

    return res.status(500).json({
      error: "Agent payment failed",
    });
  }
});