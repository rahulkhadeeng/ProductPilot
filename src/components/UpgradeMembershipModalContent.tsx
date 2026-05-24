"use client";

import { useState } from "react";
import { CheckCircle2, Crown, Rocket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type UpgradeMembershipModalContentProps = {
  userEmail?: string | null;
};

const premiumBenefits = [
  "Unlimited product submissions",
  "Priority review queue",
  "Billing and subscription management",
  "Premium creator badge",
];

export default function UpgradeMembershipModalContent({
  userEmail,
}: UpgradeMembershipModalContentProps) {
  const [loading, setLoading] = useState(false);

  const startCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not start checkout.");
      }

      window.location.assign(data.url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not start checkout.",
        { position: "top-right" }
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-indigo-50 p-3 text-indigo-600">
          <Crown className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Upgrade to Premium</h1>
          <p className="text-sm text-muted-foreground">
            Unlock unlimited launches with secure Stripe billing.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {premiumBenefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-indigo-600" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>

      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        Checkout will open in Stripe
        {userEmail ? ` for ${userEmail}` : ""}. Your premium status updates
        automatically after payment.
      </div>

      <Button onClick={startCheckout} disabled={loading} className="w-full gap-2">
        <Rocket className="h-4 w-4" />
        {loading ? "Opening Stripe..." : "Continue to Stripe"}
      </Button>
    </div>
  );
}
