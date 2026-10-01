import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="container-page grid items-center gap-6 pb-12 pt-4 md:grid-cols-2 md:gap-10 md:pb-16 md:pt-8">
      <div className="order-2 md:order-1">
        <p className="mb-3 text-sm text-ink-400">Autumn/Winter collection</p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tightest sm:text-5xl md:text-6xl lg:text-7xl">
          Clothes built to
          <br />
          <span className="font-semibold tracking-tight">outlast</span> the
          season.
        </h1>
        <p className="mt-4 max-w-md text-base text-ink-600 sm:text-lg">
          Small-batch outerwear, knitwear and denim made from materials worth
          keeping, sold directly to you without the markup of a middleman.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
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

      <div className="order-1 flex w-full justify-center md:order-2 md:justify-end">
        <Image
          src="/hero.jpeg"
          alt="Model wearing a wool overcoat from the Wizzy Empire autumn/winter collection"
          width={900}
          height={1125}
          priority
          className="h-auto w-full max-w-md object-contain sm:max-w-lg md:max-w-none md:w-full"
        />
      </div>
    </section>
  );
}