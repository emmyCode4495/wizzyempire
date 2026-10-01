import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/data";
import {
  MobileNavTrigger,
  MobileNavDrawer,
} from "@/components/mobile-nav";
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
    <>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/95 backdrop-blur-md">
        <div className="container-page relative z-10 flex h-16 items-center justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <MobileNavTrigger />
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2"
              aria-label="Wizzy Empire home"
            >
              <Image
                src="/logo.png"
                alt="Wizzy Empire"
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 object-contain rounded-sm"
                priority
              />
              <span className="hidden min-w-0 flex-col leading-none min-[380px]:flex">
                <span className="font-display truncate text-base font-semibold tracking-[0.12em] uppercase sm:text-lg">
                  Wizzy<span className="text-ink-600 font-medium"> Empire</span>
                </span>
                <span className="mt-0.5 text-[9px] font-medium tracking-[0.2em] uppercase text-ink-400 sm:text-[10px]">
                  Home of luxury
                </span>
              </span>
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

          <div className="relative z-10 flex shrink-0 items-center">
            <SearchBar />
            <UserMenu isSignedIn={!!user} />
            <CartButton />
          </div>
        </div>
      </header>

      <MobileNavDrawer categories={categories} />
    </>
  );
}