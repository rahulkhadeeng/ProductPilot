import { Crown, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RecentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  createdAt: Date;
};

export default function AdminRecentUsers({ users }: { users: RecentUser[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users yet.</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10 rounded-md">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                  )}
                  <AvatarFallback className="rounded-md text-xs">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {user.name ?? "Unnamed user"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email ?? "No email"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {user.isAdmin && (
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
                {user.isPremium && (
                  <Badge variant="secondary" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function getInitials(name: string | null, email: string | null) {
  const source = name ?? email ?? "User";
  return source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
