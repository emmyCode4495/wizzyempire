"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/quantity-stepper";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (product.sizes.length > 0 && !size) {
      toast.error("Please select a size");
      return;
    }
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      size,
      color,
      quantity,
      stock: product.stock,
    });
    toast.success(`Added ${product.name} to your bag`);
  }

  return (
    <div className="flex flex-col gap-6">
      {product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Color — {color}</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "focus-ring border px-3.5 py-2 text-sm",
                  color === c
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 hover:border-ink"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Size — {size || "Select"}</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "focus-ring h-11 min-w-[44px] border px-3 text-sm",
                  size === s
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/15 hover:border-ink"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock || 1} />
        <Button
          size="lg"
          className="flex-1"
          disabled={outOfStock}
          onClick={handleAdd}
        >
          {outOfStock ? "Sold out" : "Add to bag"}
        </Button>
      </div>
    </div>
  );
}
