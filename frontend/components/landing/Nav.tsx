"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";

const links = [
  { label: "Features", href: "#features" },
  { label: "Documentation", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 z-50 w-[min(920px,calc(100%-2rem))] -translate-x-1/2"
    >
      <div className="glass-strong flex items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-paper text-ink font-display font-semibold text-sm">
            A
          </span>
          <span className="font-display text-[15px] font-medium tracking-tight">Auxilium</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm text-mist transition-colors hover:text-paper">
              {l.label}
            </a>
          ))}
        </nav>

        <Link href="/dashboard">
          <Button size="sm">Launch Dashboard</Button>
        </Link>
      </div>
    </motion.header>
  );
}
