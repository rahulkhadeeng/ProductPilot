import Link from "next/link";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { getProductsByCategoryName } from "@/lib/actions";
import { CategoryPageProductItem } from "./CategoryPageProductItem";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

function toCategoryName(categorySlug: string) {
  const decoded = decodeURIComponent(categorySlug);

  if (decoded.toLowerCase() === "ai") {
    return "AI";
  }

  return decoded
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = toCategoryName(category);
  const products = await getProductsByCategoryName(categoryName);

  return (
    <AnimateContainer>
      <main className="site-container-narrow pt-8 transition-all">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/categories"
            className="transition-colors hover:text-foreground"
          >
            Categories
          </Link>
          <span>/</span>
          <span className="text-foreground">{categoryName}</span>
        </nav>

        <h1 className="pt-10 text-4xl font-semibold">{categoryName}</h1>
        <p className="pt-2 text-gray-500">
          Check out what&apos;s going on in {categoryName}.
        </p>

        <div className="space-y-4 pt-10">
          {products.length > 0 ? (
            products.map((product) => (
              <CategoryPageProductItem key={product.id} product={product} />
            ))
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
              No active products in this category yet.
            </div>
          )}
        </div>
      </main>
    </AnimateContainer>
  );
}
