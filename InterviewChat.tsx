"use client";
import { TranscriptTurn } from "@/lib/types";
import { useEffect, useRef } from "react";
import clsx from "clsx";

export function InterviewChat({
  transcript,
  thinking,
}: {
  transcript: TranscriptTurn[];
  thinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, thinking]);

  return (
    <div className="flex flex-col gap-4">
      {transcript.map((turn, i) => (
        <div
          key={i}
          className={clsx(
            "animate-fade-up max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
            turn.role === "interviewer"
              ? "self-start bg-ink-raised border border-ink-line text-paper"
              : "self-end bg-insight/10 border border-insight-dim/40 text-paper"
          )}
        >
          {turn.role === "interviewer" && (
            <p className="mb-1 text-[10px] font-mono uppercase tracking-wider text-insight-dim">
              Interviewer
            </p>
          )}
          <p>{turn.content}</p>
        </div>
      ))}
      {thinking && (
        <div className="self-start flex items-center gap-1.5 rounded-2xl border border-ink-line bg-ink-raised px-4 py-3">
          <span className="h-1.5 w-1.5 rounded-full bg-paper-dim animate-pulse [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-paper-dim animate-pulse [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-paper-dim animate-pulse [animation-delay:300ms]" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
