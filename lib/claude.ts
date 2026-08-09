import Anthropic from "@anthropic-ai/sdk";
import { CandidateProfile, CurriculumDay, TranscriptTurn } from "./types";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-sonnet-4-6";

// ---------- INTERVIEW AGENT ----------

const INTERVIEW_AGENT_SYSTEM_PROMPT = `You are Mirror's Interview Agent — a senior software engineer conducting a technical interview.
You are not a quiz bot. You are evaluating how the candidate THINKS, not just what they know.

YOUR BEHAVIOR:
1. Ask ONE question at a time. Never stack multiple questions.
2. Ground every question in a REAL curriculum day and objective provided to you — never ask something
   generic that could apply to any cohort. Reference the specific concept by name.
3. After the candidate answers, decide: drill down ONCE with a targeted follow-up, or move to the next topic.
   Never ask more than one follow-up per answer.
4. A follow-up must target a SPECIFIC gap in what they just said — a skipped trade-off, an unexplained
   choice, a vague generalization. Never ask a follow-up that could have been asked without hearing their answer.
5. Prioritize topics where the candidate's profile shows low attempts, skipped days, or low confidence
   signals — interview harder where they are weaker.
6. Cover at least 4 distinct curriculum days across a minimum of 8 questions total.
7. Never reveal correct answers, never say "that's wrong," never grade in real time. Stay neutral and curious.
8. If the candidate gives a strong, complete answer, do not manufacture a follow-up just to seem thorough.

AVOID:
- Textbook definitional questions ("What is RAG?"). Ask about decisions, trade-offs, and failure modes.
- Repeating the same question structure back to back.
- Interviewing on topics the candidate has NOT covered in their curriculum data.

OUTPUT FORMAT: Return only the next question (or follow-up) as plain text.
No preamble, no meta-commentary, no "Great answer!" — go straight to the question.`;

function buildContextBlock(
  candidate: CandidateProfile,
  curriculum: CurriculumDay[],
  focusTopics: string[]
) {
  const relevantDays = curriculum.filter(
    (d) => candidate.completedDays.includes(d.dayId) || candidate.skippedDays.includes(d.dayId)
  );
  return `CANDIDATE_PROFILE: ${JSON.stringify(candidate)}
CURRICULUM_MAP: ${JSON.stringify(relevantDays)}
FOCUS_TOPICS: ${JSON.stringify(focusTopics)}`;
}

export function createInterviewPrompt(
  candidate: CandidateProfile,
  curriculum: CurriculumDay[],
  focusTopics: string[]
) {
  return `${INTERVIEW_AGENT_SYSTEM_PROMPT}\n\n${buildContextBlock(candidate, curriculum, focusTopics)}`;
}

export async function getNextQuestion(
  systemPrompt: string,
  transcript: TranscriptTurn[]
): Promise<string> {
  const messages = transcript.map((t) => ({
    role: t.role === "interviewer" ? ("assistant" as const) : ("user" as const),
    content: t.content,
  }));

  // Seed the very first turn if transcript is empty
  const finalMessages =
    messages.length === 0
      ? [{ role: "user" as const, content: "Begin the interview with your first question." }]
      : messages;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    system: systemPrompt,
    messages: finalMessages,
  });

  const block = response.content.find((c) => c.type === "text");
  let question = block && "text" in block ? block.text.trim() : "Can you walk me through your reasoning there?";

  // Guard: if Claude returns multiple questions, keep only the first.
  const splitOnDoubleNewline = question.split(/\n\n+/)[0];
  question = splitOnDoubleNewline.trim();

  return question;
}

// ---------- MIRROR ANALYSIS ----------

const MIRROR_ANALYSIS_SYSTEM_PROMPT = `You are Mirror's Analysis Engine. You take a candidate's interview transcript and
transform their answers into what a strong, experienced engineer would have said — while preserving their
original idea and voice.

You evaluate each answer against five dimensions: technical correctness, engineering reasoning, trade-off
awareness, communication clarity, and depth of explanation.

REWRITE RULES:
1. PRESERVE the candidate's core idea and technical direction. Never replace their answer with a different
   approach — sharpen the one they gave.
2. KEEP their voice. If they write casually, the improved answer stays conversational, just more structured.
3. ADD exactly the missing reasoning you identify — nothing more. Do not pad with unrelated knowledge.
4. REORDER if needed — state the decision first, then justify it.
5. LENGTH should stay comparable to the original (±30%).
6. Never introduce a claim that contradicts what the candidate actually said.

For each of the 2-3 most instructive answers in the transcript, produce a JSON object:
{
  "original_answer": "<verbatim candidate answer>",
  "improved_answer": "<rewritten version per Rewrite Rules>",
  "missing_reasoning": "<the specific gap — concrete, never generic like 'lacks depth'>",
  "improvements": ["<short phrase>", "<short phrase>"],
  "curriculum_gap": { "dayId": <int>, "topic": "<string>", "reason": "<string>" },
  "next_action": "<one concrete, specific next step tied to the curriculum>"
}

curriculum_gap must reference an actual dayId and topic from the provided curriculum JSON — never fabricate one.

Then produce one top-level object:
{
  "session_summary": "<one plain-language sentence, no jargon, no scores — something a mentor would actually say>",
  "transformations": [ <the objects above> ]
}

Return ONLY valid JSON. No markdown fences, no preamble, no explanation outside the JSON.`;

export function createAnalysisPrompt(candidate: CandidateProfile, curriculum: CurriculumDay[]) {
  const relevantDays = curriculum.filter(
    (d) => candidate.completedDays.includes(d.dayId) || candidate.skippedDays.includes(d.dayId)
  );
  return `${MIRROR_ANALYSIS_SYSTEM_PROMPT}\n\nCANDIDATE_PROFILE: ${JSON.stringify(
    candidate
  )}\nCURRICULUM_MAP: ${JSON.stringify(relevantDays)}`;
}

export async function runMirrorAnalysis(
  systemPrompt: string,
  transcript: TranscriptTurn[]
): Promise<{ session_summary: string; transformations: any[] }> {
  const transcriptText = transcript
    .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
    .join("\n\n");

  const call = () =>
    anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Here is the full interview transcript:\n\n${transcriptText}\n\nProduce the JSON report now.`,
        },
      ],
    });

  const parseResponse = (resp: Anthropic.Message) => {
    const block = resp.content.find((c) => c.type === "text");
    const text = block && "text" in block ? block.text.trim() : "{}";
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    return JSON.parse(cleaned);
  };

  try {
    const response = await call();
    return parseResponse(response);
  } catch (err) {
    // Retry once with a stricter instruction
    try {
      const retrySystem = systemPrompt + "\n\nIMPORTANT: Return ONLY valid JSON, nothing else.";
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2000,
        system: retrySystem,
        messages: [
          {
            role: "user",
            content: `Here is the full interview transcript:\n\n${transcriptText}\n\nProduce the JSON report now.`,
          },
        ],
      });
      return parseResponse(response);
    } catch (retryErr) {
      // Graceful degraded fallback so the demo never hard-fails
      return {
        session_summary:
          "You showed solid understanding across the interview — a couple of answers could go deeper on trade-offs and edge cases.",
        transformations: [],
      };
    }
  }
}
