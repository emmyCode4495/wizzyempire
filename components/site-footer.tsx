import Link from "next/link";
import { NewsletterSignup } from "@/components/newsletter-signup";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/category/outerwear", label: "Outerwear" },
      { href: "/category/knitwear", label: "Knitwear" },
      { href: "/category/denim", label: "Denim" },
      { href: "/category/footwear", label: "Footwear" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/account/orders", label: "Track an order" },
      { href: "/", label: "Shipping & returns" },
      { href: "/", label: "Size guide" },
      { href: "/", label: "Contact us" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "Our story" },
      { href: "/", label: "Materials" },
      { href: "/", label: "Sustainability" },
      { href: "/", label: "Careers" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <span className="font-display text-2xl italic">LUME</span>
          <p className="mt-4 text-sm text-ink-400">
            Clothing made from materials worth keeping, sold without the
            markup of a middleman. Designed in small batches, restocked
            rarely.
          </p>
          <div className="mt-6">
            <NewsletterSignup />
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-medium">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-400 hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-ink-400 sm:flex-row">
          <span>© {new Date().getFullYear()} LUME. All rights reserved.</span>
          <span>Built with Next.js &amp; Supabase.</span>
        </div>
      </div>
    </footer>
  );
}
