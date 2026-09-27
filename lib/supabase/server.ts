import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types";

// Next.js 16 made `cookies()` async, so this factory is now async too —
// every call site must `await createClient()`. @supabase/ssr also now only
// supports the getAll/setAll cookie API (the older per-cookie get/set/remove
// API was removed).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component, which can't set
            // cookies directly — safe to ignore since `proxy.ts` refreshes
            // the session on every request.
          }
        },
      },
    }
  );
}
