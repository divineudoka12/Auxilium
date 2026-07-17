"use client";

import { CheckCircle2, AlertTriangle, FileX } from "lucide-react";
import Card from "@/components/ui/Card";

interface DocumentAnalysis {
  id: string;
  extracted_fields: Record<string, string | number | null>;
  missing_fields: string[];
  inconsistencies: string[];
}

export default function DocumentAnalysisPanel({ analysis }: { analysis: DocumentAnalysis | null }) {
  if (!analysis) {
    return (
      <Card className="p-6">
        <h3 className="font-display text-base font-medium">Document analysis</h3>
        <div className="mt-5 flex flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong py-8 text-center">
          <FileX className="h-5 w-5 text-fog" strokeWidth={1.5} />
          <p className="text-sm text-mist">No document analyzed yet.</p>
        </div>
      </Card>
    );
  }

  const fieldEntries = Object.entries(analysis.extracted_fields);

  return (
    <Card className="p-6">
      <h3 className="font-display text-base font-medium">Document analysis</h3>
      <p className="mt-1 text-xs text-fog">Extracted from the uploaded supporting document.</p>

      {fieldEntries.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          {fieldEntries.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between rounded-lg border border-hairline bg-surface-2/50 px-3.5 py-2.5 text-sm">
              <span className="flex items-center gap-2 text-mist">
                <CheckCircle2 className="h-4 w-4 text-approved" strokeWidth={1.7} />
                <span className="capitalize">{key.replace(/_/g, " ")}</span>
              </span>
              <span className="font-mono text-xs text-paper">{value ?? "—"}</span>
            </div>
          ))}
        </div>
      )}

      {analysis.missing_fields.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-fog">Missing fields</p>
          <div className="flex flex-wrap gap-2">
            {analysis.missing_fields.map((f) => (
              <span key={f} className="rounded-full bg-review-dim px-2.5 py-1 text-xs text-review capitalize">
                {f.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.inconsistencies.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="mb-1 text-xs font-medium text-fog">Inconsistencies</p>
          {analysis.inconsistencies.map((note) => (
            <div key={note} className="flex items-start gap-2 rounded-lg border border-hairline bg-surface-2/50 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rejected" strokeWidth={1.7} />
              <span className="text-sm text-mist">{note}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}