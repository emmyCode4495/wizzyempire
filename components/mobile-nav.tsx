"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="focus-ring flex h-9 w-9 items-center justify-center"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/40 animate-fade-in"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-[80%] max-w-xs animate-drawer-in flex-col bg-paper px-6 py-6">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="focus-ring ml-auto flex h-9 w-9 items-center justify-center"
            >
              <X className="h-5 w-5" />
            </button>
            <nav className="mt-8 flex flex-col gap-1">
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="border-b border-ink/10 py-3 font-display text-xl"
              >
                All products
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink/10 py-3 font-display text-xl"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
