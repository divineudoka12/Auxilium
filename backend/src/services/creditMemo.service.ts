import { Applicant, ScoreResult, DocumentAnalysisResult, CreditMemo } from "../types";
import { askGemini } from "./gemini.service";

/**
 * Drafts a credit memo by combining the risk score and document analysis
 * for an applicant, then asking Gemini to produce a recommendation with
 * a plain-English summary a loan officer can quickly review.
 */
export async function draftCreditMemo(
  applicant: Applicant,
  score: ScoreResult,
  documentAnalysis: DocumentAnalysisResult
): Promise<Omit<CreditMemo, "supporting_score" | "supporting_documents">> {
  const prompt = `
    You are a credit memo assistant for a loan officer. Based on the data below,
    recommend one of: "approve", "reject", "manual_review".

    Rules of thumb:
    - "reject" if risk_level is high AND there are unresolved inconsistencies
    - "manual_review" if there are missing_fields or inconsistencies that need a human look,
      or if the risk level is medium
    - "approve" only if risk is low, no missing fields, and no inconsistencies

    Then write a 3-4 sentence summary a loan officer can read in under 10 seconds,
    referencing the specific numbers and flags below. Be direct, not vague.

    Respond ONLY as valid JSON, no markdown, no preamble, in this exact shape:
    { "recommendation": "approve" | "reject" | "manual_review", "summary": "..." }

    Applicant: ${applicant.full_name}
    Requested loan amount: ${applicant.requested_loan_amount}

    Risk score:
    - affordability_ratio: ${score.affordability_ratio}
    - risk_level: ${score.risk_level}
    - confidence: ${score.confidence}
    - flags: ${score.flags.join(", ") || "none"}
    - explanation: ${score.explanation}

    Document analysis:
    - missing_fields: ${documentAnalysis.missing_fields.join(", ") || "none"}
    - inconsistencies: ${documentAnalysis.inconsistencies.join(", ") || "none"}
  `;

  const raw = await askGemini(prompt);
  const cleaned = raw.replace(/```json|```/g, "").trim();

  let parsed: { recommendation: CreditMemo["recommendation"]; summary: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = {
      recommendation: "manual_review",
      summary: "Could not generate an automated recommendation — needs manual review.",
    };
  }

  return {
    applicant_id: applicant.id ?? "",
    recommendation: parsed.recommendation,
    summary: parsed.summary,
    drafted_at: new Date().toISOString(),
  };
}