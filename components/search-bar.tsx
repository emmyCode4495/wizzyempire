"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X } from "lucide-react";

/**
 * Closed state is a real <Link> so it always works on mobile.
 * Expanded search form is progressive enhancement when JS is available.
 */
export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(value.trim())}`);
    setOpen(false);
    setValue("");
  }

  if (!open) {
    return (
      <Link
        href="/shop"
        aria-label="Search products"
        className="nav-icon-btn"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Search
          className="pointer-events-none h-[18px] w-[18px]"
          strokeWidth={1.75}
        />
      </Link>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex h-11 items-center gap-1 border-b border-ink pl-1"
    >
      <Search
        className="pointer-events-none h-4 w-4 shrink-0 text-ink-400"
        strokeWidth={1.5}
      />
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        className="w-28 bg-transparent px-2 text-sm outline-none placeholder:text-ink-400 sm:w-48"
        enterKeyHint="search"
      />
      <button
        type="button"
        aria-label="Close search"
        className="nav-icon-btn text-ink-400"
        onClick={() => setOpen(false)}
      >
        <X className="pointer-events-none h-4 w-4" strokeWidth={1.75} />
      </button>
    </form>
  );
}