# Common Ground

Common Ground is a demo-ready web app for real-time communication adaptation in meetings, demos, onboarding sessions, and presentations.

It listens to speech or processes uploaded recordings, keeps the original transcript visible, rewrites the same explanation for different audience types, and produces a structured recap with decisions, action items, risks, and follow-ups.

## Demo path

1. Open `/`
2. Click `Try sample demo`
3. Land inside `/app/demo`
4. Switch demo scenarios and audience modes
5. Review the transcript, adapted explanation, and recap
6. Export the recap

This works without API keys.

## Routes

- `/` premium landing page plus interactive preview
- `/app` demo center
- `/app/live` browser speech-recognition flow with graceful fallback
- `/app/demo` preloaded sample workspace with three scenarios
- `/app/upload` upload and processing flow
- `/app/session/[id]` saved recap and transcript detail
- `/app/history` saved sessions
- `/app/settings` preferences and provider status

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Radix primitives
- Framer Motion
- Vitest + Testing Library
- Playwright

## Notes

- Demo mode is deterministic and works without external AI providers.
- Live mode uses browser speech recognition when available.
- Session history persists locally unless a database is configured later.
