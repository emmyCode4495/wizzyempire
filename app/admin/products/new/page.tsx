import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
import type { Category } from "@/lib/types";

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("categories").select("*").order("name");
  const categories = (data as Category[]) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-xs text-ink-400 hover:text-ink"
        >
          ← Products
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
          New product
        </h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
