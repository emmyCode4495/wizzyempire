import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/types";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page py-16">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-3xl">Shop by category</h2>
        <Link href="/shop" className="text-sm text-ink-400 hover:text-ink">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-ink-50"
          >
            {c.image_url && (
              <Image
                src={c.image_url}
                alt={c.name}
                fill
                sizes="(min-width: 768px) 20vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 font-display text-lg text-paper">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
