"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { AuditEvent } from "@/lib/types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const actorColor: Record<AuditEvent["actor"], string> = {
  agent: "text-mist",
  officer: "text-paper",
  system: "text-review",
};

/**
 * Reuses the Agent Terminal's visual language (frosted glass, monospace,
 * traffic-light chrome) to replay a specific applicant's actual event
 * timeline rather than a looping script.
 */
export default function AuditTrail({ events }: { events: AuditEvent[] }) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= events.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 220);
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="glass-strong rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rejected/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-review/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-approved/60" />
        <span className="ml-3 font-mono text-xs text-fog">audit-trail</span>
      </div>

      <div className="scrollbar-thin max-h-[380px] overflow-y-auto px-5 py-5 font-mono text-[13px] leading-7">
        {events.slice(0, visibleCount).map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-baseline gap-x-2"
          >
            <span className="text-fog">{formatTime(e.timestamp)}</span>
            <span className={clsx(actorColor[e.actor])}>[{e.actor}]</span>
            <span className="text-paper">{e.label}</span>
            {e.detail && <span className="text-fog">— {e.detail}</span>}
            {i === visibleCount - 1 && (
              <span className="inline-block w-[7px] h-[15px] bg-paper/80 ml-0.5 translate-y-[2px] animate-blink" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
