"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const onSale =
    product.compare_at_price && product.compare_at_price > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block animate-slide-up"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-50">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale && <Badge tone="signal">Sale</Badge>}
          {product.stock === 0 && <Badge>Sold out</Badge>}
        </div>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm">{product.name}</h3>
          {product.category?.name && (
            <p className="mt-0.5 text-xs text-ink-400">
              {product.category.name}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end text-sm">
          <span className={onSale ? "text-signal" : ""}>
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-xs text-ink-400 line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
