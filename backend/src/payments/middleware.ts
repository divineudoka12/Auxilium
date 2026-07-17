import { paymentMiddleware, x402ResourceServer } from "@okxweb3/x402-express";
import type { RouteConfig } from "@okxweb3/x402-core/server";
import { ExactEvmScheme } from "@okxweb3/x402-evm/exact/server";
import { OKXFacilitatorClient } from "@okxweb3/x402-core";
import { env } from "../config/env";

const X_LAYER_NETWORK = "eip155:1952";

/**
 * Returns configured x402 payment middleware for the given priced routes,
 * or null if payment credentials aren't set yet (so the app can still run
 * locally without an Agentic Wallet / OKX Dev Portal key during dev).
 *
 * routePricing shape, e.g.: { "POST /score": "$0.01" }
 */
export function buildPaymentMiddleware(routePricing: Record<string, string>) {
  if (!env.payToAddress) {
    console.warn(
      "[payments] PAY_TO_ADDRESS not set - running routes UNPAID. " +
        "Set PAY_TO_ADDRESS (and OKX_API_KEY/OKX_SECRET_KEY/OKX_PASSPHRASE if not using Agentic Wallet) to enable payment gating."
    );
    return null;
  }

  const facilitatorClient = new OKXFacilitatorClient({
    apiKey: env.okxApiKey ?? "",
    secretKey: env.okxSecretKey ?? "",
    passphrase: env.okxPassphrase ?? "",
  });

  const resourceServer = new x402ResourceServer(facilitatorClient);
  resourceServer.register(X_LAYER_NETWORK, new ExactEvmScheme());

  const routes: Record<string, RouteConfig> = {};
  for (const [route, price] of Object.entries(routePricing)) {
    routes[route] = {
      accepts: [
        {
          scheme: "exact",
          network: X_LAYER_NETWORK,
          payTo: env.payToAddress,
          price,
        },
      ],
      description: `Paid access: ${route}`,
      mimeType: "application/json",
    };
  }

  return paymentMiddleware(routes, resourceServer);
}
