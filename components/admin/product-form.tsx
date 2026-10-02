"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, X, Loader2 } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState((product?.sizes ?? []).join(", "));
  const [colors, setColors] = useState((product?.colors ?? []).join(", "));

  function onNameChange(v: string) {
    setName(v);
    if (!product) setSlug(slugify(v));
  }

  function removeImage(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    const form = new FormData();
    for (const file of files) {
      form.append("files", file);
    }

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Upload failed");
        return;
      }
      if (data.urls?.length) {
        setImageUrls((prev) => [...prev, ...data.urls]);
        toast.success(
          data.urls.length === 1
            ? "Image uploaded"
            : `${data.urls.length} images uploaded`
        );
      }
      if (data.errors?.length) {
        toast.error(data.errors.join("; "));
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
      images: imageUrls,
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
          label="Price (₦)"
          type="number"
          step="1"
          min="0"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Input
          id="compare_at"
          label="Compare-at price (₦)"
          type="number"
          step="1"
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

      {/* Image picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-ink-600">Images</span>
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group relative h-24 w-20 overflow-hidden rounded-sm border border-ink/10 bg-ink-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Product ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-ink/80 p-0.5 text-paper opacity-90 hover:bg-signal"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-ink/25 bg-paper text-ink-400 transition hover:border-ink/40 hover:text-ink-600 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
            )}
            <span className="text-[10px] leading-tight">
              {uploading ? "Uploading…" : "Add"}
            </span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={onFilesSelected}
        />
        <p className="text-xs text-ink-400">
          JPEG, PNG, WebP or GIF · max 5 MB each · pick from your device
        </p>
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
        <Button type="submit" disabled={loading || uploading}>
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