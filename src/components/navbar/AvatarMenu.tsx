"use client";

import {
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AvatarMenuProps = {
  session: Session;
};

export default function AvatarMenu({ session }: AvatarMenuProps) {
  const user = session.user;
  const fallback = user?.name?.slice(0, 2) ?? user?.email?.slice(0, 2) ?? "PP";

  return (
    <div className="mr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <Avatar>
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback>{fallback.toUpperCase()}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="mr-4 w-56">
          <DropdownMenuLabel className="px-2 py-2">
            <div className="flex flex-col gap-1">
              <p className="font-medium leading-none capitalize">
                {user?.name}
              </p>
              <p className="max-w-44 truncate text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex w-full gap-x-2">
              <LayoutDashboard className="text-xl" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/my-products" className="flex w-full gap-x-2">
              <Package className="text-xl" />
              My Products
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/my-upvoted" className="flex w-full gap-x-2">
              <ThumbsUp className="text-xl" />
              Upvoted
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex w-full gap-x-2">
              <Settings className="text-xl" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="text-xl" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
