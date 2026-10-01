export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-ink/10 bg-paper p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
