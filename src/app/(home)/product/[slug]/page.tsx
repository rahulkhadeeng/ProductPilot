import Link from "next/link";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { getProductBySlug } from "@/lib/actions";
import { auth } from "@/lib/auth/auth";
import type { ProductCardView } from "@/lib/product-types";

import ProductDetailCommunity from "./ProductDetailCommunity";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Product = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

function formatProductForCommunity(product: Product): ProductCardView {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    headline: product.headline,
    description: product.description,
    logo: product.logo,
    releaseDate: product.releaseDate,
    website: product.website,
    twitter: product.twitter,
    instagram: product.instagram,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    userId: product.userId,
    status: product.status,
    images: product.images.map((image) => image.url),
    categories: product.categories.map((category) => category.name),
    commentsLength: product.comments.length,
    commentData: product.comments.map((comment) => {
      const displayName =
        comment.user.name ?? comment.user.email ?? "Community member";

      return {
        id: comment.id,
        profile: comment.profilePicture,
        body: comment.body,
        user: displayName,
        timestamp: comment.createdAt,
        userId: comment.user.id,
        name: displayName.toLowerCase().replace(/\s/g, "_"),
      };
    }),
    upvoters: product.upvotes.map((upvote) => upvote.user.id),
    upvotes: product.upvotes.length,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, authenticatedUser] = await Promise.all([
    getProductBySlug(slug),
    auth(),
  ]);

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

  return (
    <AnimateContainer>
      <main className="mx-auto max-w-screen-xl px-6 py-10 transition-all lg:w-3/5 lg:px-0">
        <ProductDetailCommunity
          product={formatProductForCommunity(product)}
          authenticatedUser={authenticatedUser}
        />
      </main>
    </AnimateContainer>
  );
}
