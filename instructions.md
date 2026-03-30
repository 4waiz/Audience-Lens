You are Codex acting as a staff-level product designer, senior full-stack engineer, frontend architect, UX writer, and QA lead.

Build a complete, polished, modern, demo-ready web app called RELAY.

RELAY is a real-time communication adaptation web app for meetings and presentations.
It listens to speech or accepts uploaded audio/video, produces a live transcript, rewrites what is being said in clearer language, adapts it for different audiences, and generates a structured recap with decisions and action items.

This must not look like a student project.
It must feel like a premium, current B2B SaaS product that could plausibly launch.
No outdated UI. No clunky flows. No rough edges. No placeholder feel. No obvious broken states.
Do not stop at scaffolding. Ship a complete, working app.

IMPORTANT OPERATING RULES
- Make strong product decisions without asking follow-up questions.
- If something is unspecified, choose the most polished and user-friendly option.
- Prioritize demo reliability, UX clarity, and professional finish over unnecessary feature sprawl.
- Eliminate runtime errors, TypeScript errors, lint errors, hydration issues, and obvious UX dead-ends.
- Build for judges opening a single link and understanding the product in under 10 seconds.
- Every important screen must be understandable in one glance.
- The app must be usable even if API keys are missing by including a rich demo mode with realistic sample data.

PHASE 0 — RESEARCH BEFORE CODING
If browsing is available, do this first:
1. Review current authoritative guidance and patterns from:
   - WCAG 2.2 / WAI
   - Material Design 3
   - web.dev guidance on Core Web Vitals, responsive design, reduced motion
   - MDN for microphone permission and media APIs
   - USWDS guidance for forms, alerts, and accessibility
2. Review current product patterns from:
   - Microsoft Teams Copilot
   - Otter
   - Fireflies
   - Zoom AI meeting summaries
3. Search Reddit and other public discussions for:
   - pain points with AI note takers
   - frustrations with transcript cleanup
   - missing action items / missing context
   - modern SaaS dashboard usability complaints
   - onboarding friction in productivity tools
4. Create a short design rationale document in the repo:
   /docs/design-rationale.md
   Include:
   - what patterns you adopted
   - what you intentionally avoided
   - how the research influenced the user flow and visual design
If browsing is unavailable, still follow the standards and product constraints named above.

PRODUCT POSITIONING
This is NOT a generic note taker.
This is NOT just transcription.
This is NOT just meeting summaries.
The core differentiator is:
“Take what someone said and make it understandable for the specific audience hearing it.”

PRIMARY VALUE
- Live transcript
- Plain-English rewrite
- Audience-specific rewrite
- Translation-ready structure
- Clear recap with decisions, action items, owners, risks, and follow-ups
- Traceability from recap items back to the transcript

CORE AUDIENCE MODES
- Executive
- Client
- Engineer
- New hire
- Non-native speaker

PRIMARY HACKATHON STORY
The judge should immediately understand:
- People say things that make sense to them, but not to the people hearing them.
- Relay fixes that in real time.
- It also turns the conversation into a clear async update.

PRIMARY DEMO PATH
This path must work perfectly even with no live APIs:
1. Open landing page
2. Click “Try sample demo”
3. Land inside a preloaded live session
4. See transcript updating or already populated
5. Switch between audience modes
6. Watch the explanation rewrite in real time
7. Open summary, decisions, and action items
8. Export/share recap
This must be the fastest, cleanest path in the product.

TECH STACK
Use a modern, reliable, hackathon-friendly stack:
- Next.js (latest stable App Router)
- React
- TypeScript with strict mode
- Tailwind CSS
- shadcn/ui + Radix primitives for accessible components
- Lucide icons
- Framer Motion only for subtle, restrained motion
- React Hook Form + Zod where forms are needed
- Route handlers / server functions for backend endpoints
- A clean service layer for transcription + LLM providers
- Local demo data fallback if no API keys are present
- Persist lightweight demo/session history locally if no database is configured

