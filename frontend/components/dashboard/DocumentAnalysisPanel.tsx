"use client";

import clsx from "clsx";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { DocumentCheck } from "@/lib/types";
import Card from "@/components/ui/Card";

const statusConfig = {
  verified: { icon: CheckCircle2, text: "text-approved" },
  flagged: { icon: AlertTriangle, text: "text-rejected" },
  pending: { icon: Clock, text: "text-review" },
};

export default function DocumentAnalysisPanel({ documents }: { documents: DocumentCheck[] }) {
  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-medium">Document analysis</h3>
      <p className="mt-1 text-xs text-fog">Cross-checked automatically against declared applicant data.</p>

      <div className="mt-5 flex flex-col gap-3">
        {documents.map((doc) => {
          const cfg = statusConfig[doc.status];
          return (
            <div key={doc.id} className="flex items-start gap-3 rounded-lg border border-hairline bg-surface-2/50 p-3.5">
              <cfg.icon className={clsx("mt-0.5 h-4 w-4 shrink-0", cfg.text)} strokeWidth={1.7} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <p className="text-sm">{doc.name}</p>
                  <span className="text-xs text-fog">{doc.uploadedAt}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-mist">{doc.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
