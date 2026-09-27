import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ProductGrid } from "@/components/product-grid";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

// Next.js 16: `params` is now a Promise in both generateMetadata and the page.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — LUME`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id);
  const onSale =
    product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="container-page py-10">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div className="animate-slide-up md:sticky md:top-24 md:self-start">
          {product.category?.name && (
            <p className="mb-2 text-sm text-ink-400">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className={onSale ? "text-lg text-signal" : "text-lg"}>
              {formatPrice(product.price)}
            </span>
            {onSale && (
              <span className="text-sm text-ink-400 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
            {onSale && <Badge tone="signal">Sale</Badge>}
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-600">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>

          <dl className="mt-10 space-y-2 border-t border-ink/10 pt-6 text-sm text-ink-400">
            <div className="flex justify-between">
              <dt>Shipping</dt>
              <dd>Free over $150, 3–5 business days</dd>
            </div>
            <div className="flex justify-between">
              <dt>Returns</dt>
              <dd>30 days, unworn with tags</dd>
            </div>
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-3xl">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
