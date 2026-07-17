"use client";

import clsx from "clsx";
import type { Recommendation } from "@/lib/api";
import Card from "@/components/ui/Card";

const recCopy: Record<Recommendation, { label: string; text: string; bg: string }> = {
  approve: { label: "Recommend approve", text: "text-approved", bg: "bg-approved-dim" },
  reject: { label: "Recommend reject", text: "text-rejected", bg: "bg-rejected-dim" },
  manual_review: { label: "Recommend manual review", text: "text-review", bg: "bg-review-dim" },
};

interface Memo {
  recommendation: Recommendation;
  summary: string;
}

export default function CreditMemoPanel({ memo }: { memo: Memo | null }) {
  if (!memo) {
    return (
      <Card className="p-6">
        <h3 className="font-display text-base font-medium">Credit memo</h3>
        <p className="mt-4 text-sm text-mist">No memo generated yet for this applicant.</p>
      </Card>
    );
  }

  const rec = recCopy[memo.recommendation];

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-medium">Credit memo</h3>
        <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", rec.text, rec.bg)}>{rec.label}</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-mist">{memo.summary}</p>
    </Card>
  );
}