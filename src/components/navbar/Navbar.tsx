"use client";

import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AuthButtons from "./AuthButtons";
import AuthContent from "./AuthContent";
import AvatarMenu from "./AvatarMenu";
import Menu from "./Menu";
import MobileNav from "./MobileNav";
import NotificationIcon, { type NavbarNotification } from "./NotificationIcon";
import SubmitButton from "./SubmitButton";

type NavbarProps = {
  session: Session | null;
  notifications?: NavbarNotification[];
  products?: unknown;
  isAdmin?: boolean;
};

export default function Navbar({
  session,
  notifications = [],
  isAdmin = false,
}: NavbarProps) {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const unreadNotifications = notifications.filter(
    (notification) => notification.status === "UNREAD"
  ).length;

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 px-4 transition-all duration-300 ease-out ${
        isScrolled ? "py-2" : "border-b bg-white py-3"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-out ${
          isScrolled
            ? "max-w-5xl rounded-full border border-foreground/10 bg-white/80 px-3 py-1.5 shadow-lg shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 md:px-4"
            : "max-w-screen-2xl"
        }`}
      >
        <div
          className={`flex items-center transition-all duration-300 ease-out ${
            isScrolled ? "gap-4 md:gap-6" : "gap-10"
          }`}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" height={26} width={26} />
            <h1
              className={`hidden font-bold text-indigo-600 transition-all duration-300 ease-out min-[400px]:block ${
                isScrolled ? "text-[20px]" : "text-[23px]"
              }`}
            >
              ProductPilot
            </h1>
          </Link>

          <Menu />
        </div>

        <div
          className={`flex items-center transition-all duration-300 ease-out ${
            isScrolled ? "gap-1.5 md:gap-3" : "gap-2 md:gap-5"
          }`}
        >
          {session ? (
            <div
              className={`flex items-center transition-all duration-300 ease-out ${
                isScrolled ? "gap-3" : "gap-5"
              }`}
            >
              <SubmitButton />
              <NotificationIcon notifications={notifications} />
              <AvatarMenu session={session} isAdmin={isAdmin} />
            </div>
          ) : (
            <Dialog
              open={authModalVisible}
              onOpenChange={setAuthModalVisible}
            >
              <DialogTrigger asChild>
                <div>
                  <AuthButtons />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="sr-only">Sign in</DialogTitle>
                <AuthContent />
              </DialogContent>
            </Dialog>
          )}

          <MobileNav
            isAuthenticated={Boolean(session)}
            unreadNotifications={unreadNotifications}
          />
        </div>
      </div>
    </div>
  );
}
