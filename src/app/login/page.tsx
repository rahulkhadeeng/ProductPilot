import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { auth } from "@/lib/auth/auth";

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect("/my-products");
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <section className="hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-medium">
          <Image src="/logo.svg" alt="Product Pilot" width={32} height={32} />
          Product Pilot
        </Link>

        <blockquote className="max-w-xl space-y-3">
          <p className="text-2xl font-medium leading-9">
            “Join our community of friendly folks discovering and sharing the
            latest product in tech.”
          </p>
          <footer className="text-sm text-zinc-400">Product Pilot</footer>
        </blockquote>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
