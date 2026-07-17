import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import { getApplicants, getApplicantDetail } from "@/lib/api";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const typeColor: Record<string, string> = {
  score: "text-mist",
  document: "text-review",
  memo: "text-paper",
};

interface CombinedEvent {
  id: string;
  type: string;
  title: string;
  detail: string;
  timestamp: string;
  applicantName: string;
  applicantId: string;
}

export default async function AuditLogsPage() {
  let events: CombinedEvent[] = [];
  let loadError: string | null = null;

  try {
    const applicants = await getApplicants();
    const details = await Promise.all(applicants.map((a) => getApplicantDetail(a.id).catch(() => null)));
    events = details
      .flatMap((d, i) =>
        d ? d.activity.map((e) => ({ ...e, applicantName: applicants[i].full_name, applicantId: applicants[i].id })) : []
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load audit logs";
  }

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Audit Logs" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">Audit logs</h2>
        <p className="mt-1 text-sm text-mist">Every agent action, across every applicant, in one ledger.</p>
      </div>

      {loadError ? (
        <Card className="p-6">
          <p className="font-mono text-sm text-rejected">Couldn&apos;t reach the backend</p>
          <p className="mt-2 text-sm text-mist">{loadError}</p>
        </Card>
      ) : events.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-mist">No activity recorded yet.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="scrollbar-thin max-h-140 overflow-y-auto font-mono text-[13px] leading-7">
            {events.map((e) => (
              <div key={`${e.applicantId}-${e.id}`} className="flex flex-wrap items-baseline gap-x-2 border-b border-hairline py-2 last:border-b-0">
                <span className="text-fog">{formatTime(e.timestamp)}</span>
                <span className={typeColor[e.type] ?? "text-mist"}>[{e.type}]</span>
                <span className="text-fog">{e.applicantName}</span>
                <span className="text-mist">{e.title}</span>
                <span className="text-fog">— {e.detail}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}