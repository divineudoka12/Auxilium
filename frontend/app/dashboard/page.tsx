"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Topbar from "@/components/dashboard/Topbar";
import ApplicantTable from "@/components/dashboard/ApplicantTable";
import { applicants } from "@/lib/mock-data";

export default function DashboardQueuePage() {
  const approved = applicants.filter((a) => a.status === "approved").length;
  const review = applicants.filter((a) => a.status === "manual_review").length;
  const rejected = applicants.filter((a) => a.status === "rejected").length;

  const summary = [
    { label: "In queue", value: applicants.length },
    { label: "Approved", value: approved },
    { label: "Manual review", value: review },
    { label: "Rejected", value: rejected },
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="p-5">
              <p className="font-display text-2xl font-medium tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs text-fog">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <ApplicantTable applicants={applicants} />
    </div>
  );
}
