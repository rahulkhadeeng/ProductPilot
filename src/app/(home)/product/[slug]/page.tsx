import Image from "next/image";
import Link from "next/link";

import CarouselComponent from "@/components/CarouselComponent";
import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { getProductBySlug } from "@/lib/actions";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <AnimateContainer>
        <main className="mx-auto max-w-screen-md px-6 py-16 text-center">
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <p className="mt-3 text-muted-foreground">
            This product may still be under review or no longer exists.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex rounded-md border px-4 py-2 font-medium transition-all hover:border-indigo-500"
          >
            Browse products
          </Link>
        </main>
      </AnimateContainer>
    );
  }

  const productImageUrls = product.images.map((image) => image.url);

  return (
    <AnimateContainer>
      <main className="mx-auto max-w-screen-xl px-6 py-10 transition-all lg:w-3/5 lg:px-0">
        <div className="flex items-start justify-between gap-5">
          <div className="flex items-center gap-x-4">
            <Image
              src={product.logo}
              alt={`${product.name} logo`}
              width={160}
              height={160}
              className="h-16 w-16 rounded-md border bg-white object-cover shadow-md transition-all md:h-20 md:w-20"
            />

            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold transition-all sm:text-3xl">
                {product.name}
              </h1>
              <p className="text-sm font-medium text-foreground/80 sm:text-base">
                {product.headline}
              </p>
            </div>
          </div>

          <a
            href={product.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded border px-3 py-1 font-medium transition-all duration-300 hover:border-indigo-500 active:scale-95 sm:px-5 sm:py-2"
          >
            Visit
          </a>
        </div>

        {product.description && (
          <p className="pt-5 text-gray-500">{product.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {product.categories.map((category) => (
            <Link
              href={`/category/${category.name.toLowerCase()}`}
              key={category.id}
              className="rounded-md bg-gray-100 px-4 py-2 text-xs text-gray-600 transition-all duration-300 hover:bg-gray-200 active:scale-95"
            >
              {category.name}
            </Link>
          ))}
        </div>

        {productImageUrls.length > 0 && (
          <div className="pt-10">
            <CarouselComponent productImages={productImageUrls} />
          </div>
        )}

        <h2 className="border-b pb-5 pt-20 text-xl font-semibold">
          Community Feedback
        </h2>

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
          <p className="pt-4 text-xl">No comments yet</p>
        )}
      </main>
    </AnimateContainer>
  );
}
