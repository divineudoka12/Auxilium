import Topbar from "@/components/dashboard/Topbar";
import ApplicantTable from "@/components/dashboard/ApplicantTable";
import Card from "@/components/ui/Card";
import { getApplicants } from "@/lib/api";

export default async function ApplicationsPage() {
  let applicants: Awaited<ReturnType<typeof getApplicants>> = [];
  let loadError: string | null = null;

  try {
    applicants = await getApplicants();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load applicants";
  }

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Applications" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">All applications</h2>
        <p className="mt-1 text-sm text-mist">Complete history of intakes processed by the agent.</p>
      </div>

      {loadError ? (
        <Card className="p-6">
          <p className="font-mono text-sm text-rejected">Couldn&apos;t reach the backend</p>
          <p className="mt-2 text-sm text-mist">{loadError}</p>
        </Card>
      ) : applicants.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-mist">No applications yet.</p>
        </Card>
      ) : (
        <ApplicantTable applicants={applicants} />
      )}
    </div>
  );
}