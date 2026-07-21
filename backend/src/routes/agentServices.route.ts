import { Router, Request, Response } from "express";
import { applicantSchema } from "../utils/validators";
import { scoreApplicant } from "../services/riskScoring.service";
import { analyzeDocument } from "../services/documentAnalysis.service";
import { draftCreditMemo } from "../services/creditMemo.service";
import { supabase } from "../db/client";
import { buildPaymentMiddleware } from "../payments/middleware";

export const agentServicesRouter = Router();

const ROUTE_PATH = "/api/asp/run-loan-review";
const PRICE = "$0.003";
const NETWORK = "eip155:196";

const paymentGate = buildPaymentMiddleware({
  [`POST ${ROUTE_PATH}`]: PRICE,
});

// ---- GET /api/asp/run-loan-review --------------------------------------
// Self-describing info endpoint. Lets a human, a reachability check, or a
// curious agent confirm the service is alive and see what it does, its
// price, and its input shape — without triggering any payment logic.
agentServicesRouter.get(ROUTE_PATH, (_req, res) => {
  res.status(200).json({
    agent: "Auxilium",
    service: "Autonomous Loan Review",
    description:
      "Runs a full autonomous loan review — risk scoring, document analysis, " +
      "and credit memo generation — in one call. Returns a final recommendation " +
      "approve / manual_review / reject with supporting explanation.",
    method: "POST",
    price: PRICE,
    protocol: "x402",
    network: NETWORK,
    input_schema: {
      full_name: "string",
      monthly_income: "number",
      monthly_debt: "number",
      employment_status: "employed | self_employed | unemployed",
      credit_score: "number (optional, 300-850)",
      requested_loan_amount: "number",
      document_base64: "string (optional, base64-encoded PDF)",
    },
    note: "POST to this same URL to run the review. Unpaid POST requests receive a 402 Payment Required challenge.",
  });
});

// POST /api/asp/run-loan-review
// The single paid endpoint listed on OKX.AI. Runs the full loan review
// pipeline in one call: risk scoring -> document analysis (optional) ->
// credit memo generation, and returns a final recommendation.
//
// Body:
//   full_name, monthly_income, monthly_debt, employment_status,
//   credit_score (optional), requested_loan_amount  -- applicant fields
//   document_base64 (optional)                       -- base64-encoded PDF
async function runLoanReview(req: Request, res: Response) {
  const { document_base64, ...applicantInput } = req.body ?? {};

  const parsed = applicantSchema.safeParse(applicantInput);
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

  try {
    // 2. Risk scoring
    const score = await scoreApplicant({ ...parsed.data, id: applicant.id });

    const { data: savedScore, error: scoreError } = await supabase
      .from("scores")
      .insert({
        applicant_id: applicant.id,
        affordability_ratio: score.affordability_ratio,
        risk_level: score.risk_level,
        confidence: score.confidence,
        explanation: score.explanation,
        flags: score.flags,
      })
      .select()
      .single();

    if (scoreError || !savedScore) {
      return res.status(500).json({ error: "Failed to save score", details: scoreError });
    }

    // 3. Document analysis (optional — only if a document was provided)
    let documentAnalysis: Awaited<ReturnType<typeof analyzeDocument>> | null = null;
    let savedDocAnalysisId: string | null = null;

    if (typeof document_base64 === "string" && document_base64.length > 0) {
      const fileBuffer = Buffer.from(document_base64, "base64");

      documentAnalysis = await analyzeDocument(applicant.id, fileBuffer, {
        full_name: applicant.full_name,
        monthly_income: applicant.monthly_income,
        employment_status: applicant.employment_status,
      });

      const { data: savedDocAnalysis, error: docSaveError } = await supabase
        .from("document_analyses")
        .insert({
          applicant_id: documentAnalysis.applicant_id,
          extracted_fields: documentAnalysis.extracted_fields,
          missing_fields: documentAnalysis.missing_fields,
          inconsistencies: documentAnalysis.inconsistencies,
        })
        .select()
        .single();

      if (docSaveError || !savedDocAnalysis) {
        return res.status(500).json({ error: "Failed to save document analysis", details: docSaveError });
      }
      savedDocAnalysisId = savedDocAnalysis.id;
    }

    // 4. Credit memo — only generated once we have both score + document analysis
    let memo: Awaited<ReturnType<typeof draftCreditMemo>> | null = null;

    if (documentAnalysis && savedDocAnalysisId) {
      memo = await draftCreditMemo(
        applicant,
        {
          applicant_id: applicant.id,
          affordability_ratio: score.affordability_ratio,
          risk_level: score.risk_level,
          confidence: score.confidence,
          explanation: score.explanation,
          flags: score.flags,
        },
        {
          applicant_id: applicant.id,
          extracted_fields: documentAnalysis.extracted_fields,
          missing_fields: documentAnalysis.missing_fields,
          inconsistencies: documentAnalysis.inconsistencies,
        }
      );

      const { error: memoSaveError } = await supabase.from("credit_memos").insert({
        applicant_id: memo.applicant_id,
        recommendation: memo.recommendation,
        summary: memo.summary,
        score_id: savedScore.id,
        document_analysis_id: savedDocAnalysisId,
      });

      if (memoSaveError) {
        return res.status(500).json({ error: "Failed to save credit memo", details: memoSaveError });
      }
    }

    // 5. Surface the on-chain payment receipt, if the gate attached one.
    // x402 conventionally sets this on the response after settlement
    // confirms — read it defensively since we haven't verified OKX's
    // exact header name/encoding against a real paid request yet.
    const paymentResponseHeader =
      res.getHeader("X-PAYMENT-RESPONSE") ?? res.getHeader("payment-response");

    let paymentReceipt: Record<string, unknown> | null = null;
    if (typeof paymentResponseHeader === "string") {
      try {
        const decoded = Buffer.from(paymentResponseHeader, "base64").toString("utf-8");
        paymentReceipt = JSON.parse(decoded);
      } catch {
        paymentReceipt = { raw: paymentResponseHeader };
      }
    }

    const txHash =
      (paymentReceipt?.transaction as string | undefined) ??
      (paymentReceipt?.txHash as string | undefined) ??
      null;

    const explorerUrl = txHash ? `https://web3.okx.com/explorer/x-layer/tx/${txHash}` : null;

    return res.status(200).json({
      applicant_id: applicant.id,
      score,
      document_analysis: documentAnalysis,
      credit_memo: memo,
      recommendation: memo?.recommendation ?? "manual_review",
      payment: {
        transaction_hash: txHash,
        explorer_url: explorerUrl,
      },
    });
  } catch (err) {
    console.error("[run-loan-review] pipeline error:", err);
    return res.status(500).json({ error: "Loan review pipeline failed" });
  }
}

if (paymentGate) {
  agentServicesRouter.post(ROUTE_PATH, paymentGate, runLoanReview);
} else {
  agentServicesRouter.post(ROUTE_PATH, runLoanReview);
}