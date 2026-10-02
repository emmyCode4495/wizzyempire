import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <MessageCircle className="mb-6 h-14 w-14 text-forest" strokeWidth={1.25} />
      <h1 className="font-display text-4xl">Almost there</h1>
      <p className="mt-3 max-w-sm text-sm text-ink-400">
        Your order details have been prepared for WhatsApp. Send the message to
        complete your order — the store will confirm payment and delivery with
        you.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/shop">
          <Button>Continue shopping</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </div>
  );
}