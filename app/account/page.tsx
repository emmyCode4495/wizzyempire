import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";

export const metadata = { title: "My account — LUME" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName = (profile as { full_name?: string } | null)?.full_name ?? "";

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-4xl">My account</h1>
      <div className="grid gap-10 md:grid-cols-[200px_1fr]">
        <nav className="flex flex-row gap-4 border-b border-ink/10 pb-4 text-sm md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-6">
          <span className="font-medium text-ink">Profile</span>
          <Link href="/account/orders" className="text-ink-400 hover:text-ink">
            Orders
          </Link>
        </nav>
        <div>
          <h2 className="mb-4 text-sm font-medium text-ink-600">
            Personal information
          </h2>
          <ProfileForm fullName={fullName} email={user.email ?? ""} />
        </div>
      </div>
    </div>
  );
}
