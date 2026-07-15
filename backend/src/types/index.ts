export interface Applicant {
  id?: string;
  full_name: string;
  monthly_income: number;
  monthly_debt: number;
  employment_status: "employed" | "self_employed" | "unemployed";
  credit_score?: number;
  requested_loan_amount: number;
  created_at?: string;
}

export interface ScoreResult {
  applicant_id: string;
  affordability_ratio: number; // debt-to-income
  risk_level: "low" | "medium" | "high";
  confidence: number; // 0-1
  explanation: string;
  flags: string[]; // e.g. "high_dti", "no_credit_history"
}

export interface DocumentAnalysisResult {
  applicant_id: string;
  extracted_fields: Record<string, string | number | null>;
  missing_fields: string[];
  inconsistencies: string[];
}

export interface CreditMemo {
  applicant_id: string;
  recommendation: "approve" | "reject" | "manual_review";
  summary: string;
  supporting_score: ScoreResult;
  supporting_documents: DocumentAnalysisResult;
  drafted_at: string;
}
