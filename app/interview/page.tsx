"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import candidatesData from "@/data/candidates.json";
import { CandidateProfile, TranscriptTurn } from "@/lib/types";
import { CandidateCard } from "@/components/CandidateCard";
import { InterviewChat } from "@/components/InterviewChat";
import { AnswerInput } from "@/components/AnswerInput";
import { QuestionProgress } from "@/components/QuestionProgress";
import { Button } from "@/components/ui/button";

const candidates = candidatesData as CandidateProfile[];
const TOTAL_CURRICULUM_DAYS = 10;
const MIN_QUESTIONS = 8;

type Stage = "select" | "brief" | "interviewing" | "finishing";

export default function InterviewPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("select");
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [focusTopics, setFocusTopics] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<TranscriptTurn[]>([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function selectCandidate(c: CandidateProfile) {
    setCandidate(c);
    setStage("brief");
    setThinking(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: c.id }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSessionId(data.sessionId);
      setFocusTopics(data.focusTopics);
      setTranscript([{ role: "interviewer", content: data.question }]);
    } catch {
      setError("Couldn't start the interview. Check your connection and try again.");
    } finally {
      setThinking(false);
    }
  }

  async function submitAnswer(answer: string) {
    if (!sessionId) return;
    setTranscript((t) => [...t, { role: "candidate", content: answer }]);
    setThinking(true);
    setError(null);
    try {
      const res = await fetch("/api/interview/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, answer }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.done) {
        setStage("finishing");
        router.push(`/mirror?sessionId=${sessionId}`);
        return;
      }
      setTranscript((t) => [...t, { role: "interviewer", content: data.question }]);
      setQuestionCount(data.questionCount);
    } catch {
      setError("That question didn't go through. You can try answering again.");
    } finally {
      setThinking(false);
    }
  }

  if (stage === "select") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          Step 1 of 2
        </p>
        <h1 className="mt-2 font-display text-2xl text-paper">Who's interviewing?</h1>
        <p className="mt-1 text-sm text-paper-dim">
          Demo candidate profiles — pick one to begin.
        </p>
        <div className="mt-6 space-y-3">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              totalDays={TOTAL_CURRICULUM_DAYS}
              onSelect={() => selectCandidate(c)}
            />
          ))}
        </div>
      </main>
    );
  }

  if (stage === "brief") {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          Step 2 of 2
        </p>
        <h1 className="mt-2 font-display text-2xl text-paper">
          {candidate?.name.split(" ")[0]}'s interview
        </h1>
        {thinking ? (
          <p className="mt-4 text-sm text-paper-dim animate-pulse">Reading the learning journey…</p>
        ) : (
          <>
            <p className="mt-4 text-sm text-paper-dim">
              We'll focus on the areas your progress shows the most room to grow:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {focusTopics.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-insight-dim/50 bg-insight/5 px-3 py-1.5 text-xs text-insight"
                >
                  {t}
                </span>
              ))}
            </div>
            {error && <p className="mt-4 text-sm text-before">{error}</p>}
            <div className="mt-auto pt-10">
              <Button className="w-full" onClick={() => setStage("interviewing")}>
                Start interview
              </Button>
            </div>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
      <div className="pb-4">
        <QuestionProgress current={questionCount} min={MIN_QUESTIONS} daysCovered={focusTopics.length} />
      </div>
      <div className="flex-1 overflow-y-auto pb-4">
        <InterviewChat transcript={transcript} thinking={thinking} />
        {error && <p className="mt-3 text-sm text-before">{error}</p>}
      </div>
      <AnswerInput onSubmit={submitAnswer} disabled={thinking} />
    </main>
  );
}
