"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import clsx from "clsx";
import { OfficerDecision } from "@/lib/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DecisionPanel({ decision }: { decision: OfficerDecision }) {
  const [local, setLocal] = useState(decision);
  const [note, setNote] = useState(decision.note);

  const decided = local.decision !== "pending";

  return (
    <Card strong className="p-6">
      <h3 className="font-display text-base font-medium">Officer decision</h3>

      {decided ? (
        <div className="mt-4">
          <div
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              local.decision === "approved" ? "text-approved bg-approved-dim" : "text-rejected bg-rejected-dim"
            )}
          >
            {local.decision === "approved" ? "Approved" : "Rejected"} by {local.decidedBy || "you"}
          </div>
          {note && <p className="mt-3 text-sm leading-relaxed text-mist">{note}</p>}
          <p className="mt-3 text-xs text-fog">
            {local.decidedAt && new Date(local.decidedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note for the file (optional)"
            rows={3}
            className="w-full resize-none rounded-lg border border-hairline bg-surface-2 px-3.5 py-2.5 text-sm text-paper placeholder:text-fog outline-none transition-colors focus:border-hairline-strong"
          />
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() =>
                setLocal({ decision: "approved", decidedBy: "S. Alaba", note, decidedAt: new Date().toISOString() })
              }
            >
              <Check className="h-4 w-4" /> Approve
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() =>
                setLocal({ decision: "rejected", decidedBy: "S. Alaba", note, decidedAt: new Date().toISOString() })
              }
            >
              <X className="h-4 w-4" /> Reject
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
