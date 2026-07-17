import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getApplicantDetail } from "@/lib/api";
import Topbar from "@/components/dashboard/Topbar";
import RiskBadge from "@/components/dashboard/RiskBadge";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import DocumentAnalysisPanel from "@/components/dashboard/DocumentAnalysisPanel";
import CreditMemoPanel from "@/components/dashboard/CreditMemoPanel";
import AuditTrail from "@/components/dashboard/AuditTrail";
import DecisionPanel from "@/components/dashboard/DecisionPanel";
import Card from "@/components/ui/Card";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let detail: Awaited<ReturnType<typeof getApplicantDetail>>;
  try {
    detail = await getApplicantDetail(id);
  } catch {
    notFound();
  }

  const { applicant, latest_score, latest_document_analysis, latest_memo, activity } = detail;

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Application" />

      <Link href="/dashboard" className="inline-flex w-fit items-center gap-1.5 text-sm text-mist transition-colors hover:text-paper">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-3 font-display text-lg font-medium">
            {initials(applicant.full_name)}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-medium tracking-tight">{applicant.full_name}</h2>
              <RiskBadge level={latest_score?.risk_level} />
            </div>
            <p className="mt-1 text-sm text-fog">
              #{applicant.id.slice(0, 8)} · Submitted{" "}
              {new Date(applicant.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-2xl font-medium tracking-tight">{formatCurrency(applicant.requested_loan_amount)}</p>
          <p className="text-xs text-fog capitalize">{applicant.employment_status.replace("_", " ")}</p>
        </div>
      </div>

      <Card className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
        <div>
          <p className="text-xs text-fog">Monthly income</p>
          <p className="mt-1 text-sm">{formatCurrency(applicant.monthly_income)}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Monthly debt</p>
          <p className="mt-1 text-sm">{formatCurrency(applicant.monthly_debt)}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Credit score</p>
          <p className="mt-1 text-sm">{applicant.credit_score ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Employment</p>
          <p className="mt-1 text-sm capitalize">{applicant.employment_status.replace("_", " ")}</p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <CreditMemoPanel memo={latest_memo} />
          <DocumentAnalysisPanel analysis={latest_document_analysis} />
          <div>
            <h3 className="mb-3 font-display text-base font-medium">Audit trail</h3>
            <AuditTrail events={activity} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {latest_score ? (
            <RiskScoreCard score={latest_score} />
          ) : (
            <Card className="p-6">
              <h3 className="font-display text-base font-medium">Risk assessment</h3>
              <p className="mt-4 text-sm text-mist">Not scored yet.</p>
            </Card>
          )}

          {latest_memo ? (
            <DecisionPanel applicantId={applicant.id} currentDecision={latest_memo.officer_decision} />
          ) : (
            <Card className="p-6 text-center">
              <p className="text-sm text-mist">Generate a credit memo before recording a decision.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}