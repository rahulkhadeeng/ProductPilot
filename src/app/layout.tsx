import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { Toaster } from "@/components/ui/sonner";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";

export const metadata: Metadata = {
  title: "Product Pilot",
  description: "Discover and share the latest products in tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
