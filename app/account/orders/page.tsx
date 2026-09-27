import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderItem } from "@/lib/types";

export const metadata = { title: "Order history — LUME" };

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = (orders as unknown as (Order & { order_items: OrderItem[] })[]) ?? [];

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-4xl">Order history</h1>
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-row gap-4 border-b border-ink/10 pb-4 text-sm md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <Link href="/account" className="text-ink-400 hover:text-ink">
            Profile
          </Link>
          <span className="font-medium text-ink">Orders</span>
        </nav>

        {list.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Once you place an order, it will show up here."
            action={
              <Link href="/shop">
                <Button>Start shopping</Button>
              </Link>
            }
          />
        ) : (
          <ul className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
            {list.map((order) => (
              <li key={order.id} className="py-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-ink-400">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={order.status === "paid" ? "forest" : "default"}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-ink-400">
                  {order.order_items?.map((item) => (
                    <span key={item.id} className="rounded-full bg-ink-50 px-3 py-1">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
