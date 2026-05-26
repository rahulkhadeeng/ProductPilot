import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";

import { AnimateContainer } from "@/components/landing-page/AnimatePageContainer";
import { getAllCategories } from "@/lib/actions";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <AnimateContainer>
      <main className="site-container-narrow pt-6 md:py-8">
        <section className="w-full rounded-md bg-gray-100 p-10">
          <h1 className="text-4xl font-semibold">Categories</h1>
          <p className="pt-2 text-gray-500">
            Dive into our categories to uncover products for every passion and
            purpose.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 pt-10 sm:grid-cols-2">
          {categories?.map((category) => (
            <Link
              href={`/category/${category.name.toLowerCase()}`}
              key={category.id}
              className="group rounded-md bg-indigo-100 p-5 shadow-sm transition-all duration-300 hover:ring-2 active:scale-95"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-semibold md:text-2xl">{category.name}</h2>
                <BsArrowRight className="text-xl transition-all duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </AnimateContainer>
  );
}
