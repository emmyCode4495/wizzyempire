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
import type { CartLine, ShippingAddress } from "@/lib/types";

const emptyAddress: ShippingAddress = {
  full_name: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
};

/** Owner WhatsApp number (digits only, with country code). Override via env. */
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "2348000000000";

function buildWhatsAppMessage(
  lines: CartLine[],
  address: ShippingAddress,
  subtotal: number,
  shipping: number,
  total: number
) {
  const itemLines = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name}\n` +
        `   Size: ${l.size} · Color: ${l.color}\n` +
        `   Qty: ${l.quantity} × ${formatPrice(l.price)} = ${formatPrice(l.price * l.quantity)}`
    )
    .join("\n\n");

  return (
    `*New order — ${process.env.NEXT_PUBLIC_SITE_NAME || "Wizzy Empire"}*\n\n` +
    `*Customer*\n` +
    `Name: ${address.full_name}\n` +
    `Phone: ${address.phone}\n` +
    `Address: ${address.address_line}\n` +
    `${address.city}, ${address.state} ${address.postal_code}\n` +
    `${address.country}\n\n` +
    `*Items*\n${itemLines}\n\n` +
    `Subtotal: ${formatPrice(subtotal)}\n` +
    `Shipping: ${shipping === 0 ? "Free" : formatPrice(shipping)}\n` +
    `*Total: ${formatPrice(total)}*\n\n` +
    `Please confirm availability and payment details. Thank you!`
  );
}

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

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();

    if (!lines.length) {
      toast.error("Your bag is empty");
      return;
    }

    setPlacing(true);

    const message = buildWhatsAppMessage(
      lines,
      address,
      subtotal,
      shipping,
      total
    );
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp (new tab on desktop; same window on many mobile browsers)
    window.open(url, "_blank", "noopener,noreferrer");

    clear();
    toast.success("Opening WhatsApp to complete your order…");
    router.push("/checkout/success");
    setPlacing(false);
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
              No online payment yet. After you confirm, you&apos;ll be taken to
              WhatsApp with your full order details so the store can arrange
              payment and delivery with you.
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
          {placing ? "Opening WhatsApp…" : `Order via WhatsApp · ${formatPrice(total)}`}
        </Button>
      </aside>
    </div>
  );
}