import { PDFParse } from "pdf-parse";
import { DocumentAnalysisResult } from "../types";
import { askGemini } from "./gemini.service";

const REQUIRED_FIELDS = [
    "full_name",
    "monthly_income",
    "employment_status",
    "id_number",
] as const;

/**
 * Extracts raw text from an uploaded PDF buffer, then asks Gemini to pull
 * structured fields out of it and flag anything missing or inconsistent.
 */
export async function analyzeDocument(
    applicantId: string,
    fileBuffer: Buffer,
    applicantClaims: Record<string, string | number>
): Promise<DocumentAnalysisResult> {
    const parser = new PDFParse({ data: fileBuffer });
    const parsed = await parser.getText();
    await parser.destroy();
    const rawText = parsed.text.trim();

    const prompt = `
    You are a document analysis assistant for a loan officer.
    Below is raw text extracted from an applicant's uploaded document,
    followed by what the applicant claims on their application form.

    Extract these fields if present in the document: ${REQUIRED_FIELDS.join(", ")}.
    Then compare each extracted field against the applicant's claim and flag
    any mismatches (e.g. income on the document differs from claimed income).

    Respond ONLY as valid JSON, no markdown, no preamble, in this exact shape:
    {
      "extracted_fields": { "full_name": "...", "monthly_income": 0, "employment_status": "...", "id_number": "..." },
      "missing_fields": ["field_name", ...],
      "inconsistencies": ["plain-English description of each mismatch", ...]
    }

    Document text:
    """${rawText}"""

    Applicant's claimed values:
    ${JSON.stringify(applicantClaims)}
  `;

    const raw = await askGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsedResult: {
        extracted_fields: Record<string, string | number | null>;
        missing_fields: string[];
        inconsistencies: string[];
    };

    try {
        parsedResult = JSON.parse(cleaned);
    } catch {
        // If Gemini didn't return clean JSON, fail safe rather than crash the request.
        parsedResult = {
            extracted_fields: {},
            missing_fields: [...REQUIRED_FIELDS],
            inconsistencies: ["Could not parse document automatically — needs manual review."],
        };
    }

    return {
        applicant_id: applicantId,
        extracted_fields: parsedResult.extracted_fields,
        missing_fields: parsedResult.missing_fields,
        inconsistencies: parsedResult.inconsistencies,
    };
}