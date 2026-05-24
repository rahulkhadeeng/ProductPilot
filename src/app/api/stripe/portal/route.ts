import { NextResponse } from "next/server";

import { createBillingPortalSession } from "@/lib/billing";
import { auth } from "@/lib/auth/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = await createBillingPortalSession(session.user.id);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error creating Stripe billing portal session:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not open billing portal.",
      },
      { status: 500 }
    );
  }
}
