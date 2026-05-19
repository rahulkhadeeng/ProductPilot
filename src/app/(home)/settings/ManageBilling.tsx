"use client";

import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function ManageBilling() {
  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={() =>
        toast.info("Billing portal will be connected in Phase 7.", {
          position: "top-right",
        })
      }
    >
      <CreditCard className="h-4 w-4" />
      Manage Billing
    </Button>
  );
}
