import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";

function normalizeProductBody(body: Record<string, unknown>) {
  const categoryRaw = body.category_id;
  const category_id =
    categoryRaw === "" || categoryRaw === undefined || categoryRaw === null
      ? null
      : String(categoryRaw);

  const price = Number(body.price);
  const compareRaw = body.compare_at_price;
  const compare_at_price =
    compareRaw === "" || compareRaw === undefined || compareRaw === null
      ? null
      : Number(compareRaw);

  return {
    name: String(body.name ?? "").trim(),
    slug: String(body.slug ?? "").trim(),
    description: String(body.description ?? "").trim(),
    price: Number.isFinite(price) ? price : NaN,
    compare_at_price:
      compare_at_price != null && Number.isFinite(compare_at_price)
        ? compare_at_price
        : null,
    category_id,
    images: Array.isArray(body.images)
      ? (body.images as string[]).filter((u) => typeof u === "string" && u)
      : [],
    sizes: Array.isArray(body.sizes)
      ? (body.sizes as string[]).filter((s) => typeof s === "string" && s)
      : [],
    colors: Array.isArray(body.colors)
      ? (body.colors as string[]).filter((c) => typeof c === "string" && c)
      : [],
    stock: Math.max(0, Number(body.stock) || 0),
    featured: Boolean(body.featured),
  };
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const row = normalizeProductBody(body);

  if (!row.name || !row.slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }
  if (!Number.isFinite(row.price) || row.price < 0) {
    return NextResponse.json(
      { error: "Enter a valid price" },
      { status: 400 }
    );
  }

  const db = createServiceClient() ?? auth.supabase;

  const { data, error } = await db
    .from("products")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    let msg = error.message;
    if (error.code === "23505") {
      msg = "A product with this slug already exists — use a different slug";
    } else if (error.code === "23503") {
      msg = "Invalid category selected";
    } else if (
      error.message?.toLowerCase().includes("row-level security") ||
      error.code === "42501"
    ) {
      msg =
        "Permission denied (RLS). Add SUPABASE_SERVICE_ROLE_KEY to .env.local, or run the admin write policies from supabase/schema.sql in the Supabase SQL editor.";
    }
    return NextResponse.json({ error: msg, code: error.code }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}