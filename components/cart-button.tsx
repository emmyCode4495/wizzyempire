"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

/**
 * Always a real <Link href="/cart"> so taps work on every mobile browser.
 * When JS is available, also opens the side drawer as enhancement.
 */
export function CartButton() {
  const openDrawer = useCartStore((s) => s.openDrawer);
  const count = useCartStore((s) => s.totalItems());

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} items`}
      className="nav-icon-btn relative"
      onClick={(e) => {
        try {
          if (typeof openDrawer === "function") {
            e.preventDefault();
            openDrawer();
          }
        } catch {
          // Fall through to /cart navigation
        }
      }}
    >
      <ShoppingBag
        className="pointer-events-none h-5 w-5"
        strokeWidth={1.75}
      />
      {count > 0 && (
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold text-paper">
          {count}
        </span>
      )}
    </Link>
  );
}