import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("getCategories error:", error.message);
    return [];
  }
  return (data as Category[]) ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    console.error("getFeaturedProducts error:", error.message);
    return [];
  }
  return (data as unknown as Product[]) ?? [];
}

export async function getProducts(params?: {
  category?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc";
}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*, category:categories(*)");

  if (params?.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single();
    if (cat) query = query.eq("category_id", (cat as { id: string }).id);
  }

  if (params?.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params?.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (params?.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error("getProducts error:", error.message);
    return [];
  }
  return (data as unknown as Product[]) ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getProductBySlug error:", error.message);
    return null;
  }
  return data as unknown as Product;
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeId: string
): Promise<Product[]> {
  if (!categoryId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", categoryId)
    .neq("id", excludeId)
    .limit(4);

  if (error) return [];
  return (data as unknown as Product[]) ?? [];
}
