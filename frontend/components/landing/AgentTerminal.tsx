"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { terminalScript } from "@/lib/mock-data";

interface AgentTerminalProps {
  lines?: string[];
  title?: string;
  loop?: boolean;
  typeSpeed?: number;
}

/**
 * CreditPilot's signature branding element: a terminal that continuously
 * types out realistic autonomous-underwriting events, one character at a
 * time, then clears and loops. Also reused in the Applicant Detail audit
 * trail to replay a specific applicant's actual event timeline.
 */
export default function AgentTerminal({
  lines = terminalScript,
  title = "agent-activity",
  loop = true,
  typeSpeed = 28,
}: AgentTerminalProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= lines.length) {
      if (!loop) return;
      const resetTimer = setTimeout(() => {
        setHistory([]);
        setCurrent("");
        setLineIndex(0);
      }, 1600);
      return () => clearTimeout(resetTimer);
    }

    const targetLine = lines[lineIndex];
    if (current.length < targetLine.length) {
      const t = setTimeout(() => setCurrent(targetLine.slice(0, current.length + 1)), typeSpeed);
      return () => clearTimeout(t);
    }

    const holdTimer = setTimeout(() => {
      setHistory((h) => [...h, targetLine]);
      setCurrent("");
      setLineIndex((i) => i + 1);
    }, 550);
    return () => clearTimeout(holdTimer);
  }, [current, lineIndex, lines, loop, typeSpeed]);

  const visibleHistory = history.slice(-7);

  return (
    <div className="glass-strong noise-bg rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rejected/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-review/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-approved/60" />
        <span className="ml-3 font-mono text-xs text-fog">{title}</span>
        <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-fog">
          <span className="h-1.5 w-1.5 rounded-full bg-approved animate-pulse" />
          live
        </span>
      </div>
      <div className="px-5 py-6 font-mono text-[13px] leading-7 min-h-[260px] sm:min-h-[280px]">
        <AnimatePresence initial={false}>
          {visibleHistory.map((line, i) => (
            <motion.div
              key={`${lineIndex}-${i}-${line}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 0.45, y: 0 }}
              className="text-mist"
            >
              <span className="text-fog">&gt;</span> {line}
            </motion.div>
          ))}
        </AnimatePresence>
        {lineIndex < lines.length && (
          <div className="text-paper">
            <span className="text-fog">&gt;</span> {current}
            <span className="inline-block w-[7px] h-[15px] bg-paper/80 ml-0.5 translate-y-[2px] animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
