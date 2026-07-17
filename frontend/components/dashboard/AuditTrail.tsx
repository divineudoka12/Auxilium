"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import type { ActivityEvent } from "@/lib/api";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

const typeColor: Record<ActivityEvent["type"], string> = {
  score: "text-mist",
  document: "text-review",
  memo: "text-paper",
};

const typeLabel: Record<ActivityEvent["type"], string> = {
  score: "risk score",
  document: "document",
  memo: "credit memo",
};

export default function AuditTrail({ events }: { events: ActivityEvent[] }) {
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

      {events.length === 0 ? (
        <div className="px-5 py-8 text-center font-mono text-xs text-fog">No activity yet for this applicant.</div>
      ) : (
        <div className="scrollbar-thin max-h-95 overflow-y-auto px-5 py-5 font-mono text-[13px] leading-7">
          {events.slice(0, visibleCount).map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <span className="text-fog">{formatTime(e.timestamp)}</span>
              <span className={clsx(typeColor[e.type])}>[{typeLabel[e.type]}]</span>
              <span className="text-paper">{e.title}</span>
              <span className="text-fog">— {e.detail}</span>
              {i === visibleCount - 1 && (
                <span className="inline-block w-1.75 h-3.75 bg-paper/80 ml-0.5 translate-y-0.5 animate-blink" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}