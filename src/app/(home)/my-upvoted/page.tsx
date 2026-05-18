import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { auth } from "@/lib/auth/auth";
import { getUpvotedProducts } from "@/lib/actions";

export default async function MyUpvotedProductsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const products = await getUpvotedProducts();

  return (
    <AnimateContainer>
      <main className="mx-auto max-w-screen-xl px-6 pt-10 transition-all lg:w-4/5 xl:w-3/5">
        {products.length === 0 ? (
          <section>
            <h1 className="text-3xl font-bold">
              You have not upvoted any products yet
            </h1>
            <p className="pt-4 text-gray-500">
              Upvote products to get started, and they will display here.
            </p>
          </section>
        ) : (
          <section>
            <div>
              <h1 className="text-3xl font-bold">Your Upvotes</h1>
              <p className="pt-2 text-gray-500">
                View all the products you have upvoted.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 px-5 transition-all sm:grid-cols-3 sm:px-0 md:grid-cols-4 2xl:grid-cols-5">
              {products.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id}>
                  <div className="rounded-lg border transition-all duration-300 hover:-translate-y-1">
                    <Image
                      src={product.logo}
                      alt={`${product.name} logo`}
                      width={700}
                      height={700}
                      className="h-40 w-full rounded-t-lg object-cover"
                    />

                    <h2 className="p-4 text-lg font-semibold capitalize">
                      {product.name}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </AnimateContainer>
  );
}
