"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import type { ShippingAddress } from "@/lib/types";

const emptyAddress: ShippingAddress = {
  full_name: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
};

export default function CheckoutPage() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();

  const [address, setAddress] = useState<ShippingAddress>(emptyAddress);
  const [placing, setPlacing] = useState(false);

  const shipping = subtotal >= 150 ? 0 : 9.95;
  const total = subtotal + shipping;

  function update<K extends keyof ShippingAddress>(key: K, value: string) {
    setAddress((a) => ({ ...a, [key]: value }));
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, shippingAddress: address }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not place order");
        setPlacing(false);
        return;
      }
      clear();
      router.push(`/checkout/success?order=${data.orderId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-10">
        <EmptyState
          title="Your bag is empty"
          description="Add something to your bag before checking out."
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
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_400px]">
      <div>
        <h1 className="mb-8 font-display text-4xl">Checkout</h1>
        <form id="checkout-form" onSubmit={placeOrder} className="flex flex-col gap-4">
          <h2 className="text-sm font-medium">Shipping address</h2>
          <Input
            label="Full name"
            required
            value={address.full_name}
            onChange={(e) => update("full_name", e.target.value)}
          />
          <Input
            label="Address"
            required
            value={address.address_line}
            onChange={(e) => update("address_line", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              required
              value={address.city}
              onChange={(e) => update("city", e.target.value)}
            />
            <Input
              label="State / Region"
              required
              value={address.state}
              onChange={(e) => update("state", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Postal code"
              required
              value={address.postal_code}
              onChange={(e) => update("postal_code", e.target.value)}
            />
            <Input
              label="Country"
              required
              value={address.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </div>
          <Input
            label="Phone"
            required
            value={address.phone}
            onChange={(e) => update("phone", e.target.value)}
          />

          <div className="mt-4 border-t border-ink/10 pt-4">
            <h2 className="mb-2 text-sm font-medium">Payment</h2>
            <p className="text-xs text-ink-400">
              This is a demo store — no real payment is collected. In
              production, swap this section for a Stripe (or similar)
              payment element and confirm it before creating the order.
            </p>
          </div>
        </form>
      </div>

      <aside className="h-fit border border-ink/10 p-6">
        <h2 className="font-display text-xl">Order summary</h2>
        <ul className="my-4 max-h-64 space-y-4 overflow-y-auto">
          {lines.map((l) => (
            <li key={l.id} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ink-50">
                {l.image && (
                  <Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 text-sm">
                <p>{l.name}</p>
                <p className="text-xs text-ink-400">
                  {l.color} · {l.size} · Qty {l.quantity}
                </p>
              </div>
              <span className="text-sm">{formatPrice(l.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-ink/10 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-600">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-2 font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <Button
          form="checkout-form"
          type="submit"
          size="lg"
          disabled={placing}
          className="mt-6 w-full"
        >
          {placing ? "Placing order…" : `Pay ${formatPrice(total)}`}
        </Button>
      </aside>
    </div>
  );
}
