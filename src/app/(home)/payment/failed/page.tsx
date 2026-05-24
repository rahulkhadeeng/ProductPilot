import Link from "next/link";
import { AlertCircle, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFailedPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-2xl items-center px-6 py-16">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="rounded-md bg-red-50 p-4 text-red-600">
            <AlertCircle className="h-10 w-10" />
          </div>

          <h1 className="mt-6 text-3xl font-bold">Checkout was not completed</h1>
          <p className="mt-3 text-muted-foreground">
            Your account was not charged. You can return to settings and try the
            premium upgrade again whenever you are ready.
          </p>

          <Button asChild className="mt-8 gap-2">
            <Link href="/settings">
              <Crown className="h-4 w-4" />
              Back to membership
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
