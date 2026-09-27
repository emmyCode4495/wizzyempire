"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/lib/cart-store";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();

    // Pull the signed-in user's saved cart and merge it with the local one.
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) useCartStore.getState().syncFromSupabase(data.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        useCartStore.getState().syncFromSupabase(session.user.id);
      }
      if (event === "SIGNED_OUT") {
        useCartStore.getState().clear();
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      {children}
      <Toaster position="bottom-center" toastOptions={{
        style: {
          background: "#111113",
          color: "#FBFAF8",
          border: "none",
          borderRadius: "2px",
          fontSize: "13px",
        },
      }} />
    </>
  );
}
