import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  markSubscriptionCanceled,
  updateUserFromCheckoutSession,
  updateUserSubscriptionState,
} from "@/lib/billing";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  const stripe = getStripeClient();

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret()
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid webhook signature.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await updateUserFromCheckoutSession(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await updateUserSubscriptionState({
          userId: subscription.metadata?.userId,
          stripeCustomerId:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          subscription,
        });
        break;
      }

      case "customer.subscription.deleted":
        await markSubscriptionCanceled(event.data.object as Stripe.Subscription);
        break;

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error handling Stripe webhook ${event.type}:`, error);

    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
