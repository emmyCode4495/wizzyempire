"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

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
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="focus-ring flex h-9 w-9 items-center justify-center text-ink hover:text-ink-600"
      >
        <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex h-9 animate-slide-up items-center gap-1 border-b border-ink pl-1"
    >
      <Search className="h-4 w-4 text-ink-400" strokeWidth={1.5} />
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        className="w-32 bg-transparent px-2 text-sm outline-none placeholder:text-ink-400 sm:w-48"
      />
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="focus-ring flex h-8 w-8 items-center justify-center text-ink-400 hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
