"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import clsx from "clsx";
import { updateDecision } from "@/lib/api";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DecisionPanel({
  applicantId,
  currentDecision,
}: {
  applicantId: string;
  currentDecision: "approved" | "rejected" | "pending";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDecision(decision: "approved" | "rejected") {
    setError(null);
    setLoading(decision);
    try {
      await updateDecision(applicantId, decision);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record decision");
    } finally {
      setLoading(null);
    }
  }

  const decided = currentDecision !== "pending";

  return (
    <Card strong className="p-6">
      <h3 className="font-display text-base font-medium">Officer decision</h3>

      {decided ? (
        <div
          className={clsx(
            "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
            currentDecision === "approved" ? "text-approved bg-approved-dim" : "text-rejected bg-rejected-dim"
          )}
        >
          Decision recorded: {currentDecision}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {error && <p className="text-sm text-rejected">{error}</p>}
          <div className="flex gap-3">
            <Button className="flex-1" disabled={loading !== null} onClick={() => handleDecision("approved")}>
              <Check className="h-4 w-4" /> {loading === "approved" ? "Approving…" : "Approve"}
            </Button>
            <Button variant="secondary" className="flex-1" disabled={loading !== null} onClick={() => handleDecision("rejected")}>
              <X className="h-4 w-4" /> {loading === "rejected" ? "Rejecting…" : "Reject"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}