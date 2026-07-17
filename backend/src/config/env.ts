import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: process.env.PORT ? Number(process.env.PORT) : 4000,

  supabaseUrl: required("SUPABASE_URL"),
  supabaseServiceRoleKey: required("SUPABASE_SERVICE_ROLE_KEY"),

  geminiApiKey: required("GEMINI_API_KEY"),

  // Payment (x402) - optional. If any of these are missing, payment gating
  // is skipped and routes run unpaid (useful for local dev before you have
  // an Agentic Wallet / OKX Dev Portal credentials set up).
  payToAddress: process.env.PAY_TO_ADDRESS,
  okxApiKey: process.env.OKX_API_KEY,
  okxSecretKey: process.env.OKX_SECRET_KEY,
  okxPassphrase: process.env.OKX_PASSPHRASE,
    agentWalletPrivateKey: process.env.PRIVATE_KEY,
};
