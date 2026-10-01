import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const orders = (data as unknown as Order[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Orders
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink/10 bg-paper">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 bg-ink-50/50 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-ink-400">
                  No orders yet
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-ink-50/40">
                <td className="px-4 py-3">
                  <p className="font-medium">
                    {o.shipping_address?.full_name || "—"}
                  </p>
                  <p className="text-xs text-ink-400">
                    {o.shipping_address?.city}
                    {o.shipping_address?.country
                      ? `, ${o.shipping_address.country}`
                      : ""}
                  </p>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {o.order_items?.length ?? 0}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(Number(o.total))}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect
                    orderId={o.id}
                    value={o.status as OrderStatus}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
