import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Called from the root `proxy.ts`. Refreshes the Supabase auth token on
// every request so Server Components always see a valid session, and keeps
// the response cookies in sync using the getAll/setAll pattern (the only
// pattern Supabase supports as of @supabase/ssr 0.12 — mixing in the older
// per-cookie get/set/remove API causes stale-session bugs).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refreshes the auth token if needed and keeps cookies in sync.
  await supabase.auth.getUser();

  return response;
}
