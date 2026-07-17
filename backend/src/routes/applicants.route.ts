import { Router } from "express";
import { supabase } from "../db/client";

export const applicantsRouter = Router();

// ---- helpers -------------------------------------------------------------

/**
 * Reduces a list of rows (already sorted created_at desc) down to the
 * latest row per applicant_id. Used because supabase-js has no clean
 * DISTINCT ON equivalent for "latest child row per parent" queries.
 */
function latestByApplicant<T extends { applicant_id: string; created_at: string }>(
  rows: T[]
): Map<string, T> {
  const map = new Map<string, T>();
  for (const row of rows) {
    if (!map.has(row.applicant_id)) {
      map.set(row.applicant_id, row);
    }
  }
  return map;
}

// ---- GET /applicants -------------------------------------------------------
// Returns Applicant[] with risk_level, recommendation, officer_decision
// flattened onto each row, pulled from each applicant's latest score / memo.
applicantsRouter.get("/applicants", async (_req, res) => {
  const { data: applicants, error: applicantsError } = await supabase
    .from("applicants")
    .select("*")
    .order("created_at", { ascending: false });

  if (applicantsError) {
    return res.status(500).json({ error: "Failed to load applicants", details: applicantsError });
  }

  const { data: scores, error: scoresError } = await supabase
    .from("scores")
    .select("applicant_id, risk_level, created_at")
    .order("created_at", { ascending: false });

  if (scoresError) {
    return res.status(500).json({ error: "Failed to load scores", details: scoresError });
  }

  const { data: memos, error: memosError } = await supabase
    .from("credit_memos")
    .select("applicant_id, recommendation, officer_decision, created_at")
    .order("created_at", { ascending: false });

  if (memosError) {
    return res.status(500).json({ error: "Failed to load credit memos", details: memosError });
  }

  const latestScores = latestByApplicant(scores ?? []);
  const latestMemos = latestByApplicant(memos ?? []);

  const result = (applicants ?? []).map((a) => {
    const score = latestScores.get(a.id);
    const memo = latestMemos.get(a.id);
    return {
      ...a,
      risk_level: score?.risk_level ?? null,
      recommendation: memo?.recommendation ?? null,
      officer_decision: memo?.officer_decision ?? "pending",
    };
  });

  return res.status(200).json(result);
});

// ---- GET /applicants/:id ---------------------------------------------------
// Returns { applicant, latest_score, latest_document_analysis, latest_memo, activity }
applicantsRouter.get("/applicants/:id", async (req, res) => {
  const { id } = req.params;

  const { data: applicant, error: applicantError } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", id)
    .single();

  if (applicantError || !applicant) {
    return res.status(404).json({ error: "Applicant not found" });
  }

  const { data: scores, error: scoresError } = await supabase
    .from("scores")
    .select("*")
    .eq("applicant_id", id)
    .order("created_at", { ascending: false });

  if (scoresError) {
    return res.status(500).json({ error: "Failed to load scores", details: scoresError });
  }

  const { data: docAnalyses, error: docError } = await supabase
    .from("document_analyses")
    .select("*")
    .eq("applicant_id", id)
    .order("created_at", { ascending: false });

  if (docError) {
    return res.status(500).json({ error: "Failed to load document analyses", details: docError });
  }

  const { data: memos, error: memosError } = await supabase
    .from("credit_memos")
    .select("*")
    .eq("applicant_id", id)
    .order("created_at", { ascending: false });

  if (memosError) {
    return res.status(500).json({ error: "Failed to load credit memos", details: memosError });
  }

  const latestScore = scores?.[0] ?? null;
  const latestDocAnalysis = docAnalyses?.[0] ?? null;
  const latestMemo = memos?.[0] ?? null;

  // Build the audit trail by merging all three tables' rows into one
  // timeline, newest first; this is what AuditTrail renders.
  const activity = [
    ...(scores ?? []).map((s) => ({
      id: s.id,
      type: "score" as const,
      title: "Risk score generated",
      detail: `${s.risk_level} risk, ${Math.round(s.confidence * 100)}% confidence`,
      timestamp: s.created_at,
    })),
    ...(docAnalyses ?? []).map((d) => ({
      id: d.id,
      type: "document" as const,
      title: "Document analyzed",
      detail:
        d.inconsistencies.length > 0
          ? `${d.inconsistencies.length} inconsistency(ies) flagged`
          : d.missing_fields.length > 0
          ? `${d.missing_fields.length} field(s) missing`
          : "No issues found",
      timestamp: d.created_at,
    })),
    ...(memos ?? []).map((m) => ({
      id: m.id,
      type: "memo" as const,
      title: "Credit memo drafted",
      detail: `Recommendation: ${m.recommendation.replace("_", " ")}`,
      timestamp: m.created_at,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return res.status(200).json({
    applicant,
    latest_score: latestScore,
    latest_document_analysis: latestDocAnalysis,
    latest_memo: latestMemo
      ? { ...latestMemo, officer_decision: latestMemo.officer_decision ?? "pending" }
      : null,
    activity,
  });
});

// ---- PATCH /applicants/:id/decision ---------------------------------------
// Body: { decision: "approved" | "rejected" }
// officer_decision lives on credit_memos, so this updates the applicant's
// latest memo row. Requires a memo to already exist (i.e. /generate-memo
// must have run first) — matches the frontend, which only ever renders
// DecisionPanel once latest_memo is non-null.
applicantsRouter.patch("/applicants/:id/decision", async (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;

  if (decision !== "approved" && decision !== "rejected") {
    return res.status(400).json({ error: "decision must be 'approved' or 'rejected'" });
  }

  const { data: latestMemo, error: memoError } = await supabase
    .from("credit_memos")
    .select("id")
    .eq("applicant_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (memoError || !latestMemo) {
    return res.status(400).json({ error: "No credit memo found for this applicant — run /generate-memo first" });
  }

  const { data: updatedMemo, error: updateError } = await supabase
    .from("credit_memos")
    .update({ officer_decision: decision })
    .eq("id", latestMemo.id)
    .select()
    .single();

  if (updateError) {
    return res.status(500).json({ error: "Failed to update decision", details: updateError });
  }

  return res.status(200).json(updatedMemo);
});