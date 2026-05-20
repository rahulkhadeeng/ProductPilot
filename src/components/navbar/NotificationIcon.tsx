"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { PiBell } from "react-icons/pi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { markAllNotificationsAsRead } from "@/lib/actions";
import { cn } from "@/lib/utils";

export type NavbarNotification = {
  id: string;
  body: string;
  profilePicture: string;
  productId: string;
  commentId: string | null;
  type: string;
  status: "UNREAD" | "READ";
  createdAt: Date | string;
  product?: {
    slug?: string | null;
    name?: string | null;
  } | null;
};

type NotificationIconProps = {
  notifications: NavbarNotification[];
};

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function timeAgo(value: Date | string) {
  const createdAt = new Date(value);
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - createdAt.getTime()) / 1000)
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationIcon({
  notifications,
}: NotificationIconProps) {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [isPending, startTransition] = useTransition();

  const unreadCount = useMemo(
    () =>
      localNotifications.filter(
        (notification) => notification.status === "UNREAD"
      ).length,
    [localNotifications]
  );

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setLocalNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          status: "READ",
        }))
      );
    });
  };

  return (
    <div className="hidden md:block">
      <Sheet>
        <SheetTrigger
          aria-label="Open notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition-all hover:bg-gray-100 hover:text-foreground"
        >
          <PiBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </SheetTrigger>

        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              Product activity and review updates appear here.
            </SheetDescription>
          </SheetHeader>

          <div className="flex items-center justify-between border-b pb-4 pt-2">
            <p className="text-sm text-muted-foreground">
              {unreadCount === 0
                ? "No unread notifications"
                : `${unreadCount} unread notification${
                    unreadCount === 1 ? "" : "s"
                  }`}
            </p>

            {localNotifications.length > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isPending || unreadCount === 0}
                className="text-sm font-medium text-indigo-600 transition-all hover:text-indigo-700 disabled:pointer-events-none disabled:text-muted-foreground"
              >
                {isPending ? "Marking..." : "Mark all as read"}
              </button>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-5">
            {localNotifications.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                You do not have notifications yet.
              </div>
            ) : (
              <div className="space-y-5">
                {localNotifications.map((notification) => {
                  const isUnread = notification.status === "UNREAD";
                  const productHref = notification.product?.slug
                    ? `/product/${notification.product.slug}`
                    : "/products";

                  return (
                    <Link
                      key={notification.id}
                      href={productHref}
                      className="flex gap-3 rounded-md p-2 transition-all hover:bg-gray-50"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={notification.profilePicture || undefined}
                        />
                        <AvatarFallback>
                          {getInitials(notification.type)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className={cn(
                              "text-sm leading-5",
                              isUnread
                                ? "font-semibold text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {notification.body}
                          </p>

                          {isUnread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                          )}
                        </div>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
