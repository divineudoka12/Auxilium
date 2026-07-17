import clsx from "clsx";

type OfficerDecision = "approved" | "rejected" | "pending";

const config: Record<OfficerDecision, { label: string; text: string; bg: string; dot: string }> = {
  approved: { label: "Approved", text: "text-approved", bg: "bg-approved-dim", dot: "bg-approved" },
  rejected: { label: "Rejected", text: "text-rejected", bg: "bg-rejected-dim", dot: "bg-rejected" },
  pending: { label: "Pending", text: "text-mist", bg: "bg-surface-3", dot: "bg-fog" },
};

export default function StatusBadge({ status }: { status: OfficerDecision }) {
  const c = config[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", c.text, c.bg)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}