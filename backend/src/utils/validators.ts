import { z } from "zod";

export const applicantSchema = z.object({
  full_name: z.string().min(1),
  monthly_income: z.number().positive(),
  monthly_debt: z.number().min(0),
  employment_status: z.enum(["employed", "self_employed", "unemployed"]),
  credit_score: z.number().min(300).max(850).optional(),
  requested_loan_amount: z.number().positive(),
});
