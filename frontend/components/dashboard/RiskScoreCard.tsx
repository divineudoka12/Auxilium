"use client";

import { motion } from "motion/react";
import clsx from "clsx";
import { AlertTriangle } from "lucide-react";
import type { ScoreResult } from "@/lib/api";
import Card from "@/components/ui/Card";

const bandCopy = {
  low: { text: "text-approved", ring: "stroke-approved" },
  medium: { text: "text-review", ring: "stroke-review" },
  high: { text: "text-rejected", ring: "stroke-rejected" },
};

export default function RiskScoreCard({ score }: { score: ScoreResult }) {
  const c = bandCopy[score.risk_level];
  const circumference = 2 * Math.PI * 42;
  const confidencePct = Math.round(score.confidence * 100);
  const offset = circumference - (confidencePct / 100) * circumference;

  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-medium">Risk assessment</h3>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-hairline" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
              className={c.ring}
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={clsx("font-display text-2xl font-medium", c.text)}>{confidencePct}%</span>
            <span className="text-[11px] text-fog capitalize">{score.risk_level} risk</span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-fog">Affordability ratio</p>
          <p className="font-display text-xl font-medium">{Math.round(score.affordability_ratio * 100)}%</p>
          <p className="mt-3 text-xs text-fog">Model confidence shown in ring above</p>
        </div>
      </div>

      <p className="mt-6 border-t border-hairline pt-5 text-sm leading-relaxed text-mist">{score.explanation}</p>

      {score.flags.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          {score.flags.map((flag) => (
            <div key={flag} className="flex items-start gap-2 text-sm">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-review" strokeWidth={1.8} />
              <span className="text-mist">{flag}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}