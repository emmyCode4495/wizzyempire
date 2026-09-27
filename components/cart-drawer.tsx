"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { EmptyState } from "@/components/empty-state";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const close = useCartStore((s) => s.closeDrawer);
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-ink/40 animate-fade-in"
        onClick={close}
      />
      <div className="relative flex h-full w-full max-w-md animate-drawer-in flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-xl">
            Your bag {lines.length > 0 && `(${lines.length})`}
          </h2>
          <button
            aria-label="Close cart"
            onClick={close}
            className="focus-ring flex h-9 w-9 items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <EmptyState
            title="Your bag is empty"
            description="Browse the collection and add something you'll actually wear."
            action={
              <Link href="/shop" onClick={close}>
                <Button>Continue shopping</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-ink/10">
                {lines.map((line) => (
                  <li key={line.id} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ink-50">
                      {line.image && (
                        <Image
                          src={line.image}
                          alt={line.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/product/${line.slug}`}
                            onClick={close}
                            className="text-sm font-medium hover:underline"
                          >
                            {line.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-ink-400">
                            {line.color} · {line.size}
                          </p>
                        </div>
                        <span className="text-sm">
                          {formatPrice(line.price * line.quantity)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <QuantityStepper
                          value={line.quantity}
                          max={line.stock}
                          onChange={(q) => updateQuantity(line.id, q)}
                        />
                        <button
                          onClick={() => removeItem(line.id)}
                          className="text-xs text-ink-400 underline hover:text-signal"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/10 px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-ink-400">
                Shipping and taxes calculated at checkout.
              </p>
              <Link href="/checkout" onClick={close}>
                <Button className="w-full" size="lg">
                  Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
