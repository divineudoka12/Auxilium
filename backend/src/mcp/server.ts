import { FastMCP } from "fastmcp";
import { z } from "zod";
import { scoreApplicant } from "../services/riskScoring.service";
import { analyzeDocument } from "../services/documentAnalysis.service";
import { draftCreditMemo } from "../services/creditMemo.service";
import { supabase } from "../db/client";

export const mcp = new FastMCP({
  name: "Auxilium",
  version: "1.0.0",
});

mcp.addTool({
  name: "score_loan_applicant",
  description:
    "Scores a loan applicant's affordability and risk based on income, debt, employment status, " +
    "and credit score. Returns a risk level, confidence, plain-English explanation, and any risk flags.",
  parameters: z.object({
    full_name: z.string(),
    monthly_income: z.number().positive(),
    monthly_debt: z.number().min(0),
    employment_status: z.enum(["employed", "self_employed", "unemployed"]),
    credit_score: z.number().min(300).max(850).optional(),
    requested_loan_amount: z.number().positive(),
  }),
  execute: async (args) => {
    const { data: applicant, error } = await supabase
      .from("applicants")
      .insert(args)
      .select()
      .single();

    if (error || !applicant) {
      throw new Error(`Failed to save applicant: ${error?.message ?? "unknown error"}`);
    }

    const score = await scoreApplicant({ ...args, id: applicant.id });

    await supabase.from("scores").insert({
      applicant_id: applicant.id,
      affordability_ratio: score.affordability_ratio,
      risk_level: score.risk_level,
      confidence: score.confidence,
      explanation: score.explanation,
      flags: score.flags,
    });

    return JSON.stringify(score);
  },
});

mcp.addTool({
  name: "analyze_document",
  description:
    "Analyzes an applicant's uploaded document (base64-encoded PDF) against their claimed " +
    "application values, extracting key fields and flagging missing fields or inconsistencies.",
  parameters: z.object({
    applicant_id: z.string(),
    document_base64: z.string().describe("Base64-encoded PDF content"),
  }),
  execute: async (args) => {
    const { data: applicant, error: applicantError } = await supabase
      .from("applicants")
      .select("*")
      .eq("id", args.applicant_id)
      .single();

    if (applicantError || !applicant) {
      throw new Error("Applicant not found");
    }

    const fileBuffer = Buffer.from(args.document_base64, "base64");

    const result = await analyzeDocument(args.applicant_id, fileBuffer, {
      full_name: applicant.full_name,
      monthly_income: applicant.monthly_income,
      employment_status: applicant.employment_status,
    });

    const { error: saveError } = await supabase.from("document_analyses").insert({
      applicant_id: result.applicant_id,
      extracted_fields: result.extracted_fields,
      missing_fields: result.missing_fields,
      inconsistencies: result.inconsistencies,
    });

    if (saveError) {
      throw new Error(`Failed to save document analysis: ${saveError.message}`);
    }

    return JSON.stringify(result);
  },
});

mcp.addTool({
  name: "generate_credit_memo",
  description:
    "Generates a credit memo recommendation (approve / reject / manual_review) for an applicant " +
    "who already has a risk score and document analysis on file.",
  parameters: z.object({
    applicant_id: z.string(),
  }),
  execute: async (args) => {
    const { data: applicant } = await supabase
      .from("applicants")
      .select("*")
      .eq("id", args.applicant_id)
      .single();

    const { data: score } = await supabase
      .from("scores")
      .select("*")
      .eq("applicant_id", args.applicant_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const { data: docAnalysis } = await supabase
      .from("document_analyses")
      .select("*")
      .eq("applicant_id", args.applicant_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!applicant || !score || !docAnalysis) {
      throw new Error("Missing applicant, score, or document analysis - run those first.");
    }

    const memo = await draftCreditMemo(
      applicant,
      {
        applicant_id: args.applicant_id,
        affordability_ratio: score.affordability_ratio,
        risk_level: score.risk_level,
        confidence: score.confidence,
        explanation: score.explanation,
        flags: score.flags,
      },
      {
        applicant_id: args.applicant_id,
        extracted_fields: docAnalysis.extracted_fields,
        missing_fields: docAnalysis.missing_fields,
        inconsistencies: docAnalysis.inconsistencies,
      }
    );

    await supabase.from("credit_memos").insert({
      applicant_id: memo.applicant_id,
      recommendation: memo.recommendation,
      summary: memo.summary,
      score_id: score.id,
      document_analysis_id: docAnalysis.id,
    });

    return JSON.stringify(memo);
  },
});

const MCP_PORT = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 4100;

/**
 * Starts FastMCP bound to localhost ONLY — it is never reached directly
 * from the internet. Express (index.ts) is the sole public entry point
 * and proxies into this after checking payment.
 */
export function startMcpServer() {
  mcp.start({
    transportType: "httpStream",
    httpStream: { port: MCP_PORT, host: "127.0.0.1" },
  });
  console.log(`Auxilium MCP server listening internally on http://127.0.0.1:${MCP_PORT}`);
}