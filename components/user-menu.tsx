"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function UserMenu({ isSignedIn }: { isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!isSignedIn) {
    return (
      <Link
        href="/login"
        aria-label="Log in"
        className="focus-ring flex h-9 w-9 items-center justify-center text-ink hover:text-ink-600"
      >
        <User className="h-5 w-5" strokeWidth={1.5} />
      </Link>
    );
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex h-9 w-9 items-center justify-center text-ink hover:text-ink-600"
      >
        <User className="h-5 w-5" strokeWidth={1.5} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-40 w-48 animate-fade-in border border-ink/10 bg-paper py-2 shadow-lg">
          <Link
            href="/account"
            className="block px-4 py-2 text-sm hover:bg-ink-50"
            onClick={() => setOpen(false)}
          >
            My account
          </Link>
          <Link
            href="/account/orders"
            className="block px-4 py-2 text-sm hover:bg-ink-50"
            onClick={() => setOpen(false)}
          >
            Order history
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-signal hover:bg-signal/5"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
