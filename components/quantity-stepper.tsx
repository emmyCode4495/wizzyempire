"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  max = 99,
  min = 1,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center border border-ink/15 text-sm",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        className="focus-ring flex h-full w-9 items-center justify-center text-ink-600 hover:text-ink disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="focus-ring flex h-full w-9 items-center justify-center text-ink-600 hover:text-ink disabled:opacity-30"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
