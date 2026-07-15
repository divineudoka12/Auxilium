import { Applicant, ScoreResult } from "../types";
import { askGemini } from "./gemini.service";

/**
 * Calculates debt-to-income ratio and a rule-based risk level,
 * then asks Gemini to produce a human-readable explanation
 * (the "explainable AI" piece of the pitch).
 */
export async function scoreApplicant(applicant: Applicant): Promise<ScoreResult> {
  const affordabilityRatio = applicant.monthly_debt / applicant.monthly_income;

  const flags: string[] = [];
  if (affordabilityRatio > 0.43) flags.push("high_dti");
  if (!applicant.credit_score) flags.push("no_credit_history");
  if (applicant.employment_status === "unemployed") flags.push("no_income_source");

  let riskLevel: ScoreResult["risk_level"] = "low";
  if (flags.includes("no_income_source") || affordabilityRatio > 0.5) {
    riskLevel = "high";
  } else if (flags.length > 0) {
    riskLevel = "medium";
  }

  const confidence = applicant.credit_score ? 0.9 : 0.6;

  const explanation = await askGemini(`
    You are a loan risk analyst. In 2-3 plain sentences, explain this risk assessment
    to a loan officer. Be concrete and reference the actual numbers.

    Applicant: ${applicant.full_name}
    Monthly income: ${applicant.monthly_income}
    Monthly debt: ${applicant.monthly_debt}
    Debt-to-income ratio: ${(affordabilityRatio * 100).toFixed(1)}%
    Employment status: ${applicant.employment_status}
    Credit score: ${applicant.credit_score ?? "not provided"}
    Risk level determined: ${riskLevel}
    Flags: ${flags.join(", ") || "none"}
  `);

  return {
    applicant_id: applicant.id ?? "",
    affordability_ratio: Number(affordabilityRatio.toFixed(4)),
    risk_level: riskLevel,
    confidence,
    explanation: explanation.trim(),
    flags,
  };
}
