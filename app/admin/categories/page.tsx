import { requireAdmin } from "@/lib/admin";
import type { Category } from "@/lib/types";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Categories
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          Organize your catalog
        </p>
      </div>
      <CategoryManager categories={(data as Category[]) ?? []} />
    </div>
  );
}
