import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Next.js 16: `searchParams` is now a Promise and must be awaited.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <CheckCircle2 className="mb-6 h-14 w-14 text-forest" strokeWidth={1.25} />
      <h1 className="font-display text-4xl">Order placed</h1>
      <p className="mt-3 max-w-sm text-sm text-ink-400">
        Thank you — your order has been confirmed. A receipt has been sent to
        your email.
        {order && (
          <>
            {" "}
            Order reference:{" "}
            <span className="font-medium text-ink">
              {order.slice(0, 8).toUpperCase()}
            </span>
          </>
        )}
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/account/orders">
          <Button>View orders</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
