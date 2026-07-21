import { Router } from "express";
import { applicantSchema } from "../utils/validators";
import { scoreApplicant } from "../services/riskScoring.service";
import { supabase } from "../db/client";

export const riskScoringRouter = Router();

// POST /score
// Body: Applicant fields (see validators.ts)
// This is the endpoint that will later be gated behind x402 payment (A2MCP).
riskScoringRouter.post("/score", async (req, res) => {
  const parsed = applicantSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  // 1. Save applicant
  const { data: applicant, error: applicantError } = await supabase
    .from("applicants")
    .insert(parsed.data)
    .select()
    .single();

  if (applicantError || !applicant) {
    return res.status(500).json({ error: "Failed to save applicant", details: applicantError });
  }

  // 2. Run scoring
  const scoreResult = await scoreApplicant({ ...parsed.data, id: applicant.id });

  // 3. Save score
  const { error: scoreError } = await supabase.from("scores").insert({
    applicant_id: applicant.id,
    affordability_ratio: scoreResult.affordability_ratio,
    risk_level: scoreResult.risk_level,
    confidence: scoreResult.confidence,
    explanation: scoreResult.explanation,
    flags: scoreResult.flags,
  });

  if (scoreError) {
    return res.status(500).json({ error: "Failed to save score", details: scoreError });
  }

  return res.status(200).json(scoreResult);
});