ARCHITECTURE RULES
- Keep the codebase modular, readable, typed, and production-like.
- Use clear separation between UI components, feature modules, providers, and utilities.
- Use server/client boundaries correctly.
- Any microphone/media code must be client-only and hydration-safe.
- No fragile hacks.
- No giant monolith files.
- No CSS chaos.
- Use semantic HTML.
- Use reusable design tokens via CSS variables for theme colors, radius, spacing, elevation, and focus states.

APP ROUTES / INFORMATION ARCHITECTURE
Implement these routes:

1. /
   Marketing + product-led landing page
2. /app
   Dashboard/home with entry points
3. /app/live
   Live session workspace
4. /app/demo
   Preloaded demo session
5. /app/session/[id]
   Session recap/details page
6. /app/history
   Previous sessions
7. /app/settings
   Preferences, language, theme, permissions guidance, integrations placeholder

Optional:
8. /app/upload
   Upload a recording file and process it

NO AUTH WALL
- Do not block the user behind auth for the hackathon version.
- Support “Continue as guest.”
- If you include auth visuals, they must be optional and non-blocking.
- Judges must be able to use the product instantly.

USER FLOW DESIGN

FLOW A — JUDGE / FIRST-TIME USER
- Lands on /
- Sees one-sentence value proposition
- Sees a strong product visual or interactive preview
- Main CTAs:
  - Try sample demo
  - Start live session
  - Upload recording
- Clicks Try sample demo
- Lands in /app/demo
- Sees transcript, adapted explanation, summary, and export in less than 5 seconds
- No friction

FLOW B — LIVE SESSION
- Go to /app/live
- A clean preflight panel appears:
  - choose input language
  - choose default audience mode
  - optional output language
  - microphone permission explanation
  - optional device selector
- User clicks Start
- If permission granted:
  - live transcript starts
  - timer appears
  - waveform or subtle live indicator appears
  - transcript updates incrementally
- Right panel shows:
  - simplified explanation
  - audience mode rewrite
  - glossary/jargon simplification
  - summary preview
- User ends session
- App routes to /app/session/[id] recap page

FLOW C — UPLOAD RECORDING
- User uploads file
- Show upload progress
- Show processing state with clear stages:
  - Uploading
  - Transcribing
  - Clarifying
  - Extracting decisions and action items
- Then route to recap page
- Preserve source file name and duration metadata if available

FLOW D — REVIEW / EXPORT
- On session detail page, show:
  - overview
  - key points
  - decisions
  - action items
  - risks / blockers
  - follow-ups
  - audience-specific rewrite tabs
  - transcript with clickable timestamps
- Allow:
  - copy summary
  - copy Slack-style update
  - copy email-style recap
  - export markdown / text / JSON if easy
- Summary items should link back to the transcript segment that generated them

PAGE-BY-PAGE SPEC

1) LANDING PAGE (/)
Goal:
- Professional first impression
- Immediate clarity
- Fast route into product

Sections:
- Header with logo, nav, theme toggle, CTA
- Hero with:
  - strong headline
  - plain subheadline
  - primary CTA “Try sample demo”
  - secondary CTA “Start live session”
  - visual product mockup or embedded app preview
- Problem / solution section with 3 cards:
  - Too much jargon
  - Wrong explanation for the audience
  - Meetings end without clear actions
- Feature strip:
  - Live transcript
  - Audience mode
  - Plain-English rewrite
  - Decisions + actions
  - Export recap
- “How it works” in 3 steps
- Sample before/after example block
- Bottom CTA section
- Footer

Landing page style:
- restrained and premium
- product-led, not marketing fluff
- minimal copy, high clarity
- avoid bloated startup cliches

2) APP HOME (/app)
Goal:
- A clean control center
- Let users choose their path immediately

Sections:
- Welcome header
- Quick actions:
  - Start live session
  - Try sample demo
  - Upload recording
