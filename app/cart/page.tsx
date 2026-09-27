"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { EmptyState } from "@/components/empty-state";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  if (lines.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          title="Your bag is empty"
          description="Browse the collection and add something you'll actually wear."
          action={
            <Link href="/shop">
              <Button>Continue shopping</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-8 font-display text-4xl">Your bag</h1>
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-5 py-6">
              <div className="relative h-32 w-24 shrink-0 overflow-hidden bg-ink-50">
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${line.slug}`}
                      className="font-medium hover:underline"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-1 text-sm text-ink-400">
                      {line.color} · {line.size}
                    </p>
                  </div>
                  <span className="font-medium">
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
                    className="text-sm text-ink-400 underline hover:text-signal"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit border border-ink/10 p-6">
        <h2 className="font-display text-xl">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-600">Shipping</span>
            <span>{subtotal >= 150 ? "Free" : formatPrice(9.95)}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-medium">
          <span>Total</span>
          <span>
            {formatPrice(subtotal + (subtotal >= 150 ? 0 : 9.95))}
          </span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="mt-6 w-full">
            Checkout
          </Button>
        </Link>
      </aside>
    </div>
  );
}
