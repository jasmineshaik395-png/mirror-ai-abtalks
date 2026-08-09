import { NextRequest, NextResponse } from "next/server";
import candidates from "@/data/candidates.json";
import curriculum from "@/data/curriculum.json";
import { createAnalysisPrompt, runMirrorAnalysis } from "@/lib/claude";
import { getSession, updateSession } from "@/lib/session-store";
import { CandidateProfile, CurriculumDay } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const candidate = (candidates as CandidateProfile[]).find(
      (c) => c.id === session.candidateId
    );
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const curriculumDays = curriculum as CurriculumDay[];
    const systemPrompt = createAnalysisPrompt(candidate, curriculumDays);
    const report = await runMirrorAnalysis(systemPrompt, session.transcript);

    updateSession(sessionId, { status: "complete" });

    return NextResponse.json(report);
  } catch (err) {
    console.error("interview/analyze error:", err);
    return NextResponse.json({ error: "Failed to analyze interview" }, { status: 500 });
  }
}
