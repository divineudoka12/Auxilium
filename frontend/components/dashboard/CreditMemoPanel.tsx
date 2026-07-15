"use client";

import clsx from "clsx";
import { Check, X } from "lucide-react";
import { CreditMemo } from "@/lib/types";
import Card from "@/components/ui/Card";

const recCopy = {
  approve: { label: "Recommend approve", text: "text-approved", bg: "bg-approved-dim" },
  reject: { label: "Recommend reject", text: "text-rejected", bg: "bg-rejected-dim" },
  manual_review: { label: "Recommend manual review", text: "text-review", bg: "bg-review-dim" },
};

export default function CreditMemoPanel({ memo }: { memo: CreditMemo }) {
  const rec = recCopy[memo.recommendation];

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-base font-medium">Credit memo</h3>
        <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", rec.text, rec.bg)}>{rec.label}</span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-mist">{memo.summary}</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-medium text-fog">Strengths</p>
          <ul className="flex flex-col gap-2">
            {memo.strengths.length === 0 && <li className="text-xs text-fog">None identified</li>}
            {memo.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-mist">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-approved" strokeWidth={2} />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-fog">Concerns</p>
          <ul className="flex flex-col gap-2">
            {memo.concerns.length === 0 && <li className="text-xs text-fog">None identified</li>}
            {memo.concerns.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-mist">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rejected" strokeWidth={2} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-5 border-t border-hairline pt-4 text-xs text-fog">
        Generated {new Date(memo.generatedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
      </p>
    </Card>
  );
}
