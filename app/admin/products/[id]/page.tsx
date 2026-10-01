import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { ProductForm } from "@/components/admin/product-form";
import type { Category, Product } from "@/lib/types";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
  ]);

  if (!product) notFound();

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
          Edit product
        </h1>
      </div>
      <ProductForm
        categories={(categories as Category[]) ?? []}
        product={product as unknown as Product}
      />
    </div>
  );
}
