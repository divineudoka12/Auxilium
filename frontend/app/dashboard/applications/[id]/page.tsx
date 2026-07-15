import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getApplicantById, applicants } from "@/lib/mock-data";
import Topbar from "@/components/dashboard/Topbar";
import StatusBadge from "@/components/dashboard/StatusBadge";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import DocumentAnalysisPanel from "@/components/dashboard/DocumentAnalysisPanel";
import CreditMemoPanel from "@/components/dashboard/CreditMemoPanel";
import AuditTrail from "@/components/dashboard/AuditTrail";
import DecisionPanel from "@/components/dashboard/DecisionPanel";
import Card from "@/components/ui/Card";

export function generateStaticParams() {
  return applicants.map((a) => ({ id: a.id }));
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const applicant = getApplicantById(id);
  if (!applicant) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Application" />

      <Link href="/dashboard" className="inline-flex w-fit items-center gap-1.5 text-sm text-mist transition-colors hover:text-paper">
        <ArrowLeft className="h-4 w-4" /> Back to queue
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-3 font-display text-lg font-medium">
            {applicant.avatarInitials}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-medium tracking-tight">{applicant.name}</h2>
              <StatusBadge status={applicant.status} />
            </div>
            <p className="mt-1 text-sm text-fog">{applicant.id} · Submitted {new Date(applicant.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="font-display text-2xl font-medium tracking-tight">{formatCurrency(applicant.loanAmount)}</p>
          <p className="text-xs text-fog">{applicant.loanPurpose}</p>
        </div>
      </div>

      <Card className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
        <div>
          <p className="text-xs text-fog">Employer</p>
          <p className="mt-1 text-sm">{applicant.employment.employer}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Title</p>
          <p className="mt-1 text-sm">{applicant.employment.title}</p>
        </div>
        <div>
          <p className="text-xs text-fog">Tenure</p>
          <p className="mt-1 text-sm">{applicant.employment.yearsEmployed} yrs</p>
        </div>
        <div>
          <p className="text-xs text-fog">Monthly income</p>
          <p className="mt-1 text-sm">{formatCurrency(applicant.employment.monthlyIncome)}</p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col gap-6">
          <CreditMemoPanel memo={applicant.creditMemo} />
          <DocumentAnalysisPanel documents={applicant.documents} />
          <div>
            <h3 className="mb-3 font-display text-base font-medium">Audit trail</h3>
            <AuditTrail events={applicant.auditTrail} />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <RiskScoreCard riskScore={applicant.riskScore} />
          <DecisionPanel decision={applicant.officerDecision} />
        </div>
      </div>
    </div>
  );
}
