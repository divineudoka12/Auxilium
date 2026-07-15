export type LoanStatus = "approved" | "rejected" | "manual_review" | "pending";

export interface EmploymentInfo {
  employer: string;
  title: string;
  yearsEmployed: number;
  monthlyIncome: number;
  verified: boolean;
}

export interface RiskFactor {
  label: string;
  weight: number; // -1 to 1, negative = risk-reducing, positive = risk-adding
  detail: string;
}

export interface RiskScore {
  score: number; // 0 - 100, higher = riskier
  band: "low" | "medium" | "high";
  debtToIncome: number;
  factors: RiskFactor[];
}

export interface DocumentCheck {
  id: string;
  name: string;
  type: "pay_stub" | "bank_statement" | "id" | "tax_return" | "employment_letter";
  status: "verified" | "flagged" | "pending";
  note: string;
  uploadedAt: string;
}

export interface CreditMemo {
  summary: string;
  strengths: string[];
  concerns: string[];
  recommendation: "approve" | "reject" | "manual_review";
  generatedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: "agent" | "officer" | "system";
  label: string;
  detail?: string;
}

export interface OfficerDecision {
  decidedBy: string;
  decision: "approved" | "rejected" | "pending";
  note: string;
  decidedAt: string | null;
}

export interface Applicant {
  id: string;
  name: string;
  avatarInitials: string;
  loanAmount: number;
  loanPurpose: string;
  submittedAt: string;
  status: LoanStatus;
  employment: EmploymentInfo;
  riskScore: RiskScore;
  documents: DocumentCheck[];
  creditMemo: CreditMemo;
  auditTrail: AuditEvent[];
  officerDecision: OfficerDecision;
}
