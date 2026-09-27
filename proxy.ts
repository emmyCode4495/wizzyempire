import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` and runs it on the
// Node.js runtime by default (it previously defaulted to the Edge runtime).
// The request/response APIs are unchanged — only the file name and the
// exported function name (`proxy` instead of `middleware`).
export async function proxy(request: NextRequest) {
  const response = await updateSession(request);

  const protectedPaths = ["/account", "/checkout"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected) {
    const hasAuthCookie = request.cookies
      .getAll()
      .some((c) => c.name.includes("-auth-token"));

    if (!hasAuthCookie) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
