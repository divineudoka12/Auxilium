import clsx from "clsx";
import type { RiskLevel } from "@/lib/api";

const config: Record<RiskLevel, { label: string; text: string; bg: string; dot: string }> = {
  low: { label: "Low risk", text: "text-approved", bg: "bg-approved-dim", dot: "bg-approved" },
  medium: { label: "Medium risk", text: "text-review", bg: "bg-review-dim", dot: "bg-review" },
  high: { label: "High risk", text: "text-rejected", bg: "bg-rejected-dim", dot: "bg-rejected" },
};

export default function RiskBadge({ level }: { level: RiskLevel | null | undefined }) {
  if (!level) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-3 px-2.5 py-1 text-xs font-medium text-mist">
        <span className="h-1.5 w-1.5 rounded-full bg-fog" />
        Not scored
      </span>
    );
  }
  const c = config[level];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", c.text, c.bg)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}