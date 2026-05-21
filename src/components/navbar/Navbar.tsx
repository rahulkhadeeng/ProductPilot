"use client";

import Image from "next/image";
import Link from "next/link";
import type { Session } from "next-auth";
import { useState } from "react";

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
import Search from "./Search";
import SubmitButton from "./SubmitButton";

type NavbarProps = {
  session: Session | null;
  notifications?: NavbarNotification[];
  products?: unknown;
};

export default function Navbar({ session, notifications = [] }: NavbarProps) {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const unreadNotifications = notifications.filter(
    (notification) => notification.status === "UNREAD"
  ).length;

  return (
    <div className="sticky top-0 z-50 h-16 border-b bg-white px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between transition-all">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="logo" height={26} width={26} />
            <h1 className="hidden text-[23px] font-bold text-indigo-600 transition-all min-[400px]:block">
              Product Pilot
            </h1>
          </Link>

          <Menu />
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          <Search />

          {session ? (
            <div className="flex items-center gap-5">
              <SubmitButton />
              <NotificationIcon notifications={notifications} />
              <AvatarMenu session={session} />
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
