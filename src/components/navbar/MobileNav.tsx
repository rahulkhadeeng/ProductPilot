"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  Dialog,
  DialogClose,
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
  const [open, setOpen] = useState(false);

  return (
    <div className="transition-all lg:hidden">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        >
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
              open ? "translate-y-0 rotate-45" : "-translate-y-1.5 rotate-0"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-200 ease-out ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-out ${
              open ? "translate-y-0 -rotate-45" : "translate-y-1.5 rotate-0"
            }`}
          />
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="!top-[4.75rem] !left-4 !right-4 !w-auto !max-w-none !translate-x-0 !translate-y-0 rounded-2xl border-foreground/10 bg-white/95 p-5 shadow-xl shadow-black/10 backdrop-blur-xl duration-200 sm:!left-auto sm:!right-4 sm:!max-w-sm data-open:slide-in-from-top-2 data-closed:slide-out-to-top-2 supports-[backdrop-filter]:bg-white/85"
        >
          <DialogTitle className="flex items-center justify-start gap-2">
            <Image src="/logo.svg" alt="logo" width={30} height={30} />
            <span className="text-3xl text-indigo-600">ProductPilot</span>
          </DialogTitle>

          <div className="mt-6 flex flex-col gap-5">
            <DialogClose asChild>
              <Link
                href="/products"
                className="text-xl font-medium text-foreground/80 transition-all duration-200 hover:translate-x-1 hover:text-indigo-500"
              >
                Products
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link
                href="/categories"
                className="text-xl font-medium text-foreground/80 transition-all duration-200 hover:translate-x-1 hover:text-indigo-500"
              >
                Categories
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link
                href="/pricing"
                className="text-xl font-medium text-foreground/80 transition-all duration-200 hover:translate-x-1 hover:text-indigo-500"
              >
                Pricing
              </Link>
            </DialogClose>
            <DialogClose asChild>
              <Link
                href="/about"
                className="text-xl font-medium text-foreground/80 transition-all duration-200 hover:translate-x-1 hover:text-indigo-500"
              >
                About
              </Link>
            </DialogClose>
            {isAuthenticated && (
              <DialogClose asChild>
                <Link
                  href="/notifications"
                  className="flex items-center justify-between text-xl font-medium text-foreground/80 transition-all duration-200 hover:translate-x-1 hover:text-indigo-500"
                >
                  <span>Notifications</span>
                  {unreadNotifications > 0 && (
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </Link>
              </DialogClose>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
