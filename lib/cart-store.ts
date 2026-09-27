"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";
import type { CartLine } from "@/lib/types";

type CartState = {
  lines: CartLine[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (line: Omit<CartLine, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  syncFromSupabase: (userId: string) => Promise<void>;
  pushToSupabase: (userId: string) => Promise<void>;
  totalItems: () => number;
  subtotal: () => number;
};

function lineId(productId: string, size: string, color: string) {
  return `${productId}__${size}__${color}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isDrawerOpen: false,
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (line) => {
        const id = lineId(line.product_id, line.size, line.color);
        set((state) => {
          const existing = state.lines.find((l) => l.id === id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === id
                  ? {
                      ...l,
                      quantity: Math.min(l.quantity + line.quantity, l.stock),
                    }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, { ...line, id }] };
        });
        set({ isDrawerOpen: true });

        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) get().pushToSupabase(data.user.id);
        });
      },

      removeItem: (id) => {
        set((state) => ({ lines: state.lines.filter((l) => l.id !== id) }));
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) get().pushToSupabase(data.user.id);
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          lines: state.lines.map((l) =>
            l.id === id
              ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) }
              : l
          ),
        }));
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => {
          if (data.user) get().pushToSupabase(data.user.id);
        });
      },

      clear: () => set({ lines: [] }),

      // Pulls the saved server cart and merges it with whatever is in the
      // local (guest) cart, favoring the larger quantity per line.
      syncFromSupabase: async (userId: string) => {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("cart_items")
          .select("*, product:products(*)")
          .eq("user_id", userId);

        if (error || !data) return;

        const remote: CartLine[] = (data as any[])
          .filter((row) => row.product)
          .map((row) => ({
            id: lineId(row.product_id, row.size, row.color),
            product_id: row.product_id,
            name: row.product.name,
            slug: row.product.slug,
            price: row.product.price,
            image: row.product.images?.[0] ?? "",
            size: row.size,
            color: row.color,
            quantity: row.quantity,
            stock: row.product.stock,
          }));

        const local = get().lines;
        const merged = new Map<string, CartLine>();
        for (const l of [...remote, ...local]) {
          const existing = merged.get(l.id);
          merged.set(l.id, existing
            ? { ...l, quantity: Math.max(existing.quantity, l.quantity) }
            : l);
        }

        set({ lines: Array.from(merged.values()) });
        await get().pushToSupabase(userId);
      },

      // Replaces the server cart with the current local cart snapshot.
      pushToSupabase: async (userId: string) => {
        const supabase = createClient();
        const lines = get().lines;

        await supabase.from("cart_items").delete().eq("user_id", userId);

        if (lines.length === 0) return;

        await supabase.from("cart_items").insert(
          lines.map((l) => ({
            user_id: userId,
            product_id: l.product_id,
            size: l.size,
            color: l.color,
            quantity: l.quantity,
          }))
        );
      },

      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.quantity * l.price, 0),
    }),
    { name: "lume-cart" }
  )
);
