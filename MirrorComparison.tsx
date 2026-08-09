"use client";
import { useState } from "react";
import { Transformation } from "@/lib/types";
import { ImprovementCard } from "@/components/ImprovementCard";
import { CurriculumGapCard } from "@/components/CurriculumGapCard";

export function MirrorComparison({
  transformation,
  index,
}: {
  transformation: Transformation;
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative rounded-2xl border border-ink-line bg-ink-raised overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-line px-5 py-3">
        <span className="font-mono text-xs text-paper-dim">Answer {index + 1}</span>
        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="focus-ring rounded-full bg-insight px-4 py-1.5 text-xs font-medium text-ink hover:bg-[#D9B36E] transition-colors"
          >
            Show the stronger version →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* Original */}
        <div className="p-5 border-b md:border-b-0 md:border-r border-ink-line">
          <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-before">
            What you said
          </p>
          <p className="text-[15px] leading-relaxed text-paper-dim">
            {transformation.original_answer}
          </p>
        </div>

        {/* Improved — revealed with wipe animation */}
        <div className="relative p-5">
          {revealed ? (
            <div className="animate-wipe-reveal">
              <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-insight">
                The sharper version — same idea
              </p>
              <p className="text-[15px] leading-relaxed text-paper">
                {transformation.improved_answer}
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-[80px] items-center justify-center text-xs text-paper-dim/50 font-mono">
              waiting for reveal…
            </div>
          )}
        </div>
      </div>

      {revealed && (
        <div className="animate-fade-up space-y-3 border-t border-ink-line bg-ink/40 p-5">
          <ImprovementCard
            missingReasoning={transformation.missing_reasoning}
            improvements={transformation.improvements}
          />
          <CurriculumGapCard
            gap={transformation.curriculum_gap}
            nextAction={transformation.next_action}
          />
        </div>
      )}
    </div>
  );
}
