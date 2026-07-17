"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import type { Applicant } from "@/lib/api";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default function ApplicantTable({ applicants }: { applicants: Applicant[] }) {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="hidden grid-cols-[1.6fr_1fr_0.9fr_0.9fr_0.9fr_28px] gap-4 border-b border-hairline px-5 py-3 text-xs text-fog sm:grid">
        <span>Applicant</span>
        <span>Requested</span>
        <span>Risk</span>
        <span>Status</span>
        <span>Submitted</span>
        <span />
      </div>

      <div>
        {applicants.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.04 }}>
            <Link
              href={`/dashboard/applications/${a.id}`}
              className="grid grid-cols-2 items-center gap-3 border-b border-hairline px-5 py-4 text-sm transition-colors duration-200 last:border-b-0 hover:bg-surface-2/60 sm:grid-cols-[1.6fr_1fr_0.9fr_0.9fr_0.9fr_28px] sm:gap-4"
            >
              <div className="col-span-2 flex items-center gap-3 sm:col-span-1">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-3 font-display text-xs font-medium">
                  {initials(a.full_name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate">{a.full_name}</p>
                  <p className="truncate text-xs text-fog">#{a.id.slice(0, 8)}</p>
                </div>
              </div>

              <span className="text-mist">{formatCurrency(a.requested_loan_amount)}</span>

              <RiskBadge level={a.risk_level} />

              <StatusBadge status={a.officer_decision ?? "pending"} />

              <span className="text-mist">{formatDate(a.created_at)}</span>

              <ChevronRight className="hidden h-4 w-4 text-fog sm:block" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}