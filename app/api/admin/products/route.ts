import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const db = createServiceClient() ?? auth.supabase;

  const { data, error } = await db
    .from("products")
    .insert({
      name: body.name,
      slug: body.slug,
      description: body.description ?? "",
      price: body.price,
      compare_at_price: body.compare_at_price,
      category_id: body.category_id,
      images: body.images ?? [],
      sizes: body.sizes ?? [],
      colors: body.colors ?? [],
      stock: body.stock ?? 0,
      featured: body.featured ?? false,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data, { status: 201 });
}
