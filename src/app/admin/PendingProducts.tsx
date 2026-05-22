import Image from "next/image";

import AdminProductActions from "./AdminProductActions";

type PendingProduct = {
  id: string;
  name: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  instagram: string;
  categories: { id: string; name: string }[];
  images: { id: string; url: string }[];
};

export default function PendingProducts({
  pendingProducts,
}: {
  pendingProducts: PendingProduct[];
}) {
  if (pendingProducts.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-sm text-muted-foreground">
        No pending products. New submissions appear here only after the product
        form finishes successfully.
      </div>
    );
  }

  return (
    <div className="my-5 flex w-full flex-col gap-5">
      {pendingProducts.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between gap-4 rounded-md border p-4"
        >
          <div className="flex items-center gap-x-6">
            <Image
              src={product.logo}
              alt={`${product.name} logo`}
              width={200}
              height={200}
              className="h-14 w-14 cursor-pointer rounded-md object-cover md:h-20 md:w-20"
            />

            <div className="space-y-1">
              <h2 className="font-bold capitalize md:text-2xl">
                {product.name}
              </h2>
              <p className="hidden pr-6 text-xs text-gray-500 md:flex lg:text-sm">
                {product.description}
              </p>
              <div className="hidden font-medium text-gray-500 md:flex">
                Release Date : {product.releaseDate}
              </div>
            </div>
          </div>

          <AdminProductActions product={product} />
        </div>
      ))}
    </div>
  );
}
