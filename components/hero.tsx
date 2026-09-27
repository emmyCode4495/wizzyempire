import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container-page grid gap-8 pb-16 pt-10 md:grid-cols-2 md:items-center md:pt-16">
      <div className="order-2 md:order-1">
        <p className="mb-4 text-sm text-ink-400">Autumn/Winter collection</p>
        <h1 className="font-display text-[13vw] leading-[0.95] tracking-tightest sm:text-6xl md:text-7xl">
          Clothes built to
          <br />
          <span className="italic">outlast</span> the season.
        </h1>
        <p className="mt-6 max-w-md text-ink-600">
          Small-batch outerwear, knitwear and denim made from materials worth
          keeping, sold directly to you without the markup of a middleman.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/shop">
            <Button size="lg">Shop the collection</Button>
          </Link>
          <Link href="/category/outerwear">
            <Button size="lg" variant="outline">
              Outerwear
            </Button>
          </Link>
        </div>
      </div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden bg-ink-50 md:order-2">
        <Image
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1200"
          alt="Model wearing a wool overcoat from the LUME autumn/winter collection"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
