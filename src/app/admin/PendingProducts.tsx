import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ExternalLink, UserRound } from "lucide-react";

import AdminProductActions from "./AdminProductActions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type PendingProduct = {
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
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
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
    <div className="flex w-full flex-col gap-4">
      {pendingProducts.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 gap-4">
                <Image
                  src={product.logo}
                  alt={`${product.name} logo`}
                  width={96}
                  height={96}
                  className="h-16 w-16 shrink-0 rounded-md border object-cover md:h-20 md:w-20"
                />

                <div className="min-w-0 space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-bold capitalize md:text-xl">
                        {product.name}
                      </h3>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
                      {product.headline}
                    </p>
                  </div>

                  <p className="line-clamp-2 max-w-4xl text-sm text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {product.releaseDate}
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <UserRound className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {product.user.name ?? product.user.email ?? "Unknown creator"}
                      </span>
                    </span>
                    {product.website && (
                      <Link
                        href={product.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-primary"
                      >
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <AdminProductActions product={product} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
