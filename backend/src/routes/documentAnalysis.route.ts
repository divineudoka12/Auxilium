import { Router } from "express";
import multer from "multer";
import { analyzeDocument } from "../services/documentAnalysis.service";
import { supabase } from "../db/client";

export const documentAnalysisRouter = Router();

// Keep uploads in memory - we only need the buffer momentarily to parse text,
// no need to persist the raw file for the hackathon MVP.
const upload = multer({ storage: multer.memoryStorage() });

// POST /analyze-document
// multipart/form-data with fields:
//   - applicant_id (string, must already exist from /score)
//   - document (the PDF file)
documentAnalysisRouter.post("/analyze-document", upload.single("document"), async (req, res) => {
  const { applicant_id } = req.body;

  if (!applicant_id) {
    return res.status(400).json({ error: "applicant_id is required" });
  }
  if (!req.file) {
    return res.status(400).json({ error: "document file is required (field name: 'document')" });
  }

  // 1. Confirm the applicant exists and grab their claimed values to cross-check against
  const { data: applicant, error: applicantError } = await supabase
    .from("applicants")
    .select("*")
    .eq("id", applicant_id)
    .single();

  if (applicantError || !applicant) {
    return res.status(404).json({ error: "Applicant not found" });
  }

  // 2. Run the analysis
  const result = await analyzeDocument(applicant_id, req.file.buffer, {
    full_name: applicant.full_name,
    monthly_income: applicant.monthly_income,
    employment_status: applicant.employment_status,
  });

  // 3. Save it
  const { error: saveError } = await supabase.from("document_analyses").insert({
    applicant_id: result.applicant_id,
    extracted_fields: result.extracted_fields,
    missing_fields: result.missing_fields,
    inconsistencies: result.inconsistencies,
  });

  if (saveError) {
    return res.status(500).json({ error: "Failed to save document analysis", details: saveError });
  }

  return res.status(200).json(result);
});