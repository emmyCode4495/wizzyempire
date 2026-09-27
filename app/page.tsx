import Link from "next/link";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { Hero } from "@/components/hero";
import { CategoryStrip } from "@/components/category-strip";
import { FeatureStrip } from "@/components/feature-strip";
import { ProductGrid } from "@/components/product-grid";

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Hero />
      <FeatureStrip />
      <CategoryStrip categories={categories} />

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl">New arrivals</h2>
          <Link href="/shop" className="text-sm text-ink-400 hover:text-ink">
            View all
          </Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="border-t border-ink/10 bg-ink py-20 text-paper">
        <div className="container-page grid gap-8 md:grid-cols-2 md:items-center">
          <h2 className="font-display text-4xl leading-tight">
            Made in small batches.
            <br />
            Restocked rarely.
          </h2>
          <p className="max-w-md text-ink-200">
            We work with a handful of family-run mills and workshops instead
            of mass-market factories. It means slower production and
            occasional waitlists — and clothing that actually holds up.
          </p>
        </div>
      </section>
    </>
  );
}
