import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { shippingCost } from "@/lib/utils";
import type { CartLine, ShippingAddress } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const body = (await request.json()) as {
    lines: CartLine[];
    shippingAddress: ShippingAddress;
  };

  if (!body.lines || body.lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const subtotal = body.lines.reduce(
    (sum, l) => sum + l.price * l.quantity,
    0
  );
  const shipping = shippingCost(subtotal);
  const total = Number((subtotal + shipping).toFixed(2));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "paid",
      total,
      shipping_address: body.shippingAddress,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "Could not create order" },
      { status: 500 }
    );
  }

  const orderRow = order as { id: string };

  const { error: itemsError } = await supabase.from("order_items").insert(
    body.lines.map((l) => ({
      order_id: orderRow.id,
      product_id: l.product_id,
      name: l.name,
      price: l.price,
      size: l.size,
      color: l.color,
      quantity: l.quantity,
      image: l.image,
    }))
  );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  await supabase.from("cart_items").delete().eq("user_id", user.id);

  return NextResponse.json({ orderId: orderRow.id });
}