"use client";

import Link from "next/link";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import AgentTerminal from "./AgentTerminal";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-24 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[900px]"
        style={{
          background:
            "radial-gradient(600px 420px at 50% 0%, rgba(255,255,255,0.09), transparent 70%), radial-gradient(900px 500px at 80% 10%, rgba(255,255,255,0.04), transparent 60%), radial-gradient(700px 500px at 10% 20%, rgba(255,255,255,0.035), transparent 60%)",
        }}
      />

      {/* Signature circular halo / ring arc, echoing the reference composition */}
      <svg
        aria-hidden
        viewBox="0 0 1000 500"
        className="pointer-events-none absolute left-1/2 top-[70px] z-10 w-[1100px] max-w-none -translate-x-1/2 opacity-70"
      >
        <defs>
          <radialGradient id="ringFade" cx="50%" cy="0%" r="75%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <circle cx="500" cy="60" r="330" fill="none" stroke="url(#ringFade)" strokeWidth="1.5" />
        <circle cx="500" cy="60" r="260" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>

      {/* Diagonal accent rays near the CTA row */}
      <svg aria-hidden className="pointer-events-none absolute left-[6%] top-[420px] z-10 h-24 w-40 opacity-40 sm:top-[460px]">
        <line x1="0" y1="90" x2="120" y2="10" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute right-[6%] top-[380px] z-10 h-24 w-40 opacity-40 sm:top-[420px]">
        <line x1="20" y1="10" x2="140" y2="90" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      </svg>

      <div className="noise-bg absolute inset-0 z-10" />

      <div className="mx-auto max-w-3xl text-center">
        {/* <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-2/60 px-3.5 py-1.5 text-xs text-mist"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-approved" />
          Built for officer-in-the-loop underwriting
        </motion.div> */}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Your agent reads the file
          <br />
          <span className="text-mist">before you do.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mx-auto mt-6 max-w-xl text-balance text-base text-mist sm:text-lg"
        >
          Auxilium autonomously scores risk, cross-checks documents, and drafts the credit memo so loan officers open every file already knowing what matters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link href="/dashboard">
            <Button size="lg">Launch Dashboard</Button>
          </Link>
          <Link href="/dashboard/new">
            <Button size="lg" variant="secondary">
              New Intake
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.28 }}
        className="mx-auto mt-20 max-w-2xl"
      >
        <AgentTerminal />
      </motion.div>
    </section>
  );
}