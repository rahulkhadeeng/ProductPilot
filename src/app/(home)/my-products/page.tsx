import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiCrown, PiPlus } from "react-icons/pi";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { Badge } from "@/components/ui/badge";
import UserDashboardNav from "@/components/UserDashboardNav";
import { auth } from "@/lib/auth/auth";
import { getOwnerProducts, isUserPremium } from "@/lib/actions";

export default async function MyProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const products = await getOwnerProducts();
  const premium = await isUserPremium();

  return (
    <AnimateContainer>
      <main className="site-container-narrow py-8 transition-all">
        <UserDashboardNav />

        {products.length === 0 ? (
          <section>
            <h1 className="text-3xl font-bold">No products found</h1>
            <p className="pt-2 text-gray-500">
              Looks like you have not created any products yet.
            </p>

            <Link
              href="/new-product"
              className="mt-6 flex h-40 w-52 flex-col items-center justify-center rounded-md bg-indigo-200 p-4 text-neutral-800 transition-all hover:scale-105"
            >
              <PiPlus className="mb-4 text-3xl" />
              <span className="text-lg">Create a product</span>
            </Link>
          </section>
        ) : (
          <section>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Your Products</h1>
                <p className="pt-2 text-gray-500">Manage your submissions here.</p>
              </div>

              <Link
                href="/new-product"
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 font-medium transition-all hover:border-indigo-500"
              >
                <PiPlus />
                New product
              </Link>
            </div>

            {premium ? (
              <div className="mt-10 flex items-center gap-x-2">
                <PiCrown className="text-2xl text-orange-300" />
                <p className="text-lg">You are a premium user</p>
              </div>
            ) : (
              <p className="pt-6">({products.length}/2) Free products</p>
            )}

            <div className="mt-8 grid grid-cols-2 items-start gap-x-5 gap-y-8 transition-all sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5">
              {products.map((product) => {
                return (
                  <Link
                    href={`/edit/${product.id}`}
                    key={product.id}
                    className="flex flex-col items-center justify-center gap-2 transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="w-full rounded-lg border p-2">
                      <Image
                        src={product.logo}
                        alt={`${product.name} logo`}
                        width={700}
                        height={700}
                        className="h-36 w-full rounded-lg object-contain"
                      />
                    </div>

                    <div className="flex flex-col items-center gap-2 text-center">
                      <h2 className="text-lg font-medium capitalize">
                        {product.name}
                      </h2>
                      <Badge variant="outline">{product.status}</Badge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </AnimateContainer>
  );
}
