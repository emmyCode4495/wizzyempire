"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category, Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";

type Props = {
  categories: Category[];
  product?: Product | null;
};

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [compareAt, setCompareAt] = useState(
    product?.compare_at_price != null ? String(product.compare_at_price) : ""
  );
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [stock, setStock] = useState(String(product?.stock ?? 0));
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState((product?.images ?? []).join("\n"));
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(", "));
  const [colors, setColors] = useState((product?.colors ?? []).join(", "));

  function onNameChange(v: string) {
    setName(v);
    if (!product) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim(),
      price: Number(price),
      compare_at_price: compareAt ? Number(compareAt) : null,
      category_id: categoryId || null,
      stock: Number(stock) || 0,
      featured,
      images: images
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Could not save product");
      return;
    }

    toast.success(product ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-5">
      <Input
        id="name"
        label="Name"
        required
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <Input
        id="slug"
        label="Slug"
        required
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-xs font-medium text-ink-600">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="focus-ring rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm placeholder:text-ink-400"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="price"
          label="Price"
          type="number"
          step="0.01"
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          id="compare_at"
          label="Compare-at price"
          type="number"
          step="0.01"
          min="0"
          value={compareAt}
          onChange={(e) => setCompareAt(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-xs font-medium text-ink-600">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="focus-ring h-11 rounded-sm border border-ink/15 bg-paper px-3.5 text-sm"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          id="stock"
          label="Stock"
          type="number"
          min="0"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="images" className="text-xs font-medium text-ink-600">
          Image URLs (one per line)
        </label>
        <textarea
          id="images"
          rows={3}
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="https://..."
          className="focus-ring rounded-sm border border-ink/15 bg-paper px-3.5 py-2.5 text-sm placeholder:text-ink-400"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="sizes"
          label="Sizes (comma-separated)"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          placeholder="XS, S, M, L, XL"
        />
        <Input
          id="colors"
          label="Colors (comma-separated)"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          placeholder="Black, Navy, Olive"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-ink/20"
        />
        Featured on homepage
      </label>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : product ? "Update product" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
