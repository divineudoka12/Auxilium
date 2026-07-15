"use client";

import Topbar from "@/components/dashboard/Topbar";
import ApplicantTable from "@/components/dashboard/ApplicantTable";
import { applicants } from "@/lib/mock-data";

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Applications" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">All applications</h2>
        <p className="mt-1 text-sm text-mist">Complete history of intakes processed by the agent.</p>
      </div>
      <ApplicantTable applicants={applicants} />
    </div>
  );
}
