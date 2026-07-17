import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import { getApplicants, getApplicantDetail } from "@/lib/api";

export default async function AnalyticsPage() {
  let applicants: Awaited<ReturnType<typeof getApplicants>> = [];
  let flaggedCount = 0;
  let loadError: string | null = null;

  try {
    applicants = await getApplicants();
    const details = await Promise.all(applicants.map((a) => getApplicantDetail(a.id).catch(() => null)));
    flaggedCount = details.reduce((sum, d) => sum + (d?.latest_document_analysis?.inconsistencies.length ?? 0), 0);
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load analytics";
  }

  const totalVolume = applicants.reduce((s, a) => s + a.requested_loan_amount, 0);
  const highRisk = applicants.filter((a) => a.risk_level === "high").length;
  const mediumRisk = applicants.filter((a) => a.risk_level === "medium").length;
  const lowRisk = applicants.filter((a) => a.risk_level === "low").length;

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Analytics" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">Analytics</h2>
        <p className="mt-1 text-sm text-mist">Portfolio-level signal across the current queue.</p>
      </div>

      {loadError ? (
        <Card className="p-6">
          <p className="font-mono text-sm text-rejected">Couldn&apos;t reach the backend</p>
          <p className="mt-2 text-sm text-mist">{loadError}</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Card className="p-6">
              <p className="font-display text-3xl font-medium tracking-tight">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalVolume)}
              </p>
              <p className="mt-1 text-xs text-fog">Total loan volume in queue</p>
            </Card>
            <Card className="p-6">
              <p className="font-display text-3xl font-medium tracking-tight">{highRisk}</p>
              <p className="mt-1 text-xs text-fog">High-risk applicants</p>
            </Card>
            <Card className="p-6">
              <p className="font-display text-3xl font-medium tracking-tight">{flaggedCount}</p>
              <p className="mt-1 text-xs text-fog">Document inconsistencies flagged</p>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Card className="p-5">
              <p className="font-display text-xl font-medium tracking-tight text-approved">{lowRisk}</p>
              <p className="mt-1 text-xs text-fog">Low risk</p>
            </Card>
            <Card className="p-5">
              <p className="font-display text-xl font-medium tracking-tight text-review">{mediumRisk}</p>
              <p className="mt-1 text-xs text-fog">Medium risk</p>
            </Card>
            <Card className="p-5">
              <p className="font-display text-xl font-medium tracking-tight text-rejected">{highRisk}</p>
              <p className="mt-1 text-xs text-fog">High risk</p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}