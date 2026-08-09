export function Progress({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1 w-full rounded-full bg-ink-line overflow-hidden">
      <div
        className="h-full rounded-full bg-insight transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
