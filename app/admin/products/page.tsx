import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProductsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

  const products = (data as unknown as (Product & {
    category?: { name: string } | null;
  })[]) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="sm">Add product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink/10 bg-paper">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 bg-ink-50/50 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink-400">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="underline">
                    Create one
                  </Link>
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-ink-50/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-ink-50">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="truncate text-xs text-ink-400">{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600">
                  {p.category?.name || "—"}
                </td>
                <td className="px-4 py-3">{formatPrice(Number(p.price))}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stock === 0 ? "font-medium text-signal" : undefined
                    }
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/products/${p.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <DeleteButton
                      endpoint={`/api/admin/products/${p.id}`}
                      confirmMessage={`Delete “${p.name}”?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
