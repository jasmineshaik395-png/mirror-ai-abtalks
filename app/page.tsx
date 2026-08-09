"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MirrorReport } from "@/lib/types";
import { MirrorComparison } from "@/components/MirrorComparison";
import { Button } from "@/components/ui/button";

export default function MirrorPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <div className="h-8 w-8 rounded-full border-2 border-ink-line border-t-insight animate-spin" />
        </main>
      }
    >
      <MirrorContent />
    </Suspense>
  );
}

function MirrorContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const [report, setReport] = useState<MirrorReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing interview session.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/api/interview/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReport(data);
      } catch {
        setError("Couldn't generate the Mirror report. Try starting a new interview.");
      } finally {
        setLoading(false);
      }
    })();
  }, [sessionId]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="h-8 w-8 rounded-full border-2 border-ink-line border-t-insight animate-spin" />
        <p className="mt-4 text-sm text-paper-dim">
          Looking back through the interview…
        </p>
      </main>
    );
  }

  if (error || !report) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-before">{error ?? "Something went wrong."}</p>
        <Link href="/interview" className="mt-4">
          <Button variant="ghost">Start a new interview</Button>
        </Link>
      </main>
    );
  }

  const hasTransformations = report.transformations.length > 0;

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-10">
      <p className="font-mono text-[10px] uppercase tracking-widest text-insight-dim">
        Mirror
      </p>
      <h1 className="mt-2 font-display text-2xl leading-snug text-paper">
        {report.session_summary}
      </h1>

      {hasTransformations ? (
        <div className="mt-8 space-y-6">
          {report.transformations.map((t, i) => (
            <MirrorComparison key={i} transformation={t} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-paper-dim">
          No detailed transformations were generated for this session — but the
          summary above still reflects how the interview went.
        </p>
      )}

      <div className="mt-10 pb-10">
        <Link href="/interview">
          <Button variant="ghost" className="w-full">
            Run another interview
          </Button>
        </Link>
      </div>
    </main>
  );
}
