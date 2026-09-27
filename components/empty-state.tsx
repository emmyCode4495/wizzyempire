import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-24 text-center",
        className
      )}
    >
      <h3 className="font-display text-2xl">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-ink-400">{description}</p>
      )}
      {action}
    </div>
  );
}
