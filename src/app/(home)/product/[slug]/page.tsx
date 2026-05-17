import Image from "next/image";
import Link from "next/link";
import { PiCaretUpFill, PiChatCircle } from "react-icons/pi";

import CarouselComponent from "@/components/CarouselComponent";
import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProductBySlug } from "@/lib/actions";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Product = NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>;

function getInitials(name?: string | null, email?: string | null) {
  const source = name || email || "Product maker";

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function ProductHeader({ product }: { product: Product }) {
  return (
    <section className="flex items-start justify-between gap-5">
      <div className="flex items-center gap-x-4">
        <Image
          src={product.logo}
          alt={`${product.name} logo`}
          width={1000}
          height={1000}
          className="h-16 w-16 rounded-md border bg-white object-cover shadow-md transition-all md:h-20 md:w-20"
          priority
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

      <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row">
        <UpvotePlaceholder upvotesCount={product.upvotes.length} />

        <a
          href={product.website}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded border px-3 py-1 font-medium transition-all duration-300 hover:border-indigo-500 active:scale-95 sm:px-5 sm:py-2"
        >
          Visit
        </a>
      </div>
    </section>
  );
}

function ProductInfo({ product }: { product: Product }) {
  return (
    <section>
      {product.description && (
        <div className="pt-5">
          <p className="text-gray-500">{product.description}</p>
        </div>
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
    </section>
  );
}

function MakerInfo({ product }: { product: Product }) {
  const maker = product.user;

  return (
    <section className="mt-8 rounded-md border bg-white p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        Maker
      </p>

      <div className="mt-3 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={maker.image ?? undefined} />
          <AvatarFallback>{getInitials(maker.name, maker.email)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="font-semibold">{maker.name ?? "Product maker"}</h2>
          {maker.email && (
            <p className="truncate text-sm text-muted-foreground">
              {maker.email}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ProductGallery({ imageUrls }: { imageUrls: string[] }) {
  return (
    <section className="pt-10">
      {imageUrls.length > 0 ? (
        <CarouselComponent productImages={imageUrls} />
      ) : (
        <div className="rounded-md border border-dashed p-10 text-center text-muted-foreground">
          Product gallery images will appear here.
        </div>
      )}
    </section>
  );
}

function UpvotePlaceholder({ upvotesCount }: { upvotesCount: number }) {
  return (
    <div className="flex cursor-not-allowed items-center gap-2 rounded border bg-white px-3 py-1 font-medium text-muted-foreground sm:px-4 sm:py-2">
      <PiCaretUpFill className="text-lg" />
      <span>{upvotesCount}</span>
    </div>
  );
}

function CommentsPlaceholder({ commentsCount }: { commentsCount: number }) {
  return (
    <section>
      <h2 className="border-b pb-5 pt-20 text-xl font-semibold">
        Community Feedback
      </h2>

      <div className="mt-4 rounded-md border border-dashed p-6">
        <div className="flex items-center gap-2 font-medium text-foreground/80">
          <PiChatCircle />
          <span>{commentsCount} comments</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Comments will be wired in a later community phase.
        </p>
      </div>
    </section>
  );
}

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
        <ProductHeader product={product} />
        <ProductInfo product={product} />
        <MakerInfo product={product} />
        <ProductGallery imageUrls={productImageUrls} />
        <CommentsPlaceholder commentsCount={product.comments.length} />
      </main>
    </AnimateContainer>
  );
}
