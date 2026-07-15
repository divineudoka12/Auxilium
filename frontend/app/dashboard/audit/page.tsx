"use client";

import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import { applicants } from "@/lib/mock-data";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AuditLogsPage() {
  const events = applicants
    .flatMap((a) => a.auditTrail.map((e) => ({ ...e, applicantName: a.name, applicantId: a.id })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Audit Logs" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">Audit logs</h2>
        <p className="mt-1 text-sm text-mist">Every agent and officer action, across every applicant, in one ledger.</p>
      </div>

      <Card className="p-5">
        <div className="scrollbar-thin max-h-[560px] overflow-y-auto font-mono text-[13px] leading-7">
          {events.map((e) => (
            <div key={`${e.applicantId}-${e.id}`} className="flex flex-wrap items-baseline gap-x-2 border-b border-hairline py-2 last:border-b-0">
              <span className="text-fog">{formatTime(e.timestamp)}</span>
              <span
                className={
                  e.actor === "agent" ? "text-mist" : e.actor === "officer" ? "text-paper" : "text-review"
                }
              >
                [{e.actor}]
              </span>
              <span className="text-fog">{e.applicantId}</span>
              <span className="text-mist">{e.label}</span>
              {e.detail && <span className="text-fog">— {e.detail}</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
