# Common Ground Design Rationale

Updated: March 29, 2026

Common Ground is designed around a simple product truth: people often speak in ways that make sense to themselves but not to everyone in the room. The product therefore needs to do two jobs at once:

1. preserve the original conversation faithfully
2. make that conversation easier to understand for a specific audience

## What We Adopted

- WCAG 2.2 and WAI guidance:
  visible focus states, strong contrast, comfortable target sizes, semantic landmarks, keyboard-first navigation, plain-language errors, and accessible status messaging.
- Material 3 adaptive layout guidance:
  use navigation that changes by viewport size, avoid stretched desktop layouts, and prefer multi-pane workspaces when there is clear primary and supporting content.
- web.dev performance guidance:
  reserve space for async panels, minimize layout shift, keep interactivity responsive, and respect reduced-motion preferences.
- MDN media and permissions guidance:
  microphone access is treated as an explicit user decision, with clear permission messaging and graceful fallbacks for denied access, unsupported browsers, or missing devices.
- USWDS form and alert guidance:
  labels stay above fields, helper text reduces uncertainty before action, and alerts explain both what happened and what to do next.
- Current meeting-product patterns from Teams Copilot, Otter, Fireflies, and Zoom:
  transcript plus recap, action-oriented summaries, post-meeting share/export paths, and persistent access to the underlying conversation.

## What We Intentionally Avoided

- forced onboarding before first value
- auth walls or gated demo paths
- transcript-hidden AI outputs
- giant equal-weight dashboards with weak hierarchy
- decorative AI visuals that reduce clarity
- overuse of gradients, glass, or loud motion
- summary cards without transcript provenance
- icon-only primary actions
- empty states that do not tell the user what happens next
- permission prompts without explanation

## How Research Changed The Product

### 1. Demo first, not setup first

Public discussions around AI note takers consistently describe cleanup overhead after the meeting and frustration with onboarding that delays value. Common Ground therefore defaults to an immediate sample demo path from the landing page. The judge can see the differentiator in seconds without creating an account, enabling a mic, or uploading a file.

### 2. Transcript stays visible at all times

Users trust recap output more when they can verify where it came from. The app keeps the transcript visible in the live workspace and lets recap cards jump back to supporting transcript lines on the session detail page.

### 3. The live workspace prioritizes adaptation, not just summary

Teams, Zoom, Otter, and Fireflies all emphasize notes, summaries, and action items. Common Ground adopts the useful recap patterns but makes the right-hand pane about clarity and audience adaptation first. The product story is not "we also summarize meetings"; it is "we make the same message understandable for the person hearing it."

### 4. Mobile gets prioritization, not a shrunken desktop

Material adaptive guidance reinforced a compact-to-expanded navigation model. Common Ground uses a rail/sidebar on larger screens and a bottom navigation pattern on smaller screens. The workspace also changes priority by breakpoint: transcript first, adaptation second, summary third.

### 5. Errors and permissions are product surfaces

Mic permission denied, unsupported browser, no device found, upload failure, and processing failure are all designed as clear, branded states. They preserve user context and present the next best action instead of throwing raw browser or network errors.

### 6. Honest AI language matters

The UI labels summaries and rewrites as AI-generated drafts and preserves manual copy/export control. This directly addresses the common complaint that AI meeting tools save time in the meeting but can create review work later if the output feels too opaque or overconfident.

## Product Pattern Summary

- Microsoft Teams Copilot:
  recap combines transcript-derived notes, follow-up tasks, and meeting context. We adopted structured recap sections and contextual catch-up behavior.
- Otter:
  strong emphasis on automated summaries, action items, and export/share. We adopted clear async recap outputs and share-ready exports.
- Fireflies:
  real-time notes, action items, and customizable summary sections. We adopted progressive insight surfacing and explicit decisions/blockers sections.
- Zoom AI Companion:
  meeting summaries and task extraction tied back to meeting context. We adopted action-oriented recap structure and follow-through framing.

## Experience Principles Used In Common Ground

- Show value in under 10 seconds.
- Keep the original words visible.
- Make audience switching feel instant.
- Use calm, direct UX writing.
- Prefer fewer, clearer panels over many small widgets.
- Treat recap as a draft with evidence, not an answer without proof.
- Keep motion subtle and functional.

## Source List

Standards and guidance:

- W3C WAI, WCAG 2.2 overview: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/
- Android Developers, adaptive do's and don'ts: https://developer.android.com/develop/ui/compose/layouts/adaptive/adaptive-dos-and-donts
- web.dev, Interaction to Next Paint becomes a Core Web Vital on March 12: https://web.dev/blog/inp-cwv-march-12
- MDN, Permissions API: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
- MDN, Web Security overview: https://developer.mozilla.org/en-US/docs/Web/Security
- USWDS alert component: https://designsystem.digital.gov/components/alert/
- USWDS form templates: https://designsystem.digital.gov/components/form-templates/

Current product references:

- Microsoft Teams recap: https://support.microsoft.com/office/meeting-recap-in-microsoft-teams-c2e3a0fe-504f-4b2c-bf85-504938f110ef
- Otter meeting summary overview: https://help.otter.ai/hc/en-us/articles/9156381229079-Meeting-Summary-Overview
- Otter product overview: https://otter.ai/
- Fireflies real-time notes: https://fireflies.ai/product/real-time
- Fireflies customizable summaries: https://guide.fireflies.ai/articles/9547055509-Fireflies-AI-Meeting-Summaries%253A-View%252C-Customise%252C-Expand%252C-Regenerate
- Zoom AI Companion for meetings: https://library.zoom.com/zoom-workplace/ai-companion/artificial-intelligence-bluepaper/ai-companion/ai-companion-features/zoom-meetings

Public discussion used as signal, not specification:

- Reddit, cleanup effort concern with AI meeting assistants: https://www.reddit.com/r/AIAssisted/comments/1rygma6/has_an_ai_meeting_assistant_actually_reduced_your/
- Reddit, onboarding friction in SaaS: https://www.reddit.com/r/UXDesign/comments/1r57tmf/stopped_adding_onboarding_to_our_saas_and/
