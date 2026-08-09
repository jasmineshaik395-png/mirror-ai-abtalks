export function ImprovementCard({
  missingReasoning,
  improvements,
}: {
  missingReasoning: string;
  improvements: string[];
}) {
  return (
    <div className="rounded-xl border border-ink-line bg-ink-raised p-4">
      <p className="text-[10px] font-mono uppercase tracking-wider text-paper-dim">
        What was missing
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-paper">{missingReasoning}</p>
      {improvements.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {improvements.map((imp, i) => (
            <span
              key={i}
              className="rounded-full border border-insight-dim/50 px-2.5 py-1 text-[11px] text-insight"
            >
              {imp}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
