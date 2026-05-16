import type { Metadata } from "next";

import Navbar from "@/components/navbar/Navbar";
import { auth } from "@/lib/auth/auth";

import "./globals.css";

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
      <body className="flex min-h-full flex-col">
        <Navbar session={session} />
        {children}
      </body>
    </html>
  );
}
