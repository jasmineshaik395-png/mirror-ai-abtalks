import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <header className="flex items-center justify-between">
        <span className="font-display text-lg tracking-tight text-paper">Mirror</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
          AI Cohort · Interview Agent
        </span>
      </header>

      <section className="mt-10">
        <h1 className="font-display text-[2.1rem] leading-[1.15] text-paper">
          See how you actually sound{" "}
          <span className="italic text-insight">in an interview.</span>
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-paper-dim">
          Most interview tools tell you if you're right. Mirror shows you the
          gap between what you said and what a senior engineer would have
          said — using your own words as the starting point.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-ink-line bg-ink-raised overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-ink-line">
          <div className="p-4">
            <p className="text-[10px] font-mono uppercase tracking-wider text-before">
              What you said
            </p>
            <p className="mt-1.5 text-sm text-paper-dim">
              "RAG helps because the model can look up info instead of just
              knowing it, so it's more accurate."
            </p>
          </div>
          <div className="p-4 bg-insight/[0.04]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-insight">
              The sharper version — same idea
            </p>
            <p className="mt-1.5 text-sm text-paper">
              "RAG retrieves relevant context at query time instead of
              relying only on parametric knowledge. The trade-off: accuracy
              becomes bounded by retrieval quality — bad chunking means the
              model reasons confidently over irrelevant context."
            </p>
          </div>
        </div>
      </section>

      <p className="mt-3 text-center text-xs text-paper-dim">
        Same idea. Same voice. Sharper reasoning.
      </p>

      <section className="mt-10 space-y-4">
        <div className="flex gap-3">
          <span className="font-mono text-xs text-insight-dim mt-0.5">01</span>
          <p className="text-sm text-paper-dim">
            <span className="text-paper">An adaptive interview</span> — a
            senior-engineer AI asks questions grounded in your actual
            curriculum progress, focused where your data shows you're weakest.
          </p>
        </div>
        <div className="flex gap-3">
          <span className="font-mono text-xs text-insight-dim mt-0.5">02</span>
          <p className="text-sm text-paper-dim">
            <span className="text-paper">The Mirror moment</span> — your
            answers, rewritten stronger, with the exact missing reasoning
            named and linked back to a curriculum day.
          </p>
        </div>
      </section>

      <div className="mt-auto pt-10">
        <Link href="/interview" className="block">
          <Button className="w-full">Start your interview</Button>
        </Link>
        <p className="mt-3 text-center text-[11px] text-paper-dim">
          ~8 questions · takes about 10 minutes
        </p>
      </div>
    </main>
  );
}
