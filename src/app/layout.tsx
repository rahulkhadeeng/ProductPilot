import type { Metadata } from "next";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { Toaster } from "@/components/ui/sonner";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.PRODUCTION_URL || "http://localhost:3000"
  ),
  title: {
    default: "ProductPilot",
    template: "%s | ProductPilot",
  },
  description:
    "Discover, launch, discuss, and support new products with a creator-first community.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ProductPilot",
    description:
      "Discover, launch, discuss, and support new products with a creator-first community.",
    url: "/",
    siteName: "ProductPilot",
    images: [
      {
        url: "/product-pilot-hero.svg",
        width: 1920,
        height: 1080,
        alt: "ProductPilot product discovery dashboard preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductPilot",
    description:
      "Discover, launch, discuss, and support new products with a creator-first community.",
    images: ["/product-pilot-hero.svg"],
  },
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
