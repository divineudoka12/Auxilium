import Link from "next/link";
import Button from "@/components/ui/Button";

export default function ApplicantNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-display text-2xl font-medium">Applicant not found</p>
      <p className="max-w-sm text-sm text-mist">
        This file may have been reassigned or the ID doesn&apos;t match any record in the current queue.
      </p>
      <Link href="/dashboard" className="mt-3">
        <Button size="sm">Back to queue</Button>
      </Link>
    </div>
  );
}
