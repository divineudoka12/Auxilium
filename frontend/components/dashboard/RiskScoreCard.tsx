"use client";

import { motion } from "motion/react";
import clsx from "clsx";
import { RiskScore } from "@/lib/types";
import Card from "@/components/ui/Card";

const bandCopy = {
  low: { text: "text-approved", ring: "stroke-approved" },
  medium: { text: "text-review", ring: "stroke-review" },
  high: { text: "text-rejected", ring: "stroke-rejected" },
};

export default function RiskScoreCard({ riskScore }: { riskScore: RiskScore }) {
  const c = bandCopy[riskScore.band];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (riskScore.score / 100) * circumference;

  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-medium">Risk breakdown</h3>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-hairline" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              className={c.ring}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx("font-display text-2xl font-medium", c.text)}>{riskScore.score}</span>
            <span className="text-[11px] text-fog capitalize">{riskScore.band} risk</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-fog">Debt-to-income ratio</p>
          <p className="font-display text-xl font-medium">{Math.round(riskScore.debtToIncome * 100)}%</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-hairline pt-5">
        {riskScore.factors.map((f) => (
          <div key={f.label} className="flex items-start justify-between gap-3 text-sm">
            <div>
              <p className="text-paper">{f.label}</p>
              <p className="mt-0.5 text-xs text-fog">{f.detail}</p>
            </div>
            <span
              className={clsx(
                "shrink-0 rounded-full px-2 py-0.5 text-xs font-mono",
                f.weight < 0 ? "bg-approved-dim text-approved" : "bg-rejected-dim text-rejected"
              )}
            >
              {f.weight > 0 ? "+" : ""}
              {f.weight.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
