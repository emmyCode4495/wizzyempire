import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import { StatCard } from "@/components/admin/stat-card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [
    { count: productCount },
    { count: orderCount },
    { count: categoryCount },
    { data: recentOrders },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, total, status, created_at, shipping_address")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, name, stock, slug")
      .lte("stock", 5)
      .order("stock", { ascending: true })
      .limit(5),
  ]);

  const { data: paidOrders } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["paid", "shipped", "delivered"]);

  const revenue = (paidOrders ?? []).reduce(
    (sum, o) => sum + Number((o as { total: number }).total || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Overview
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Store performance and quick actions
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">Add product</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={productCount ?? 0} />
        <StatCard label="Orders" value={orderCount ?? 0} />
        <StatCard label="Categories" value={categoryCount ?? 0} />
        <StatCard label="Revenue" value={formatPrice(revenue)} hint="Paid + shipped + delivered" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-ink/10 bg-paper">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="text-sm font-medium">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs text-ink-400 hover:text-ink">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-ink/10">
            {(recentOrders ?? []).length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-400">
                No orders yet
              </li>
            )}
            {(recentOrders ?? []).map((o) => {
              const order = o as {
                id: string;
                total: number;
                status: string;
                created_at: string;
                shipping_address: { full_name?: string };
              };
              return (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {order.shipping_address?.full_name || "Customer"}
                    </p>
                    <p className="text-xs text-ink-400">
                      {new Date(order.created_at).toLocaleDateString()} ·{" "}
                      <span className="capitalize">{order.status}</span>
                    </p>
                  </div>
                  <span className="shrink-0 font-medium">
                    {formatPrice(Number(order.total))}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-ink/10 bg-paper">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="text-sm font-medium">Low stock</h2>
            <Link href="/admin/products" className="text-xs text-ink-400 hover:text-ink">
              Manage
            </Link>
          </div>
          <ul className="divide-y divide-ink/10">
            {(lowStock ?? []).length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-ink-400">
                All products well stocked
              </li>
            )}
            {(lowStock ?? []).map((p) => {
              const product = p as {
                id: string;
                name: string;
                stock: number;
                slug: string;
              };
              return (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm"
                >
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {product.name}
                  </Link>
                  <span
                    className={
                      product.stock === 0
                        ? "text-signal font-medium"
                        : "text-ink-400"
                    }
                  >
                    {product.stock} left
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
