"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function ManageBilling() {
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Could not open billing portal.");
      }

      window.location.assign(data.url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not open billing portal.",
        { position: "top-right" }
      );
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="gap-2"
      onClick={openPortal}
      disabled={loading}
    >
      <CreditCard className="h-4 w-4" />
      {loading ? "Opening..." : "Manage Billing"}
    </Button>
  );
}
