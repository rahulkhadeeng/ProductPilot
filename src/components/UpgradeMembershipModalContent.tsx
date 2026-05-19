"use client";

import { CheckCircle2, Crown, Rocket } from "lucide-react";

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
  return (
    <div className="flex max-w-md flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-indigo-50 p-3 text-indigo-600">
          <Crown className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Upgrade to Premium</h1>
          <p className="text-sm text-muted-foreground">
            Prepared for Stripe activation in the premium phase.
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
        Checkout will be connected in Phase 7. The account context is ready
        {userEmail ? ` for ${userEmail}` : ""}.
      </div>

      <Button disabled className="w-full gap-2">
        <Rocket className="h-4 w-4" />
        Stripe checkout coming in Phase 7
      </Button>
    </div>
  );
}
