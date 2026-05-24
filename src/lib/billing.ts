import Stripe from "stripe";

import { prisma as db } from "@/lib/prisma";
import { getAppUrl, getStripeClient, getStripePriceId } from "@/lib/stripe";

const PREMIUM_STATUSES = new Set(["active", "trialing"]);

export async function createPremiumCheckoutSession({
  userId,
  email,
}: {
  userId: string;
  email?: string | null;
}) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const appUrl = getAppUrl();
  const priceId = getStripePriceId();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeCustomerId ?? undefined,
    customer_email: user.stripeCustomerId
      ? undefined
      : email ?? user.email ?? undefined,
    client_reference_id: user.id,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    success_url: `${appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/payment/failed`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return session.url;
}

export async function createBillingPortalSession(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      stripeCustomerId: true,
    },
  });

  if (!user?.stripeCustomerId) {
    throw new Error("No Stripe customer is connected to this account.");
  }

  const stripe = getStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getAppUrl()}/settings`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a billing portal URL.");
  }

  return session.url;
}

export async function syncCheckoutSession(sessionId: string, userId: string) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  const sessionUserId = session.metadata?.userId ?? session.client_reference_id;

  if (sessionUserId !== userId) {
    throw new Error("Checkout session does not belong to this account.");
  }

  if (session.mode !== "subscription" || session.payment_status !== "paid") {
    return false;
  }

  await updateUserFromCheckoutSession(session);

  return true;
}

export async function updateUserFromCheckoutSession(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId ?? session.client_reference_id;

  if (!userId || !session.customer || !session.subscription) {
    return;
  }

  const subscription =
    typeof session.subscription === "string"
      ? await getStripeClient().subscriptions.retrieve(session.subscription)
      : session.subscription;

  await updateUserSubscriptionState({
    userId,
    stripeCustomerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer.id,
    subscription,
  });
}

export async function updateUserSubscriptionState({
  userId,
  stripeCustomerId,
  subscription,
}: {
  userId?: string | null;
  stripeCustomerId?: string | null;
  subscription: Stripe.Subscription;
}) {
  const metadataUserId = userId ?? subscription.metadata?.userId;
  const subscriptionItem = subscription.items.data[0];
  const priceId = subscriptionItem?.price.id ?? null;
  const currentPeriodEnd = subscriptionItem?.current_period_end
    ? new Date(subscriptionItem.current_period_end * 1000)
    : null;
  const isPremium = PREMIUM_STATUSES.has(subscription.status);

  await db.user.updateMany({
    where: {
      OR: [
        ...(metadataUserId ? [{ id: metadataUserId }] : []),
        { stripeSubscriptionId: subscription.id },
        ...(stripeCustomerId ? [{ stripeCustomerId }] : []),
      ],
    },
    data: {
      isPremium,
      stripeCustomerId: stripeCustomerId ?? undefined,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      stripeSubscriptionStatus: subscription.status,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    },
  });
}

export async function markSubscriptionCanceled(subscription: Stripe.Subscription) {
  await db.user.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      isPremium: false,
      stripeSubscriptionStatus: subscription.status,
      stripeCurrentPeriodEnd: subscription.items.data[0]?.current_period_end
        ? new Date(subscription.items.data[0].current_period_end * 1000)
        : null,
    },
  });
}
