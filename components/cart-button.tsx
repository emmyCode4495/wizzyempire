"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function CartButton() {
  const openDrawer = useCartStore((s) => s.openDrawer);
  const count = useCartStore((s) => s.totalItems());

  return (
    <button
      aria-label={`Open cart, ${count} items`}
      onClick={openDrawer}
      className="focus-ring relative flex h-9 w-9 items-center justify-center text-ink hover:text-ink-600"
    >
      <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold text-paper">
          {count}
        </span>
      )}
    </button>
  );
}
