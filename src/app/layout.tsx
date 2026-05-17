import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth/auth";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Product Pilot",
  description: "Discover and share the latest products in tech",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full antialiased">
      <body className={`flex min-h-full flex-col ${font.className}`}>
        <Navbar session={session} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
