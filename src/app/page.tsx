import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 bg-white">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-screen-2xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium text-indigo-600">
            Discover what makers are shipping
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            The best new products in tech
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Product Pilot helps makers launch, share, and explore useful tools
            with a community that cares about what is new.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
            >
              Explore Products
            </Link>
            <Link
              href="/create"
              className="rounded-md border px-5 py-2.5 text-sm font-medium transition hover:bg-foreground/5"
            >
              Submit Product
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {["Developer Tools", "AI Products", "Design Resources"].map(
            (item) => (
              <div key={item} className="rounded-lg border p-5">
                <p className="text-sm font-medium text-indigo-600">
                  Featured
                </p>
                <h2 className="mt-2 text-xl font-semibold">{item}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Fresh launches and useful products will appear here.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}
