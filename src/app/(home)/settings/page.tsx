import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Crown,
  Package,
  Settings,
  ThumbsUp,
  XCircle,
} from "lucide-react";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import UserDashboardNav from "@/components/UserDashboardNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import {
  getOwnerProducts,
  getUpvotedProducts,
  isUserPremium,
} from "@/lib/actions";
import ManageBilling from "./ManageBilling";
import UpgradePremiumButton from "./UpgradePremiumButton";

function getInitials(name?: string | null, email?: string | null) {
  const source = name || email || "PP";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [premium, ownerProducts, upvotedProducts] = await Promise.all([
    isUserPremium(),
    getOwnerProducts(),
    getUpvotedProducts().catch(() => []),
  ]);

  const pendingProducts = ownerProducts.filter(
    (product) => product.status === "PENDING"
  ).length;
  const activeProducts = ownerProducts.filter(
    (product) => product.status === "ACTIVE"
  ).length;
  const rejectedProducts = ownerProducts.filter(
    (product) => product.status === "REJECTED"
  ).length;
  const recentProducts = ownerProducts.slice(0, 3);

  return (
    <AnimateContainer>
      <main className="mx-auto max-w-screen-xl px-6 py-10 transition-all lg:w-4/5 xl:w-3/5">
        <UserDashboardNav />

        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="pt-1 text-gray-500">
              Manage your account and creator workspace.
            </p>
          </div>
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-[1.4fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>
                    {getInitials(session.user.name, session.user.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-xl font-semibold">
                    {session.user.name ?? "Product Pilot user"}
                  </h2>
                  <p className="truncate text-sm text-muted-foreground">
                    {session.user.email}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant={premium ? "default" : "outline"}>
                      {premium ? "Premium" : "Free"}
                    </Badge>
                    <Badge variant="outline">Creator account</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-indigo-50 p-3 text-indigo-600">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    {premium ? "Premium active" : "Free plan"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {premium
                      ? "Manage your subscription in Stripe."
                      : `${ownerProducts.length}/2 free products used.`}
                  </p>
                </div>
              </div>

              {premium ? (
                <ManageBilling />
              ) : (
                <UpgradePremiumButton userEmail={session.user.email} />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Package className="h-5 w-5" />}
            title="Products"
            value={ownerProducts.length}
          />
          <MetricCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Active"
            value={activeProducts}
          />
          <MetricCard
            icon={<Clock3 className="h-5 w-5" />}
            title="Pending"
            value={pendingProducts}
          />
          <MetricCard
            icon={<ThumbsUp className="h-5 w-5" />}
            title="Upvoted"
            value={upvotedProducts.length}
          />
        </section>

        {rejectedProducts > 0 && (
          <div className="mt-6 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <XCircle className="h-5 w-5" />
            <span>
              {rejectedProducts} product
              {rejectedProducts === 1 ? " needs" : "s need"} attention.
            </span>
          </div>
        )}

        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Recent Products</h2>
              <p className="pt-1 text-gray-500">
                Jump back into submissions you own.
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href="/my-products" className="gap-2">
                View all
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Separator className="my-6" />

          {recentProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/edit/${product.id}`}
                  className="group rounded-md border p-4 transition-all hover:border-indigo-500"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.logo}
                      alt={`${product.name} logo`}
                      width={96}
                      height={96}
                      className="h-16 w-16 rounded-md object-contain"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold capitalize">
                        {product.name}
                      </h3>
                      <p className="truncate text-sm text-muted-foreground">
                        {product.headline}
                      </p>
                      <Badge variant="outline" className="mt-2">
                        {product.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground">
                You have not submitted a product yet.
              </p>
              <Button asChild className="mt-4">
                <Link href="/new-product">Create a product</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </AnimateContainer>
  );
}

function MetricCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
        <div className="rounded-md bg-indigo-50 p-3 text-indigo-600">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
