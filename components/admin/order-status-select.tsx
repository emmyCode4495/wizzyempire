"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

export function OrderStatusSelect({
  orderId,
  value,
}: {
  orderId: string;
  value: OrderStatus;
}) {
  const [status, setStatus] = useState(value);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onChange(next: OrderStatus) {
    setStatus(next);
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (!res.ok) {
      setStatus(value);
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not update status");
      return;
    }
    toast.success("Order updated");
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => onChange(e.target.value as OrderStatus)}
      className="focus-ring h-9 rounded-sm border border-ink/15 bg-paper px-2 text-xs capitalize"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