- Recent sessions
- Helpful empty state if there are no sessions
- Small tips panel:
  - choose audience mode
  - export recap
  - use sample demo if mic unavailable

3) LIVE WORKSPACE (/app/live and /app/demo)
Goal:
- This is the hero screen
- It must look excellent on desktop and still work on tablet/mobile

DESKTOP LAYOUT
- Top app bar:
  - session title
  - live status
  - timer
  - language selector
  - audience mode selector
  - start / pause / stop controls
  - export dropdown
- Left rail navigation
- Main content area in two-column layout:
  Left column (roughly 55–60%):
  - live transcript stream
  - speaker labels if available
  - timestamps
  - search/filter transcript
  - click a transcript segment to focus analysis on it
  Right column (roughly 40–45%):
  - “Clarity Studio” card
  - tabs or segmented sections:
    - Plain English
    - Audience Mode
    - Translation
    - Summary Preview
  - audience selector chips
  - jargon glossary / term simplifier
  - summary and action preview widgets

BOTTOM / SECONDARY AREA
- optional collapsible “Insights” tray with:
  - Decisions detected
  - Action items
  - Risks
  - Follow-ups

MOBILE / TABLET BEHAVIOR
- stack content cleanly
- use a bottom tab bar or sticky segmented control
- keep core actions thumb-friendly
- transcript first, adaptation second, summary third
- no cramped multi-column layouts on small screens

INTERACTION DETAIL
- Transcript should stream smoothly without layout jumping
- Selected transcript segment should visually highlight
- Adapted explanation should update quickly and clearly
- Switching audience mode should feel instant
- Summary items should update progressively, not all at once if possible
- Use skeleton loaders and subtle shimmer only where useful
- Use gentle motion only; no flashy animation

4) SESSION DETAIL (/app/session/[id])
Goal:
- This is the polished async output page

Structure:
- Header with session name, date, duration, language, export controls
- Tab group or anchored sections:
  - Overview
  - Audience Versions
  - Decisions
  - Action Items
  - Risks / Blockers
  - Full Transcript
- Each summary card should show:
  - concise title
  - short body
  - optional confidence / generated label
  - “jump to transcript” interaction
- Action items should support:
  - owner
  - due date if detected
  - status placeholder
- Include:
  - “Copy for Slack”
  - “Copy for Email”
  - “Copy plain summary”
  - “Copy action items only”

5) HISTORY (/app/history)
Goal:
- Clear and useful, not over-designed

Features:
- session list
- search
- sort by recent
- filter by live/upload/demo
- compact card/list layout
- empty state with CTA to start session

6) SETTINGS (/app/settings)
Include:
- theme: light / dark / system
- language defaults
- default audience mode
- motion preferences
- microphone permission help
- optional integration placeholders
- optional API configuration section if environment variables are not present
- privacy / data note

VISUAL DESIGN DIRECTION
Target aesthetic:
- premium modern B2B SaaS
- somewhere between Linear, Notion, modern AI work tools, and a polished analytics product
- clean, sharp, restrained, intentional

Do:
- strong visual hierarchy
- lots of breathing room
- crisp typography
- subtle borders
- subtle elevation
- clean cards
- restrained accent usage
- highly legible UI
- consistent spacing
- modern density for work software
- polished dark mode and light mode

Do not:
- use outdated gradients everywhere
- use heavy glassmorphism
- use giant neon blobs
- use random illustrations
- use giant shadows
- use inconsistent radii
- use cramped cards
- use icon-only controls without support
- use long unreadable paragraphs
- use generic lorem ipsum
- make it look like a template dump

DESIGN SYSTEM
Define and consistently apply:
- 8pt spacing system
- radius scale
- font scale
- elevation scale
- border color system
- semantic color tokens
- focus ring token
- motion duration/easing tokens

