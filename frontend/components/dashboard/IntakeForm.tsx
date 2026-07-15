"use client";

import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface IntakeFormProps {
  onSubmit: () => void;
}

const purposes = ["Home purchase", "Home refinance", "Auto loan", "Debt consolidation", "Business expansion", "Personal loan"];

export default function IntakeForm({ onSubmit }: IntakeFormProps) {
  const [files, setFiles] = useState<string[]>([]);

  function mockUpload() {
    const names = ["pay_stub_june.pdf", "bank_statement_q2.pdf", "employment_letter.pdf", "government_id.jpg"];
    const next = names[files.length % names.length];
    setFiles((f) => [...f, next]);
  }

  return (
    <Card className="p-7">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Applicant name" placeholder="e.g. Marcus Whitfield" required />
          <Input label="Monthly income" placeholder="e.g. 8,200" required />
          <Input label="Employer" placeholder="e.g. Northgate Logistics" required />
          <Input label="Loan amount" placeholder="e.g. 250,000" required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-mist">Loan purpose</label>
          <select
            required
            defaultValue=""
            className="w-full rounded-lg border border-hairline bg-surface-2 px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-hairline-strong"
          >
            <option value="" disabled>
              Select a purpose
            </option>
            {purposes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-mist">Supporting documents</label>
          <button
            type="button"
            onClick={mockUpload}
            className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-surface-2/40 px-6 py-8 text-center transition-colors hover:bg-surface-2"
          >
            <UploadCloud className="h-6 w-6 text-fog" strokeWidth={1.5} />
            <span className="text-sm text-mist">Click to attach a document</span>
            <span className="text-xs text-fog">Pay stubs, bank statements, ID, employment letters</span>
          </button>

          {files.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {files.map((f, i) => (
                <div key={`${f}-${i}`} className="flex items-center gap-3 rounded-lg border border-hairline bg-surface-2/50 px-3.5 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-fog" strokeWidth={1.6} />
                  <span className="flex-1 truncate text-sm text-mist">{f}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-fog transition-colors hover:text-paper"
                    aria-label={`Remove ${f}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-hairline pt-6">
          <Button type="submit" size="lg">
            Run Agent Analysis
          </Button>
        </div>
      </form>
    </Card>
  );
}
