"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Settings, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";

const dashboardLinks = [
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    href: "/my-products",
    label: "My Products",
    icon: Package,
  },
  {
    href: "/my-upvoted",
    label: "Upvoted",
    icon: ThumbsUp,
  },
];

export default function UserDashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b pb-4">
      {dashboardLinks.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
              active
                ? "bg-indigo-50 text-indigo-700"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
