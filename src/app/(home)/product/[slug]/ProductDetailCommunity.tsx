"use client";

import { useState } from "react";

import ProductModalContent from "@/components/ProductModalContent";
import type { AuthSession, ProductCardView } from "@/lib/product-types";

type ProductDetailCommunityProps = {
  product: ProductCardView;
  authenticatedUser: AuthSession;
};

export default function ProductDetailCommunity({
  product,
  authenticatedUser,
}: ProductDetailCommunityProps) {
  const [totalUpvotes, setTotalUpvotes] = useState(product.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(
    product.upvoters.includes(authenticatedUser?.user?.id ?? "")
  );

  return (
    <ProductModalContent
      currentProduct={product}
      authenticatedUser={authenticatedUser}
      totalUpvotes={totalUpvotes}
      setTotalUpvotes={setTotalUpvotes}
      hasUpvoted={hasUpvoted}
      setHasUpvoted={setHasUpvoted}
    />
  );
}
