# RELAY

RELAY is a demo-ready web app for real-time communication adaptation in meetings and presentations.

It listens to speech or processes uploaded recordings, shows a live transcript, rewrites confusing language into clearer language, adapts that explanation for a specific audience, and produces a structured recap with decisions, action items, risks, and follow-ups.

## Why it matters

People often say things that make sense to themselves but not to everyone hearing them.

RELAY focuses on that gap:

- live transcript
- plain-English rewrite
- audience-specific rewrite
- translation-ready structure
- recap with decisions, action items, owners, risks, and follow-ups
- traceability from recap items back to transcript evidence

## Demo-first product story

The fastest path for a judge is:

1. Open `/`
2. Click `Try sample demo`
3. Land inside `/app/demo`
4. Watch transcript lines appear
5. Switch audience modes
6. Review the summary, decisions, and action items
7. Export the recap

This flow works without API keys.

## Routes

- `/` marketing landing page
- `/app` control center
- `/app/live` microphone preflight and live workspace
- `/app/demo` preloaded sample workspace
- `/app/upload` upload and processing flow
- `/app/session/[id]` session recap and transcript detail
- `/app/history` saved sessions
- `/app/settings` preferences, permissions help, and provider status
- `/api/demo` demo session payload
- `/api/process-upload` demo-safe upload processing endpoint

## Stack

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- Radix primitives with shadcn-style components
- Lucide icons
- Framer Motion for restrained motion
- React Hook Form + Zod in settings
- Vitest + Testing Library
- Playwright

## Demo mode

RELAY is designed to stay usable with zero backend setup.

When no provider keys are configured:

- live mode still works with a demo-safe transcript stream
- upload mode still produces a realistic processed session
- session history persists locally in the browser
- export still works

## Environment variables

No environment variables are required for the hackathon build.

Optional future-facing variables:

- `OPENAI_API_KEY`
- `DEEPGRAM_API_KEY`
- `ASSEMBLYAI_API_KEY`
- `DATABASE_URL`

The current app surfaces whether providers are configured in `/app/settings`, but it always falls back gracefully to demo mode.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

## Design rationale

See [docs/design-rationale.md](docs/design-rationale.md).

Summary:

- adopted WCAG 2.2, web.dev performance guidance, MDN media/permissions guidance, USWDS form and alert guidance, and adaptive layout patterns influenced by Material guidance
- kept the transcript visible beside the AI output
- prioritized instant demo value and transcript traceability
- avoided gated onboarding, decorative AI styling, and summary-only UX without proof

## Screenshots or GIFs

For a quick demo asset pass:

1. Open `/`
2. Capture the hero and product preview
3. Open `/app/demo`
4. Capture transcript + Clarity Studio + Insights
5. Open a session detail page and capture the recap with transcript traceability

## Future improvements

- real streaming transcription provider integration
- real speaker diarization
- collaborative editing on recap output
- calendar and meeting-platform ingestion
- richer translation output by target language
- share links backed by persistent storage
