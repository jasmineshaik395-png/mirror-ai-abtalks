# Mirror AI — The Engineering Thinking Coach

Built for AB Talks Ycodathon — Problem Statement 2: The Interview Agent.

Mirror doesn't just score interview answers. It runs an adaptive technical
interview grounded in a candidate's real curriculum progress, then shows them
their own answer **rewritten stronger** — same idea, same voice, sharper
engineering reasoning — with the exact missing reasoning named and linked back
to a curriculum day.

## Route map

- `/` — Landing page
- `/interview` — Candidate select → brief → adaptive interview chat
- `/mirror?sessionId=...` — The Mirror analysis screen (the core demo moment)

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Claude API
(`@anthropic-ai/sdk`) · in-memory session store · mock JSON data (no DB, no auth).

## Local setup

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm run dev
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the `ANTHROPIC_API_KEY` environment variable in the Vercel project settings.
4. Deploy.

## How it works

- `lib/claude.ts` — `createInterviewPrompt()` and `createAnalysisPrompt()` build
  the two system prompts; `getNextQuestion()` drives the live interview loop,
  `runMirrorAnalysis()` produces the structured Mirror report (with a retry +
  graceful fallback if Claude's JSON output ever fails to parse).
- `data/candidates.json` / `data/curriculum.json` — mocked candidate journeys
  and the 31-day curriculum map (10 representative days included).
- Session state is held in-memory (`lib/session-store.ts`) — no database, no
  persistent history, matching the challenge's scope.

## Note on API costs

No AI credits are provided by the organizers — this uses your own
`ANTHROPIC_API_KEY` (free-tier/pay-as-you-go). See `PROMPTS.md` for the AI
usage log.
