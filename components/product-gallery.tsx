"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const shown = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-50">
        <Image
          key={shown[active]}
          src={shown[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="animate-fade-in object-cover"
        />
      </div>
      {shown.length > 1 && (
        <div className="mt-3 flex gap-2">
          {shown.map((src, i) => (
            <button
              key={src + i}
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden bg-ink-50",
                active === i && "ring-2 ring-ink"
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
