import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Topbar from "@/components/dashboard/Topbar";
import ApplicantTable from "@/components/dashboard/ApplicantTable";
import { getApplicants } from "@/lib/api";

export default async function DashboardQueuePage() {
  let applicants: Awaited<ReturnType<typeof getApplicants>> = [];
  let loadError: string | null = null;

  try {
    applicants = await getApplicants();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load applicants";
  }

  const needsReview = applicants.filter((a) => a.recommendation === "manual_review").length;
  const highRisk = applicants.filter((a) => a.risk_level === "high").length;
  const approved = applicants.filter((a) => a.officer_decision === "approved").length;

  const summary = [
    { label: "In queue", value: applicants.length },
    { label: "Approved", value: approved },
    { label: "Needs review", value: needsReview },
    { label: "High risk", value: highRisk },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Dashboard" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-medium tracking-tight">Applicant queue</h2>
          <p className="mt-1 text-sm text-mist">Every file the agent has scored, ranked by submission time.</p>
        </div>
        <Link href="/dashboard/new">
          <Button>New Applicant Intake</Button>
        </Link>
      </div>

      {loadError ? (
        <Card className="p-6">
          <p className="font-mono text-sm text-rejected">Couldn&apos;t reach the backend</p>
          <p className="mt-2 text-sm text-mist">{loadError}</p>
          <p className="mt-3 text-xs text-fog">Confirm the API is running and NEXT_PUBLIC_API_URL is set correctly.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {summary.map((s) => (
              <Card key={s.label} className="p-5">
                <p className="font-display text-2xl font-medium tracking-tight">{s.value}</p>
                <p className="mt-1 text-xs text-fog">{s.label}</p>
              </Card>
            ))}
          </div>

          {applicants.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-sm text-mist">No applications yet.</p>
            </Card>
          ) : (
            <ApplicantTable applicants={applicants} />
          )}
        </>
      )}
    </div>
  );
}