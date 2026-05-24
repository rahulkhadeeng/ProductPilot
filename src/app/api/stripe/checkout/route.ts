import { NextResponse } from "next/server";

import { createPremiumCheckoutSession } from "@/lib/billing";
import { auth } from "@/lib/auth/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = await createPremiumCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not create checkout session.",
      },
      { status: 500 }
    );
  }
}
