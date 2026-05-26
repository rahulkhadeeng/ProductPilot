import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { getActiveProducts } from "@/lib/actions";
import ActiveProducts from "@/components/ActiveProducts";

type ProductsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
  }>;
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? q[0] ?? "" : q ?? "";
  const activeProducts = await getActiveProducts();

  return (
    <AnimateContainer>
      <main className="site-container-narrow py-8 transition-all">
        <ActiveProducts activeProducts={activeProducts} query={query} />
      </main>
    </AnimateContainer>
  );
};

export default ProductsPage;
