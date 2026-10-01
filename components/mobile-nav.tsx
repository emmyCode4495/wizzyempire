import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import type { Category } from "@/lib/types";

export function MobileNavTrigger() {
  return (
    <label
      htmlFor="we-nav-toggle"
      className="mobile-menu-btn"
      aria-label="Open menu"
    >
      <Menu size={22} strokeWidth={2.25} aria-hidden="true" />
    </label>
  );
}

export function MobileNavDrawer({ categories }: { categories: Category[] }) {
  const list = categories ?? [];

  return (
    <>
      <input
        type="checkbox"
        id="we-nav-toggle"
        className="we-nav-toggle"
        aria-hidden="true"
      />

      <label
        htmlFor="we-nav-toggle"
        className="we-nav-backdrop"
        aria-label="Close menu"
      />

      <div className="we-nav-panel" role="dialog" aria-label="Navigation menu">
        <div className="we-nav-panel-header">
          <Link href="/" className="we-nav-brand">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="we-nav-logo"
            />
            <span className="we-nav-brand-text-wrap">
              <span className="we-nav-brand-text">Wizzy Empire</span>
              <span className="we-nav-brand-slogan">Home of luxury</span>
            </span>
          </Link>
          <label
            htmlFor="we-nav-toggle"
            className="nav-icon-btn"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={2} aria-hidden="true" />
          </label>
        </div>

        <div className="we-nav-body">
          <p className="we-nav-section-label">Shop</p>
          <Link href="/shop" className="we-nav-link we-nav-link-strong">
            All products
          </Link>
          {list.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="we-nav-link"
            >
              {c.name}
            </Link>
          ))}

          <div className="we-nav-divider" />

          <p className="we-nav-section-label">Account</p>
          <Link href="/account" className="we-nav-link we-nav-link-row">
            <User size={16} strokeWidth={1.75} aria-hidden="true" />
            My account
          </Link>
          <Link href="/account/orders" className="we-nav-link we-nav-link-row">
            <ShoppingBag size={16} strokeWidth={1.75} aria-hidden="true" />
            Orders
          </Link>
          <Link href="/login" className="we-nav-link we-nav-link-muted">
            Log in / Sign up
          </Link>
        </div>

        <div className="we-nav-footer">
          <Link href="/shop" className="we-nav-cta">
            Shop the collection
          </Link>
        </div>
      </div>
    </>
  );
}