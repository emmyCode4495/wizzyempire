import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: "default" | "signal" | "forest";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-ink text-paper",
    signal: "bg-signal text-paper",
    forest: "bg-forest text-paper",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-[11px] font-medium leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
