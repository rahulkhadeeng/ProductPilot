import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import PendingProducts from "./PendingProducts";
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

  return (
    <main className="mx-auto max-w-screen-2xl px-8 transition-all md:px-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-6 py-10">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Product Pilot logo"
              width={500}
              height={500}
              className="h-14 w-14 cursor-pointer rounded-md transition-all md:h-20 md:w-20"
            />
          </Link>

          <div className="transition-all">
            <h1 className="text-2xl font-bold transition-all md:text-4xl">
              Welcome back Admin
            </h1>
            <p className="text-sm text-gray-500 transition-all md:text-base">
              Here is what is happening in your business today
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard title="Users" value={users.length} />
        <MetricCard title="Premium Users" value={premiumUsers.length} />
        <MetricCard title="Active Products" value={activeProducts.length} />
        <MetricCard title="Pending Products" value={pendingProducts.length} />
        <MetricCard title="Rejected Products" value={rejectedProducts.length} />
        <MetricCard title="Upvotes" value={totalUpvotesCount ?? 0} />
      </section>

      <Separator className="my-10" />

      <section className="space-y-10 pb-10">
        <h2 className="text-2xl font-bold">Pending Products</h2>
        <PendingProducts pendingProducts={pendingProducts} />
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{value}</CardContent>
    </Card>
  );
}
