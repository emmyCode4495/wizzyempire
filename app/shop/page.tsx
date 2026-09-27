import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import { SortSelect } from "@/components/sort-select";
import { cn } from "@/lib/utils";

export const revalidate = 60;

// Next.js 16: `searchParams` is now a Promise and must be awaited.
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: "newest" | "price_asc" | "price_desc";
  }>;
}) {
  const params = await searchParams;

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category: params.category,
      search: params.search,
      sort: params.sort,
    }),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">
            {params.search
              ? `Results for “${params.search}”`
              : "All products"}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        <SortSelect />
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-ink/10 pb-6">
        <Link
          href="/shop"
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm",
            !params.category
              ? "border-ink bg-ink text-paper"
              : "border-ink/15 hover:border-ink"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm",
              params.category === c.slug
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 hover:border-ink"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
