"use client";

import Avvvatars from "avvvatars-react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/actions";
import { cn } from "@/lib/utils";

export type NotificationListItem = {
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

type NotificationsListProps = {
  notifications: NotificationListItem[];
};

type NotificationFilter = "ALL" | "UNREAD" | "COMMENTS" | "UPVOTES" | "REVIEWS";

const filters: {
  value: NotificationFilter;
  label: string;
}[] = [
  { value: "ALL", label: "All" },
  { value: "UNREAD", label: "Unread" },
  { value: "COMMENTS", label: "Comments" },
  { value: "UPVOTES", label: "Upvotes" },
  { value: "REVIEWS", label: "Reviews" },
];

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

function typeLabel(type: string) {
  const labels: Record<string, string> = {
    UPVOTE: "Upvote",
    COMMENT: "Comment",
    ACTIVATED: "Approved",
    REJECTED: "Rejected",
  };

  return labels[type] ?? type;
}

export default function NotificationsList({
  notifications,
}: NotificationsListProps) {
  const [items, setItems] = useState(notifications);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("ALL");
  const [isMarkingAll, startMarkingAll] = useTransition();

  const unreadCount = useMemo(
    () => items.filter((item) => item.status === "UNREAD").length,
    [items]
  );

  const filteredItems = useMemo(() => {
    if (activeFilter === "UNREAD") {
      return items.filter((item) => item.status === "UNREAD");
    }

    if (activeFilter === "COMMENTS") {
      return items.filter((item) => item.type === "COMMENT");
    }

    if (activeFilter === "UPVOTES") {
      return items.filter((item) => item.type === "UPVOTE");
    }

    if (activeFilter === "REVIEWS") {
      return items.filter(
        (item) => item.type === "ACTIVATED" || item.type === "REJECTED"
      );
    }

    return items;
  }, [activeFilter, items]);

  const markOne = async (notificationId: string) => {
    const notification = items.find((item) => item.id === notificationId);

    if (!notification || notification.status === "READ") {
      return;
    }

    setPendingIds((current) => [...current, notificationId]);

    try {
      await markNotificationAsRead(notificationId);
      setItems((current) =>
        current.map((item) =>
          item.id === notificationId ? { ...item, status: "READ" } : item
        )
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not mark notification as read.",
        { position: "top-right" }
      );
    } finally {
      setPendingIds((current) => current.filter((id) => id !== notificationId));
    }
  };

  const markAll = () => {
    startMarkingAll(async () => {
      try {
        await markAllNotificationsAsRead();
        setItems((current) =>
          current.map((item) => ({ ...item, status: "READ" }))
        );
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Could not mark notifications as read.",
          { position: "top-right" }
        );
      }
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="pt-2 text-gray-500">
            Review product activity, feedback, and moderation updates.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={unreadCount === 0 || isMarkingAll}
          onClick={markAll}
          className="gap-2"
        >
          <CheckCheck className="h-4 w-4" />
          {isMarkingAll ? "Marking..." : "Mark all read"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant={unreadCount > 0 ? "default" : "outline"}>
          {unreadCount} unread
        </Badge>
        <Badge variant="outline">{items.length} total</Badge>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "text-muted-foreground hover:border-indigo-300 hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <Bell className="h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No notifications yet</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Upvotes, comments, and review decisions for your products will
              appear here.
            </p>
          </CardContent>
        </Card>
      ) : filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-8 w-8 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">
              No matching notifications
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try another filter to review the rest of your activity.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((notification) => {
            const isUnread = notification.status === "UNREAD";
            const productHref = notification.product?.slug
              ? `/product/${notification.product.slug}`
              : "/products";
            const isPending = pendingIds.includes(notification.id);

            return (
              <Card
                key={notification.id}
                className={cn(
                  "transition-all",
                  isUnread ? "ring-indigo-200" : "bg-muted/20"
                )}
              >
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.profilePicture || undefined} />
                    <AvatarFallback>
                      <Avvvatars value={notification.type} />
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={isUnread ? "default" : "outline"}>
                        {typeLabel(notification.type)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(notification.createdAt)}
                      </span>
                    </div>

                    <p
                      className={cn(
                        "mt-3 text-sm leading-6",
                        isUnread
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {notification.body}
                    </p>

                    {notification.product?.name && (
                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        Product: {notification.product.name}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {isUnread && (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => markOne(notification.id)}
                      >
                        {isPending ? "Marking..." : "Mark read"}
                      </Button>
                    )}

                    <Button
                      asChild
                      variant="outline"
                      onClick={() => void markOne(notification.id)}
                      className="gap-2"
                    >
                      <Link href={productHref}>
                        Open
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
