"use client";

import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type MobileNavProps = {
  isAuthenticated?: boolean;
  unreadNotifications?: number;
};

export default function MobileNav({
  isAuthenticated = false,
  unreadNotifications = 0,
}: MobileNavProps) {
  return (
    <div className="mt-2 transition-all lg:hidden">
      <Dialog>
        <DialogTrigger aria-label="Open navigation">
          <MenuIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="flex items-center justify-start gap-2">
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <span className="text-3xl text-indigo-600">Product Pilot</span>
          </DialogTitle>

          <div className="mt-6 flex flex-col gap-5">
            <Link
              href="/products"
              className="text-xl font-medium text-foreground/80 transition-all hover:text-indigo-500"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-xl font-medium text-foreground/80 transition-all hover:text-indigo-500"
            >
              Categories
            </Link>
            <Link
              href="/pricing"
              className="text-xl font-medium text-foreground/80 transition-all hover:text-indigo-500"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-xl font-medium text-foreground/80 transition-all hover:text-indigo-500"
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                href="/notifications"
                className="flex items-center justify-between text-xl font-medium text-foreground/80 transition-all hover:text-indigo-500"
              >
                <span>Notifications</span>
                {unreadNotifications > 0 && (
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </Link>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
