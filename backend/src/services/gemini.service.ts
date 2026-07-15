import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

/**
 * Sends a prompt to Gemini Flash and returns the raw text response.
 * Used for: risk explanations, credit memo drafting, document field extraction.
 */
export async function askGemini(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
  });
  return response.text ?? "";
}