"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Category } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        slug: slug.trim() || slugify(name),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not create category");
      return;
    }
    toast.success("Category created");
    setName("");
    setSlug("");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <form
        onSubmit={onCreate}
        className="space-y-4 rounded-lg border border-ink/10 bg-paper p-5"
      >
        <h2 className="text-sm font-medium">Add category</h2>
        <Input
          id="cat-name"
          label="Name"
          required
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(slugify(e.target.value));
          }}
        />
        <Input
          id="cat-slug"
          label="Slug"
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Button type="submit" size="sm" disabled={loading}>
          {loading ? "Saving…" : "Create"}
        </Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-ink/10 bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-ink-50/50 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-ink-400">
                  No categories yet
                </td>
              </tr>
            )}
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-ink-400">{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton
                    endpoint={`/api/admin/categories/${c.id}`}
                    confirmMessage={`Delete category “${c.name}”?`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
