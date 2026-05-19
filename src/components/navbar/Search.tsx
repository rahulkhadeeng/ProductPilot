"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    const href = trimmedQuery
      ? `/products?q=${encodeURIComponent(trimmedQuery)}`
      : "/products";

    router.push(href);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden items-center rounded-md border bg-white px-3 transition-all focus-within:border-indigo-500 lg:flex"
      role="search"
    >
      <SearchIcon className="h-4 w-4 text-gray-400" strokeWidth={2.5} />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        className="w-44 rounded-md px-2 py-1.5 text-sm focus:outline-none"
      />
    </form>
  );
}
