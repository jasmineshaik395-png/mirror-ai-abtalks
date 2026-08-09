export interface CurriculumDay {
  dayId: number;
  module: string;
  topic: string;
  learningObjectives: string[];
  toolsUsed: string[];
}

export interface CandidateAttempt {
  dayId: number;
  attemptCount: number;
  confidenceSignal: "low" | "medium" | "high";
}

export interface CandidateProfile {
  id: string;
  name: string;
  completedDays: number[];
  skippedDays: number[];
  attempts: CandidateAttempt[];
}

export interface TranscriptTurn {
  role: "interviewer" | "candidate";
  content: string;
  dayId?: number;
}

export interface SessionState {
  sessionId: string;
  candidateId: string;
  focusTopics: string[];
  transcript: TranscriptTurn[];
  questionCount: number;
  daysCovered: number[];
  status: "in_progress" | "complete";
}

export interface Transformation {
  original_answer: string;
  improved_answer: string;
  missing_reasoning: string;
  improvements: string[];
  curriculum_gap: { dayId: number; topic: string; reason: string };
  next_action: string;
}

export interface MirrorReport {
  session_summary: string;
  transformations: Transformation[];
}
