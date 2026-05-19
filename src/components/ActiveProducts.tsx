import { auth } from "@/lib/auth/auth";
import ProductItem from "./ProductItem";
import type { ProductCardView } from "@/lib/product-types";

type ActiveProduct = {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  instagram: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
  images: { url: string }[];
  categories: { name: string }[];
  comments: {
    id: string;
    profilePicture: string;
    body: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      email?: string | null;
    };
  }[];
  upvotes: {
    user: {
      id: string;
    };
  }[];
};

type ActiveProductsProps = {
  activeProducts: ActiveProduct[];
  query?: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const ActiveProducts = async ({
  activeProducts,
  query = "",
}: ActiveProductsProps) => {
  const authenticatedUser = await auth();
  const normalizedQuery = normalize(query);

  const formattedActiveProducts: ProductCardView[] = activeProducts.map((product) => {
    const {
      id,
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      instagram,
      createdAt,
      updatedAt,
      userId,
      status,
      images,
      categories,
      comments,
      upvotes,
    } = product;

    const imageUrls = images.map((image) => image.url);
    const categoryNames = categories.map((category) => category.name);
    const commentsCount = comments.length;

    const commentText = comments.map((comment) => {
      const displayName = comment.user.name ?? comment.user.email ?? "Community member";

      return {
          id: comment.id,
          profile: comment.profilePicture,
          body: comment.body,
          user: displayName,
          timestamp: comment.createdAt,
          userId: comment.user.id,
          name: displayName.toLowerCase().replace(/\s/g, "_"),
        };
      });

    const upvotesCount = upvotes.length;
    const upvotesData = upvotes.map((upvote) => upvote.user.id);

    return {
      id,
      name,
      slug,
      headline,
      description,
      logo,
      releaseDate,
      website,
      twitter,
      instagram,
      createdAt,
      updatedAt,
      userId,
      status,
      images: imageUrls,
      categories: categoryNames,
      commentsLength: commentsCount,
      commentData: commentText,
      upvoters: upvotesData,
      upvotes: upvotesCount,
    };
  });

  const visibleProducts = normalizedQuery
    ? formattedActiveProducts.filter((product) =>
        [
          product.name,
          product.headline,
          product.description,
          ...product.categories,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : formattedActiveProducts;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 border-b pb-3">
        <h1 className="text-2xl font-semibold">
          {normalizedQuery ? `Search results for "${query}"` : "All Products"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {visibleProducts.length} active product
          {visibleProducts.length === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="py-6 flex flex-col space-y-2">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              authenticatedUser={authenticatedUser}
            />
          ))
        ) : (
          <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
            No active products match this search yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveProducts;
