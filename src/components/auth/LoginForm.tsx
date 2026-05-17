"use client";

import { Code, Search } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LoginFormProps = {
  className?: string;
  compact?: boolean;
};

export function LoginForm({ className, compact = false }: LoginFormProps) {
  return (
    <Card className={cn("w-full border shadow-none", className)}>
      <CardHeader className="items-center text-center">
        <Image
          src="/logo.svg"
          alt="Product Pilot logo"
          width={compact ? 72 : 88}
          height={compact ? 72 : 88}
          className="mb-2"
          priority={!compact}
        />
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Continue to discover and share new products in tech
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signIn("google", { callbackUrl: "/my-products" })}
        >
          <Search className="text-indigo-500" />
          Continue with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => signIn("github", { callbackUrl: "/my-products" })}
        >
          <Code />
          Continue with GitHub
        </Button>

        <p className="px-4 text-center text-xs leading-5 text-muted-foreground">
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </CardContent>
    </Card>
  );
}
