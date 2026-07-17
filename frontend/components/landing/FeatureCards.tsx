"use client";

import { motion } from "motion/react";
import { Gauge, FileSearch, UserCheck } from "lucide-react";
import Card from "@/components/ui/Card";

const features = [
  {
    icon: Gauge,
    title: "Autonomous Risk Scoring",
    description:
      "Every applicant is scored against debt-to-income, employment stability, and collateral signals the moment a file is submitted no queue, no waiting.",
  },
  {
    icon: FileSearch,
    title: "Intelligent Document Verification",
    description:
      "Pay stubs, bank statements, and employment letters are cross-checked against each other automatically, surfacing discrepancies a first read might miss.",
  },
  {
    icon: UserCheck,
    title: "Officer-in-the-Loop Decisions",
    description:
      "The agent drafts the memo and recommendation. The officer reviews the reasoning, the evidence, and the audit trail and makes the final call.",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-lg text-center"
        >
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Three stages, fully instrumented
          </h2>
          <p className="mt-3 text-mist">From intake to memo, every step is scored, checked, and logged.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <Card hover className="p-7">
                <div className="mb-5 grid h-10 w-10 place-items-center rounded-lg bg-surface-2 border border-hairline">
                  <f.icon className="h-[18px] w-[18px] text-paper" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-medium">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mist">{f.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
