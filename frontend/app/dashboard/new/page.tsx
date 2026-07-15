"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Topbar from "@/components/dashboard/Topbar";
import IntakeForm from "@/components/dashboard/IntakeForm";
import ProcessingState from "@/components/dashboard/ProcessingState";
import { applicants } from "@/lib/mock-data";

export default function NewIntakePage() {
  const [stage, setStage] = useState<"form" | "processing">("form");
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="New Intake" />

      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">New applicant intake</h2>
        <p className="mt-1 text-sm text-mist">Enter applicant details and the agent will run risk scoring automatically.</p>
      </div>

      <AnimatePresence mode="wait">
        {stage === "form" ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl">
            <IntakeForm onSubmit={() => setStage("processing")} />
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-10"
          >
            <ProcessingState onComplete={() => router.push(`/dashboard/applications/${applicants[3].id}`)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
