import { NextRequest, NextResponse } from "next/server";
import candidates from "@/data/candidates.json";
import curriculum from "@/data/curriculum.json";
import { createInterviewPrompt, getNextQuestion } from "@/lib/claude";
import { getSession, updateSession } from "@/lib/session-store";
import { CandidateProfile, CurriculumDay } from "@/lib/types";

const MIN_QUESTIONS = 8;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, answer } = await req.json();
    const session = getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const candidate = (candidates as CandidateProfile[]).find(
      (c) => c.id === session.candidateId
    );
    const curriculumDays = curriculum as CurriculumDay[];
    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    const updatedTranscript = [
      ...session.transcript,
      { role: "candidate" as const, content: answer },
    ];

    const readyToFinish = session.questionCount >= MIN_QUESTIONS;

    if (readyToFinish) {
      updateSession(sessionId, { transcript: updatedTranscript, status: "complete" });
      return NextResponse.json({ done: true });
    }

    const systemPrompt = createInterviewPrompt(candidate, curriculumDays, session.focusTopics);
    const nextQuestion = await getNextQuestion(systemPrompt, updatedTranscript);

    const finalTranscript = [
      ...updatedTranscript,
      { role: "interviewer" as const, content: nextQuestion },
    ];

    updateSession(sessionId, {
      transcript: finalTranscript,
      questionCount: session.questionCount + 1,
    });

    return NextResponse.json({
      done: false,
      question: nextQuestion,
      questionCount: session.questionCount + 1,
    });
  } catch (err) {
    console.error("interview/turn error:", err);
    return NextResponse.json({ error: "Failed to process turn" }, { status: 500 });
  }
}