TYPOGRAPHY
- Use a clean modern typeface like Inter or Geist
- Tight, professional headline rhythm
- Excellent readability in body copy
- Clear distinction between:
  - page titles
  - section headings
  - card titles
  - helper text
  - labels
  - metadata
- Avoid oversized hero text that feels juvenile
- Avoid tiny dashboard text

COLOR
- Use a mostly neutral palette with one refined accent color
- Maintain strong contrast
- Use color semantically:
  - success
  - warning
  - error
  - info
  - live/active
- Do not rely on color alone to communicate status

ICONS
- Use icons sparingly and consistently
- Pair important icons with labels or tooltips
- Never let iconography dominate usability

MICROINTERACTIONS
- Smooth hover/focus/press states
- Fast, subtle transitions
- No bouncey over-animation
- Respect reduced-motion
- Use motion to clarify state changes, not to decorate

UX WRITING
Tone:
- clear
- calm
- concise
- professional
- zero fluff
- no hype copy

Rules:
- Buttons should be action-led
- Helper text should reduce uncertainty
- Empty states should explain what happens next
- Errors should be actionable
- Use short labels
- Avoid jargon in UI text
- Make AI output labels honest, e.g. “AI-generated draft — review before sharing”

COMPONENTS TO BUILD
Build polished reusable components for:
- App shell
- Header
- Sidebar / nav
- Hero section
- CTA buttons
- Transcript stream
- Transcript segment card
- Audience selector chips
- Language selector
- Upload dropzone
- Summary card
- Action item card
- Decision card
- Risk/blocker card
- Export menu
- Search input
- Empty state
- Permission prompt
- Alerts / toasts
- Skeleton loaders
- Settings rows
- Toggle groups
- Tabs / segmented controls
- Badge / status pill
- Keyboard shortcut hint component if helpful

AI / PRODUCT BEHAVIOR
Implement feature behavior with graceful fallbacks.

Live transcript:
- Support live display
- If no real transcription provider is available, simulate with high-quality sample data
- Keep transcript streaming believable and smooth

Audience adaptation:
- Switching audience mode rewrites the same content appropriately
- Rewrites should not just change vocabulary; they should change framing

Plain-English mode:
- remove jargon
- shorten
- clarify meaning

Non-native speaker mode:
- simplify syntax
- avoid idioms
- keep vocabulary accessible
- preserve meaning

Summary extraction:
- overview
- key points
- decisions
- action items
- owners if detectable
- risks / blockers
- follow-ups

Traceability:
- each summary/decision/action should link back to supporting transcript lines
- this is important and should feel polished

Export formats:
- Slack-ready async update
- Email-ready meeting recap
- Plain text summary
- Markdown summary

TRUST / SAFETY UX
Because AI can be wrong:
- Keep original transcript visible
- Mark generated outputs clearly but unobtrusively
- Allow manual copy/edit
- Never hide provenance
- Surface confidence or “review before sharing” language where appropriate
- Preserve user control

EMPTY / LOADING / ERROR STATES
Design these deliberately. They are part of the product quality.

Must include:
- no sessions yet
- no transcript yet
- microphone permission denied
- unsupported browser
- no microphone found
- upload failed
- processing failed
- summary generation failed
- network lost
- API key missing
- no search results
- export success
- export failed

Each state must:
- explain what happened
- explain what to do next
- preserve user context where possible
- look polished, not like a default browser message

FORM / INPUT UX
- Labels above fields
- Helpful placeholder text only when useful
- Inline validation
- Preserve entered values on error
- Clear success and error messaging
- Keyboard-friendly
- Mobile-friendly

ACCESSIBILITY REQUIREMENTS
Meet WCAG 2.2 AA where applicable and follow best practices beyond that.

Mandatory:
- semantic HTML
- full keyboard navigation
- visible focus states everywhere
- accessible names/labels
- sufficient contrast
- target sizes comfortable on touch
- reduced-motion support
- screen-reader-friendly forms and alerts
- proper live region handling where useful for transcript updates or status changes
- do not require drag-only interactions
- do not trap focus
- ensure transcript and summary are readable with assistive tech
- theme toggle, tabs, dropdowns, dialogs, and toasts must all be accessible

