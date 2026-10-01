import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export function getAdminEmails(): string[] {
  const raw =
    process.env.ADMIN_EMAILS ||
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const admins = getAdminEmails();
  const email = (user.email || "").toLowerCase();

  if (admins.length > 0 && !admins.includes(email)) {
    redirect("/?error=unauthorized");
  }

  return { user, supabase };
}

export async function requireAdminApi() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 as const, user: null, supabase };
  }

  const admins = getAdminEmails();
  const email = (user.email || "").toLowerCase();
  if (admins.length > 0 && !admins.includes(email)) {
    return { error: "Forbidden", status: 403 as const, user: null, supabase };
  }

  return { error: null, status: 200 as const, user, supabase };
}