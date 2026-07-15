"use client";

import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import { applicants, impactStats } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const avgScore = Math.round(applicants.reduce((s, a) => s + a.riskScore.score, 0) / applicants.length);
  const totalVolume = applicants.reduce((s, a) => s + a.loanAmount, 0);
  const flaggedDocs = applicants.flatMap((a) => a.documents).filter((d) => d.status === "flagged").length;

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Analytics" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">Analytics</h2>
        <p className="mt-1 text-sm text-mist">Portfolio-level signal across the current queue.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <p className="font-display text-3xl font-medium tracking-tight">{avgScore}</p>
          <p className="mt-1 text-xs text-fog">Average risk score</p>
        </Card>
        <Card className="p-6">
          <p className="font-display text-3xl font-medium tracking-tight">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalVolume)}
          </p>
          <p className="mt-1 text-xs text-fog">Total loan volume in queue</p>
        </Card>
        <Card className="p-6">
          <p className="font-display text-3xl font-medium tracking-tight">{flaggedDocs}</p>
          <p className="mt-1 text-xs text-fog">Documents flagged</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {impactStats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="font-display text-xl font-medium tracking-tight">{s.value}</p>
            <p className="mt-1 text-xs text-fog">{s.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