PERFORMANCE REQUIREMENTS
Build for speed and stability.
- Fast first load
- No jarring layout shifts
- Lazy load non-critical pieces
- Split heavy client-only features
- Memoize where sensible
- Do not block the UI with expensive rendering
- Reserve space for async content when possible
- Optimize for Core Web Vitals
- Avoid unnecessary re-renders in the live transcript view

RESPONSIVE REQUIREMENTS
Must feel designed, not merely shrunken.
Support:
- phone
- tablet
- laptop
- large desktop

Principles:
- content priority changes by breakpoint
- controls remain easy to reach
- transcript remains readable
- buttons remain comfortably tappable
- navigation adapts without becoming confusing

DESIGN QA REQUIREMENTS
Before finishing, audit the UI for:
- inconsistent spacing
- broken typography hierarchy
- mismatched radii
- weak hover/focus states
- overflowing text
- ugly loading states
- awkward empty states
- cramped mobile layouts
- poor dark mode contrast
- too many colors
- low-signal decorations
- any element that looks dated

ENGINEERING QUALITY REQUIREMENTS
Must pass:
- TypeScript strict typecheck
- ESLint
- production build
- no console errors
- no console warnings that matter
- no hydration mismatch
- no broken imports
- no dead routes
- no obvious null/undefined runtime bugs

TESTING
Add meaningful tests for at least:
- landing page renders
- sample demo path works
- audience mode switching works
- export action works
- permission denied fallback renders properly
- session detail view renders summary and transcript
Use Playwright for key user flow if possible.
Add lightweight unit tests where helpful.

DEMO DATA
Create realistic sample data for a cross-functional meeting.
Include:
- technical jargon
- product/business language
- at least one confusing statement that becomes much clearer in audience mode
- multiple decisions
- multiple action items
- one blocker/risk
- one follow-up
The sample should be good enough to impress a judge immediately.

SAMPLE CONTENT QUALITY
Do not use generic fake content.
Use believable meeting content such as:
- product launch sync
- engineering update
- customer-facing feature rollout
- onboarding explanation
Make the before/after rewrite genuinely strong.

README REQUIREMENTS
Create a strong README with:
- product summary
- why it matters
- feature list
- routes
- tech stack
- environment variables
- how to run locally
- demo mode explanation
- design rationale summary
- known future improvements
- screenshots or GIF instructions if easy

FINAL ACCEPTANCE CHECKLIST
The build is only done when all of this is true:
- It looks premium and current
- It does not feel old
- It has no obvious rough edges
- The sample demo path is excellent
- The live workspace is the star of the product
- The UI is accessible
- The product is responsive
- The app is stable
- The output is believable
- The recap page is useful
- The whole product feels launchable
- Judges can understand it instantly
- The differentiator is obvious: audience adaptation, not just note taking

Now build the complete app end-to-end.
Do not return a plan only.
Do not stop at partial implementation.
Ship the product.
LANDING PAGE COPY DIRECTION
Use simple, direct language that a judge understands immediately.

Core product explanation:
“Relay listens to what someone is saying in a meeting or presentation and turns it into clearer words for the people listening.”

Simple value proposition:
“It helps people understand each other better in real time.”

What it does:
- shows live speech as text
- rewrites confusing or technical language into simple language
- changes the explanation based on who is listening
- gives a short summary and action items after

Example messaging:
“If someone says something too technical, Relay changes it into something a client, manager, new hire, or non-native speaker can understand.”

Short pitch options to use across hero, onboarding, and demo screens:
- “It takes confusing communication and makes it clear, live.”
- “Speak normally. Relay makes it understandable.”

Avoid vague AI buzzwords. Prefer simple, concrete wording.