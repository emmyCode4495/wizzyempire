"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  endpoint,
  label = "Delete",
  confirmMessage = "Delete this item permanently?",
}: {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onDelete() {
    if (!confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(endpoint, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Delete failed");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={onDelete}
      className="text-signal hover:bg-signal/5"
    >
      {loading ? "…" : label}
    </Button>
  );
}
