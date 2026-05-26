import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiArrowLeft } from "react-icons/pi";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth/auth";
import { getProductById } from "@/lib/actions";
import DeleteProductButton from "./DeleteProductButton";
import EditProductForm from "./EditProductForm";

type EditProductPageProps = {
  params: Promise<{
    productId: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return (
      <AnimateContainer>
        <main className="site-container py-8 transition-all">
          <BackLink />
          <h1 className="mt-10 text-4xl font-medium">Product not found</h1>
        </main>
      </AnimateContainer>
    );
  }

  if (product.userId !== session.user?.id) {
    redirect("/my-products");
  }

  return (
    <AnimateContainer>
      <main className="site-container py-8 transition-all">
        <BackLink />

        <section className="flex flex-wrap items-center justify-between gap-6 py-4">
          <div className="flex items-center gap-x-4">
            <Image
              src={product.logo}
              alt={`${product.name} logo`}
              width={500}
              height={500}
              className="h-24 w-24 rounded-lg border object-cover md:h-32 md:w-32"
            />

            <div className="space-y-2 md:space-y-3">
              <h1 className="text-xl font-medium md:text-3xl">
                {product.name}
              </h1>
              <p className="w-3/4 break-words text-xs text-gray-500 md:text-sm">
                {product.website}
              </p>
              <StatusBadge status={product.status} />
            </div>
          </div>

          <DeleteProductButton productId={product.id} />
        </section>

        <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard title="Current Rank" value={product.rank > 0 ? product.rank : "N/A"} />
          <MetricCard title="Comments" value={product.comments.length} />
          <MetricCard title="Upvotes" value={product.upvotes.length} />
        </section>

        <div className="py-5">
          <Separator />
        </div>

        <EditProductForm product={product} />

        <div className="py-5">
          <Separator />
        </div>

        <section>
          <h2 className="pt-5 text-xl font-semibold">Community Feedback</h2>
          {product.comments.length > 0 ? (
            <div className="mt-4 space-y-4">
              {product.comments.map((comment) => (
                <div key={comment.id} className="rounded-lg p-4">
                  <div className="flex items-center gap-x-4">
                    <Image
                      src={comment.user.image ?? comment.profilePicture}
                      alt={`${comment.user.name ?? "User"} profile`}
                      width={50}
                      height={50}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">
                        {comment.user.name ?? "Community member"}
                      </h3>
                      <p className="text-gray-500">{comment.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="pt-4">No comments yet</p>
          )}
        </section>
      </main>
    </AnimateContainer>
  );
}

function BackLink() {
  return (
    <Link
      href="/my-products"
      className="group mb-5 flex w-fit items-center gap-1 font-medium text-foreground/70 transition-all hover:text-foreground/90"
    >
      <PiArrowLeft className="text-xl transition group-hover:-translate-x-0.5" />
      <span>Go Back</span>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "ACTIVE") {
    return <Badge className="bg-green-400 hover:bg-green-400">ACTIVE</Badge>;
  }

  if (status === "REJECTED") {
    return <Badge className="bg-red-400 hover:bg-red-400">REJECTED</Badge>;
  }

  return <Badge className="bg-orange-400 hover:bg-orange-400">Pending</Badge>;
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
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}
