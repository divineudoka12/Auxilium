"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Check, UploadCloud, FileText } from "lucide-react";
import clsx from "clsx";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createApplicant, analyzeDocument, generateMemo } from "@/lib/api";

type Step = "form" | "document" | "memo" | "done";

const steps: { key: Step; label: string }[] = [
  { key: "form", label: "Applicant" },
  { key: "document", label: "Document" },
  { key: "memo", label: "Memo" },
];

export default function NewIntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    monthly_income: "",
    monthly_debt: "",
    employment_status: "employed" as "employed" | "self_employed" | "unemployed",
    credit_score: "",
    requested_loan_amount: "",
  });

  async function handleSubmitApplicant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await createApplicant({
        full_name: form.full_name,
        monthly_income: Number(form.monthly_income),
        monthly_debt: Number(form.monthly_debt),
        employment_status: form.employment_status,
        credit_score: form.credit_score ? Number(form.credit_score) : undefined,
        requested_loan_amount: Number(form.requested_loan_amount),
      });
      setApplicantId(result.applicant_id);
      setStep("document");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to score applicant");
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadDocument() {
    if (!applicantId || !file) return;
    setError(null);
    setLoading(true);
    try {
      await analyzeDocument(applicantId, file);
      setStep("memo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze document");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateMemo() {
    if (!applicantId) return;
    setError(null);
    setLoading(true);
    try {
      await generateMemo(applicantId);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate memo");
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="New Intake" />

      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">New applicant intake</h2>
        <p className="mt-1 text-sm text-mist">Enter applicant details and the agent will run risk scoring automatically.</p>
      </div>

      {step !== "done" && (
        <div className="flex items-center gap-2 font-mono text-xs">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                  i < stepIndex
                    ? "border-approved bg-approved-dim text-approved"
                    : i === stepIndex
                    ? "border-hairline-strong text-paper"
                    : "border-hairline text-fog"
                )}
              >
                {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={i === stepIndex ? "text-paper" : "text-fog"}>{s.label}</span>
              {i < steps.length - 1 && <span className="mx-1 text-fog">→</span>}
            </div>
          ))}
        </div>
      )}

      {error && (
        <Card className="p-4">
          <p className="font-mono text-xs text-rejected">{error}</p>
        </Card>
      )}

      <div className="max-w-xl">
        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-7">
                <form onSubmit={handleSubmitApplicant} className="flex flex-col gap-5">
                  <Input
                    label="Full name"
                    required
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Monthly income"
                      type="number"
                      required
                      value={form.monthly_income}
                      onChange={(e) => setForm({ ...form, monthly_income: e.target.value })}
                    />
                    <Input
                      label="Monthly debt"
                      type="number"
                      required
                      value={form.monthly_debt}
                      onChange={(e) => setForm({ ...form, monthly_debt: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-mist">Employment status</label>
                    <select
                      value={form.employment_status}
                      onChange={(e) => setForm({ ...form, employment_status: e.target.value as typeof form.employment_status })}
                      className="w-full rounded-lg border border-hairline bg-surface-2 px-4 py-2.5 text-sm text-paper outline-none transition-colors focus:border-hairline-strong"
                    >
                      <option value="employed">Employed</option>
                      <option value="self_employed">Self-employed</option>
                      <option value="unemployed">Unemployed</option>
                    </select>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input
                      label="Credit score (optional)"
                      type="number"
                      value={form.credit_score}
                      onChange={(e) => setForm({ ...form, credit_score: e.target.value })}
                    />
                    <Input
                      label="Requested loan amount"
                      type="number"
                      required
                      value={form.requested_loan_amount}
                      onChange={(e) => setForm({ ...form, requested_loan_amount: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end border-t border-hairline pt-6">
                    <Button type="submit" size="lg" disabled={loading}>
                      {loading ? "Scoring…" : "Run Agent Analysis"}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {step === "document" && (
            <motion.div key="document" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-7">
                <p className="text-sm text-mist">Upload a supporting document (PDF) to cross-check against the applicant&apos;s claims.</p>

                <label className="mt-5 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-surface-2/40 px-6 py-8 text-center transition-colors hover:bg-surface-2">
                  <UploadCloud className="h-6 w-6 text-fog" strokeWidth={1.5} />
                  <span className="text-sm text-mist">Click to attach a PDF</span>
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>

                {file && (
                  <div className="mt-3 flex items-center gap-3 rounded-lg border border-hairline bg-surface-2/50 px-3.5 py-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-fog" strokeWidth={1.6} />
                    <span className="flex-1 truncate text-sm text-mist">{file.name}</span>
                  </div>
                )}

                <div className="mt-6 flex justify-end border-t border-hairline pt-6">
                  <Button size="lg" disabled={!file || loading} onClick={handleUploadDocument}>
                    {loading ? "Analyzing…" : "Analyze Document"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "memo" && (
            <motion.div key="memo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Card className="p-7">
                <p className="text-sm text-mist">Score and document analysis are complete. Generate the credit memo recommendation.</p>
                <div className="mt-6 flex justify-end border-t border-hairline pt-6">
                  <Button size="lg" disabled={loading} onClick={handleGenerateMemo}>
                    {loading ? "Drafting memo…" : "Generate Credit Memo"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === "done" && applicantId && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <Card strong className="flex flex-col items-center gap-4 p-10 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-approved-dim text-approved">
                  <Check className="h-5 w-5" />
                </span>
                <p className="text-sm text-mist">Application fully prepared and ready for officer review.</p>
                <Button size="lg" onClick={() => router.push(`/dashboard/applications/${applicantId}`)}>
                  View Application
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}