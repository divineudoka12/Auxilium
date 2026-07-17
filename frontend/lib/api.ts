const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type RiskLevel = "low" | "medium" | "high";
export type Recommendation = "approve" | "reject" | "manual_review";

export interface Applicant {
  id: string;
  full_name: string;
  monthly_income: number;
  monthly_debt: number;
  employment_status: "employed" | "self_employed" | "unemployed";
  credit_score?: number | null;
  requested_loan_amount: number;
  created_at: string;
  risk_level?: RiskLevel | null;
  recommendation?: Recommendation | null;
  officer_decision?: "approved" | "rejected" | "pending";
}

export interface ScoreResult {
  applicant_id: string;
  affordability_ratio: number;
  risk_level: RiskLevel;
  confidence: number;
  explanation: string;
  flags: string[];
}

export interface ActivityEvent {
  id: string;
  type: "score" | "document" | "memo";
  title: string;
  detail: string;
  timestamp: string;
}

export interface ApplicantDetail {
  applicant: Applicant;
  latest_score: (ScoreResult & { id: string }) | null;
  latest_document_analysis: {
    id: string;
    extracted_fields: Record<string, string | number | null>;
    missing_fields: string[];
    inconsistencies: string[];
  } | null;
  latest_memo: {
    id: string;
    recommendation: Recommendation;
    summary: string;
    officer_decision: "approved" | "rejected" | "pending";
  } | null;
  activity: ActivityEvent[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options?.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export function getApplicants(): Promise<Applicant[]> {
  return request<Applicant[]>("/applicants");
}

export function getApplicantDetail(id: string): Promise<ApplicantDetail> {
  return request<ApplicantDetail>(`/applicants/${id}`);
}

export function createApplicant(data: {
  full_name: string;
  monthly_income: number;
  monthly_debt: number;
  employment_status: "employed" | "self_employed" | "unemployed";
  credit_score?: number;
  requested_loan_amount: number;
}): Promise<ScoreResult & { applicant_id: string }> {
  return request("/agent/score", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function analyzeDocument(applicantId: string, file: File) {
  const formData = new FormData();
  formData.append("applicant_id", applicantId);
  formData.append("document", file);

  return request(`/analyze-document`, {
    method: "POST",
    body: formData,
  });
}

export function generateMemo(applicantId: string) {
  return request(`/generate-memo`, {
    method: "POST",
    body: JSON.stringify({ applicant_id: applicantId }),
  });
}

export function updateDecision(applicantId: string, decision: "approved" | "rejected") {
  return request(`/applicants/${applicantId}/decision`, {
    method: "PATCH",
    body: JSON.stringify({ decision }),
  });
}