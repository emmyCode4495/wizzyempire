import { notFound } from "next/navigation";
import { getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product-grid";
import { SortSelect } from "@/components/sort-select";

export const revalidate = 60;

// Next.js 16: both `params` and `searchParams` are now Promises.
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: "newest" | "price_asc" | "price_desc" }>;
}) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = await getProducts({ category: slug, sort });

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">{category.name}</h1>
          <p className="mt-1 text-sm text-ink-400">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
        <SortSelect />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
