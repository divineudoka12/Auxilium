import { wrapFetchWithPaymentFromConfig } from "@okxweb3/x402-fetch";
import { ExactEvmScheme, toClientEvmSigner } from "@okxweb3/x402-evm";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { xLayer } from "viem/chains";
import { env } from "../config/env";

const account = privateKeyToAccount(
  env.agentWalletPrivateKey as `0x${string}`
);

const publicClient = createPublicClient({
  chain: xLayer,
  transport: http(),
});

const signer = toClientEvmSigner(account, publicClient);

export const fetchWithAgentPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [
    {
      network: "eip155:196",
      client: new ExactEvmScheme(signer),
    },
  ],
});