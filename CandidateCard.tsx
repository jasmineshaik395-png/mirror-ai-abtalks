"use client";
import { CandidateProfile } from "@/lib/types";
import { Card } from "@/components/ui/card";

export function CandidateCard({
  candidate,
  totalDays,
  onSelect,
}: {
  candidate: CandidateProfile;
  totalDays: number;
  onSelect: () => void;
}) {
  const pct = Math.round((candidate.completedDays.length / totalDays) * 100);
  const lowConfidence = candidate.attempts.filter((a) => a.confidenceSignal === "low");

  return (
    <button onClick={onSelect} className="w-full text-left focus-ring rounded-2xl">
      <Card className="transition-colors hover:border-insight-dim cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg text-paper">{candidate.name}</p>
            <p className="mt-1 text-xs font-mono text-paper-dim">
              {candidate.completedDays.length}/{totalDays} days completed
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-ink-line px-2.5 py-1 text-xs font-mono text-insight">
            {pct}%
          </span>
        </div>
        <div className="mt-4 h-1 w-full rounded-full bg-ink-line overflow-hidden">
          <div
            className="h-full rounded-full bg-insight"
            style={{ width: `${pct}%` }}
          />
        </div>
        {lowConfidence.length > 0 && (
          <p className="mt-3 text-xs text-paper-dim">
            {lowConfidence.length} area{lowConfidence.length > 1 ? "s" : ""} flagged as low-confidence — likely interview focus
          </p>
        )}
      </Card>
    </button>
  );
}
