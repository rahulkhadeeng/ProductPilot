"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export default function Menu() {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-6 transition-all min-[900px]:flex">
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium transition-all hover:text-foreground/90 ${
              isActive ? "text-foreground/95" : "text-foreground/70"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
