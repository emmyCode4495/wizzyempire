import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";
import { MobileNav } from "@/components/mobile-nav";
import { UserMenu } from "@/components/user-menu";
import { CartButton } from "@/components/cart-button";
import { SearchBar } from "@/components/search-bar";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MobileNav categories={categories} />
          <Link
            href="/"
            className="font-display text-2xl italic tracking-tightest"
          >
            LUME
          </Link>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/shop" className="text-sm hover:text-ink-600">
            All products
          </Link>
          {categories.slice(0, 4).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="text-sm hover:text-ink-600"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchBar />
          <UserMenu isSignedIn={!!user} />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
