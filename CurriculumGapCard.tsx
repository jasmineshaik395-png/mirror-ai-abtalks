export function CurriculumGapCard({
  gap,
  nextAction,
}: {
  gap: { dayId: number; topic: string; reason: string };
  nextAction: string;
}) {
  return (
    <div className="rounded-xl border border-insight-dim/40 bg-insight/5 p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-insight/15 px-2 py-0.5 font-mono text-[11px] text-insight">
          Day {gap.dayId}
        </span>
        <span className="text-sm font-medium text-paper">{gap.topic}</span>
      </div>
      <p className="mt-2 text-sm text-paper-dim">{gap.reason}</p>
      <p className="mt-3 text-sm text-paper">
        <span className="text-insight font-medium">Next: </span>
        {nextAction}
      </p>
    </div>
  );
}
