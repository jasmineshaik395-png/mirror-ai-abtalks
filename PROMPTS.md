# AI Usage Log — Mirror AI

This project was built with Claude (Anthropic) as an AI pair-engineer across
product strategy, prompt design, and implementation. Below is the prompt
sequence used, in order.

## 1. Problem selection
Asked Claude to compare the three AB Talks problem statements and recommend
one based on fit with a data science / ML background and a tight solo timeline.
→ Landed on Problem Statement 2: The Interview Agent.

## 2. Product ideation
Prompted Claude, acting as "Hackathon Co-Founder / Product Strategist," to
brainstorm 20 product directions, reject the 15 weakest with reasoning, and
combine the strongest into one concept. This produced the original "Mirror"
concept: an interview agent whose core differentiator is rewriting the
candidate's own answer into a stronger version rather than just scoring it.

## 3. Ruthless judge critique
Prompted Claude to review its own concept as a hackathon judge who has seen
200 similar submissions — identify generic parts, the strongest 30-second demo
moment, and what to cut. This trimmed the evaluation screen from a 3-metric
scorecard + separate roadmap page down to one narrative sentence + the
before/after reveal, to protect build time for the one differentiating feature.

## 4. System prompt & architecture design
Prompted Claude, acting as "Senior AI Engineer," to design:
- The Interview Agent system prompt (adaptive, curriculum-grounded questioning)
- The Mirror Analysis system prompt (structured JSON: original_answer,
  improved_answer, missing_reasoning, improvements, curriculum_gap, next_action)
- Rewrite rules (preserve voice and idea, add only the missing reasoning)
- Claude API flow, context management, JSON schemas, and failure handling
- Five example before/after transformations across RAG, Vector DBs, Agents,
  MCP, and AI Deployment — used as a manual test set against the real prompt.

## 5. Full-stack implementation
Prompted Claude, acting as "Senior Full Stack Engineer," to scaffold and build
the Next.js app: folder structure, `lib/claude.ts` (prompt builders + Claude
API calls), in-memory session store, mock data files, all three routes
(`/`, `/interview`, `/mirror`), the seven required components, and the three
API routes (`start`, `turn`, `analyze`). Also asked Claude to apply the
frontend-design skill to move the visual system away from generic
AI-template defaults (warm-cream/serif or near-black/neon) toward a custom
"reflection" palette (deep ink, brass/insight-gold accent) built specifically
around the Mirror before/after reveal as the page's signature moment.

## 6. Verification
Ran `npm run build` to confirm a clean TypeScript + Next.js production build
before submission.

---
*Full chat transcripts available on request / exported alongside this repo.*
