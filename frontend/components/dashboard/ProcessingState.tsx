"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import Card from "@/components/ui/Card";

const steps = [
  { title: "Scoring applicant...", duration: 1400 },
  { title: "Cross-checking documents...", duration: 1600 },
  { title: "Generating memo...", duration: 1300 },
];

export default function ProcessingState({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    if (activeStep >= steps.length) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDone((d) => d.map((v, i) => (i === activeStep ? true : v)));
      setActiveStep((s) => s + 1);
    }, steps[activeStep].duration);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep]);

  return (
    <Card strong className="mx-auto max-w-md p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-approved animate-pulse" />
        <p className="font-mono text-xs text-fog">agent-analysis</p>
      </div>

      <div className="flex flex-col gap-5">
        {steps.map((step, i) => {
          const isDone = done[i];
          const isActive = activeStep === i;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i <= activeStep ? 1 : 0.35, x: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span
                className={clsx(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border",
                  isDone ? "border-approved bg-approved-dim" : isActive ? "border-hairline-strong" : "border-hairline"
                )}
              >
                {isDone ? (
                  <Check className="h-3.5 w-3.5 text-approved" />
                ) : isActive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-paper" />
                ) : (
                  <span className="text-xs text-fog">{i + 1}</span>
                )}
              </span>
              <div>
                <p className={clsx("text-sm", isDone || isActive ? "text-paper" : "text-fog")}>Step {i + 1}</p>
                <p className={clsx("text-sm", isDone || isActive ? "text-mist" : "text-fog")}>{step.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
