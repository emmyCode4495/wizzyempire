import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await params;
  const body = await request.json();
  const db = createServiceClient() ?? auth.supabase;

  const { error } = await db
    .from("products")
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      compare_at_price: body.compare_at_price,
      category_id: body.category_id,
      images: body.images,
      sizes: body.sizes,
      colors: body.colors,
      stock: body.stock,
      featured: body.featured,
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { id } = await params;
  const db = createServiceClient() ?? auth.supabase;

  const { error } = await db.from("products").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
