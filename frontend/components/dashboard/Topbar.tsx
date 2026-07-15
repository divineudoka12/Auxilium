"use client";

import Link from "next/link";
import { Search, Bell, Plus } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Topbar({ title }: { title: string }) {
  return (
    <div className="glass sticky top-0 z-30 flex items-center gap-4 rounded-xl px-4 py-3.5 sm:px-5">
      <h1 className="hidden font-display text-lg font-medium tracking-tight sm:block">{title}</h1>

      <div className="relative ml-auto flex max-w-xs flex-1 items-center sm:ml-0">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-fog" />
        <input
          type="text"
          placeholder="Search applicants, IDs..."
          className="w-full rounded-full border border-hairline bg-surface-2 py-2 pl-9 pr-3 text-sm text-paper placeholder:text-fog outline-none transition-colors focus:border-hairline-strong"
        />
      </div>

      <button
        aria-label="Notifications"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-hairline text-mist transition-colors hover:text-paper"
      >
        <Bell className="h-4 w-4" strokeWidth={1.6} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-review" />
      </button>

      <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-3 font-display text-xs font-medium">
          SA
        </span>
        <div className="leading-tight">
          <p className="text-sm">S. Alaba</p>
          <p className="text-xs text-fog">Loan Officer</p>
        </div>
      </div>

      <Link href="/dashboard/new" className="shrink-0">
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Applicant</span>
        </Button>
      </Link>
    </div>
  );
}
