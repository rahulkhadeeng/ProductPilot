import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | undefined;

export function getStripeClient() {
  stripeClient ??= new Stripe(getRequiredStripeEnv("STRIPE_SECRET_KEY"));

  return stripeClient;
}

export function getStripePriceId() {
  return getRequiredStripeEnv("STRIPE_PRICE_ID");
}

export function getStripeWebhookSecret() {
  return getRequiredStripeEnv("STRIPE_WEBHOOK_SIGNING_SECRET");
}

export function getAppUrl() {
  const configuredUrl =
    process.env.PRODUCTION_URL || process.env.NEXT_PUBLIC_APP_URL;

  return (configuredUrl || "http://localhost:3000").replace(/\/$/, "");
}

function getRequiredStripeEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for Stripe billing.`);
  }

  return value;
}
