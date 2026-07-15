import { Router } from "express";
import { draftCreditMemo } from "../services/creditMemo.service";
import { supabase } from "../db/client";

export const creditMemoRouter = Router();

// POST /generate-memo
// Body: { applicant_id: string }
// Requires that /score and /analyze-document have already been run for this applicant.
creditMemoRouter.post("/generate-memo", async (req, res) => {
  const { applicant_id } = req.body;

  if (!applicant_id) {
    return res.status(400).json({ error: "applicant_id is required" });
  }

  const { data: applicant, error: applicantError } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", applicant_id)
    .single();

  if (applicantError || !applicant) {
    return res.status(404).json({ error: "Applicant not found" });
  }

  const { data: score, error: scoreError } = await supabase
    .from("scores")
    .select("*")
    .eq("applicant_id", applicant_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (scoreError || !score) {
    return res.status(400).json({ error: "No risk score found — run /score first" });
  }

  const { data: docAnalysis, error: docError } = await supabase
    .from("document_analyses")
    .select("*")
    .eq("applicant_id", applicant_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (docError || !docAnalysis) {
    return res.status(400).json({ error: "No document analysis found — run /analyze-document first" });
  }

  const memo = await draftCreditMemo(
    applicant,
    {
      applicant_id,
      affordability_ratio: score.affordability_ratio,
      risk_level: score.risk_level,
      confidence: score.confidence,
      explanation: score.explanation,
      flags: score.flags,
    },
    {
      applicant_id,
      extracted_fields: docAnalysis.extracted_fields,
      missing_fields: docAnalysis.missing_fields,
      inconsistencies: docAnalysis.inconsistencies,
    }
  );

  const { data: savedMemo, error: saveError } = await supabase
    .from("credit_memos")
    .insert({
      applicant_id: memo.applicant_id,
      recommendation: memo.recommendation,
      summary: memo.summary,
      score_id: score.id,
      document_analysis_id: docAnalysis.id,
    })
    .select()
    .single();

  if (saveError) {
    return res.status(500).json({ error: "Failed to save credit memo", details: saveError });
  }

  return res.status(200).json(savedMemo);
});