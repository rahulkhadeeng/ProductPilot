"use client";

import Image from "next/image";
import Link from "next/link";
import { PiChatCircle } from "react-icons/pi";

type CategoryPageProductItemProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    headline: string;
    logo: string;
    website: string;
    comments: unknown[];
    categories: {
      id: string;
      name: string;
    }[];
  };
};

export function CategoryPageProductItem({
  product,
}: CategoryPageProductItemProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex w-full cursor-pointer items-center gap-x-4 rounded-md px-4 py-3"
    >
      <div className="absolute inset-0 rounded-md bg-gradient-to-bl from-[#c9cef0] via-[#fefefe] to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex w-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <Image
            src={product.logo}
            alt={`${product.name} logo`}
            width={112}
            height={112}
            className="h-14 w-14 shrink-0 rounded-md object-cover"
          />

          <div className="min-w-0">
            <div className="items-center gap-x-2 gap-y-2 md:flex">
              <h2 className="font-medium md:text-xl">{product.name}</h2>
              <span className="hidden text-xs md:inline">-</span>
              <p className="line-clamp-2 pr-2 text-sm font-medium text-foreground/70 xl:text-base">
                {product.headline}
              </p>
            </div>

            <div className="hidden items-center gap-x-2 md:flex">
              <div className="flex items-center gap-x-1 text-xs text-gray-500">
                {product.comments.length}
                <PiChatCircle />
              </div>

              {product.categories.map((category) => (
                <div
                  key={category.id}
                  className="text-xs tracking-tight text-gray-500 md:text-sm"
                >
                  <div className="flex items-center gap-x-1">
                    <span className="mr-1">-</span>
                    <span>{category.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <a
          href={product.website}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="hidden w-fit rounded border bg-white px-5 py-1.5 text-sm font-medium transition-all duration-300 hover:border-indigo-500 active:scale-95 md:flex"
        >
          Visit
        </a>
      </div>
    </Link>
  );
}
