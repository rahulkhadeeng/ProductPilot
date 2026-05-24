import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Clock3,
  Crown,
  Package,
  ThumbsUp,
  Users,
  XCircle,
} from "lucide-react";

import PendingProducts from "./PendingProducts";
import AdminOverviewChart from "@/components/admin/AdminOverviewChart";
import AdminRecentUsers from "@/components/admin/AdminRecentUsers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getActiveProducts,
  getPendingProducts,
  getRejectedProducts,
  getTotalUpvotesCount,
  getUsers,
  isUserAdmin,
} from "@/lib/actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const isAdmin = await isUserAdmin();

  if (!isAdmin) {
    redirect("/");
  }

  const [
    users,
    activeProducts,
    pendingProducts,
    rejectedProducts,
    totalUpvotesCount,
  ] = await Promise.all([
    getUsers(),
    getActiveProducts(),
    getPendingProducts(),
    getRejectedProducts(),
    getTotalUpvotesCount(),
  ]);

  const premiumUsers = users.filter((user) => user.isPremium);
  const totalProducts =
    activeProducts.length + pendingProducts.length + rejectedProducts.length;
  const recentUsers = [...users]
    .sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime())
    .slice(0, 6);
  const overviewMetrics = [
    { label: "Users", value: users.length },
    { label: "Products", value: totalProducts },
    { label: "Active", value: activeProducts.length },
    { label: "Pending", value: pendingProducts.length },
    { label: "Rejected", value: rejectedProducts.length },
    { label: "Upvotes", value: totalUpvotesCount ?? 0 },
  ];

  return (
    <main className="mx-auto max-w-screen-2xl px-6 pb-12 transition-all md:px-12 xl:px-20">
      <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-x-5">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="ProductPilot logo"
              width={500}
              height={500}
              className="h-14 w-14 cursor-pointer rounded-md transition-all md:h-20 md:w-20"
            />
          </Link>

          <div className="min-w-0 transition-all">
            <h1 className="text-2xl font-bold transition-all md:text-4xl">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 transition-all md:text-base">
              Review launches, monitor growth, and keep ProductPilot moving.
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="inline-flex h-9 w-fit items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all hover:bg-muted"
        >
          View public products
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard title="Users" value={users.length} icon={Users} />
        <MetricCard title="Premium Users" value={premiumUsers.length} icon={Crown} />
        <MetricCard title="Total Products" value={totalProducts} icon={Package} />
        <MetricCard
          title="Active Products"
          value={activeProducts.length}
          icon={CheckCircle2}
        />
        <MetricCard
          title="Pending Review"
          value={pendingProducts.length}
          icon={Clock3}
        />
        <MetricCard
          title="Rejected Products"
          value={rejectedProducts.length}
          icon={XCircle}
        />
        <MetricCard title="Upvotes" value={totalUpvotesCount ?? 0} icon={ThumbsUp} />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminOverviewChart metrics={overviewMetrics} />
          </CardContent>
        </Card>

        <AdminRecentUsers users={recentUsers} />
      </section>

      <Separator className="my-8" />

      <section className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Pending Products</h2>
            <p className="text-sm text-muted-foreground">
              Submissions waiting for admin review and launch approval.
            </p>
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {pendingProducts.length} awaiting review
          </span>
        </div>
        <PendingProducts pendingProducts={pendingProducts} />
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-md bg-muted p-2">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
      </CardHeader>
      <CardContent className="text-2xl font-bold">{value}</CardContent>
    </Card>
  );
}
