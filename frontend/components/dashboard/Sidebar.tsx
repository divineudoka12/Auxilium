"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { LayoutGrid, FolderKanban, FilePlus2, ScrollText, BarChart3, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "Applications", href: "/dashboard/applications", icon: FolderKanban },
  { label: "New Intake", href: "/dashboard/new", icon: FilePlus2 },
  { label: "Audit Logs", href: "/dashboard/audit", icon: ScrollText },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-hairline bg-surface/70 px-4 py-6 backdrop-blur-xl lg:flex">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-paper text-ink font-display text-sm font-semibold">
          C
        </span>
        <span className="font-display text-[15px] font-medium tracking-tight">CreditPilot</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = item.href === "/dashboard" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200",
                active ? "glass text-paper" : "text-mist hover:text-paper hover:bg-surface-2"
              )}
            >
              {active && (
                <span className="absolute inset-0 -z-10 rounded-lg shadow-[0_0_24px_-4px_rgba(255,255,255,0.15)]" />
              )}
              <item.icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="glass rounded-lg px-3.5 py-3 text-xs text-fog">
        <p className="text-mist">Agent uptime</p>
        <p className="mt-1 font-mono text-paper">99.98%</p>
      </div>
    </aside>
  );
}
