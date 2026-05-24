import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Crown, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { syncCheckoutSession } from "@/lib/billing";

type PaymentSuccessPageProps = {
  searchParams: Promise<{
    session_id?: string;
  }>;
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { session_id: sessionId } = await searchParams;
  let synced = false;

  if (sessionId) {
    synced = await syncCheckoutSession(sessionId, session.user.id).catch(
      (error) => {
        console.error("Unable to sync checkout session:", error);
        return false;
      }
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-2xl items-center px-6 py-16">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="rounded-md bg-emerald-50 p-4 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">Premium is active</h1>
          <p className="mt-3 text-muted-foreground">
            {synced
              ? "Your account has been upgraded and is ready for unlimited launches."
              : "Stripe accepted the payment. If your badge has not updated yet, the webhook should finish shortly."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="gap-2">
              <Link href="/new-product">
                <Package className="h-4 w-4" />
                Launch a product
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/settings">
                <Crown className="h-4 w-4" />
                View membership
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
