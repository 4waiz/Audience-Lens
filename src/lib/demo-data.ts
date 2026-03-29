import type {
  AudienceMode,
  FollowUpItem,
  SessionAttendee,
  SessionRecord,
  TranscriptSegment,
} from "@/lib/types";

function audienceVersions(
  executive: string,
  client: string,
  engineer: string,
  newHire: string,
  nonNative: string,
): Record<AudienceMode, string> {
  return {
    executive,
    client,
    engineer,
    newHire,
    nonNative,
  };
}

const attendees: SessionAttendee[] = [
  { name: "Maya Chen", role: "Product lead" },
  { name: "Ravi Nair", role: "Engineering lead" },
  { name: "Lena Brooks", role: "Solutions consultant" },
  { name: "Omar Haddad", role: "Design lead" },
  { name: "Sofia Patel", role: "Support operations" },
  { name: "Priya Shah", role: "Legal and privacy" },
];

const transcript: TranscriptSegment[] = [
  {
    id: "seg-001",
    speaker: "Maya Chen",
    speakerRole: "Product lead",
    startMs: 0,
    endMs: 32000,
    text: "For rollout, I want the feature flag parked at twenty percent until activation clears forty-two and the support macro volume stops flaring. If those two lines settle, we can open the gate for the broader self-serve cohort.",
    confidence: 0.97,
    plainEnglish:
      "Keep the new feature available to 20% of users for now. Open it to more people only when setup completion improves and support requests calm down.",
    audienceVersions: audienceVersions(
      "Stay in limited rollout until setup success improves and support load is stable.",
      "We are releasing this carefully. We will expand only after setup results improve and support demand stays steady.",
      "Hold the flag at 20% until activation is above 42% and support macro volume normalizes.",
      "Only a small user group should have the feature for now. We will widen access when setup works better and support noise drops.",
      "Keep the release small now. Open it to more users only when setup results are better and support questions are lower.",
    ),
    glossary: [
      {
        term: "Feature flag",
        meaning: "A switch that turns a feature on for selected users.",
      },
      {
        term: "Support macro",
        meaning: "A saved reply support agents use to answer common questions.",
      },
      {
        term: "Cohort",
        meaning: "A specific group of users being measured together.",
      },
    ],
    translationBrief: {
      meaning:
        "The team is limiting rollout until both product adoption and support stability improve.",
      keepTerms: ["feature flag", "activation", "support"],
      avoid: ["open the gate", "cohort"],
      localizedDrafts: {
        ar: "سنُبقي الإطلاق محدوداً حتى تتحسن نسبة إكمال الإعداد وينخفض ضغط الدعم.",
        es: "Mantendremos el lanzamiento limitado hasta que mejore la finalización de la configuración y baje la carga de soporte.",
      },
    },
    tags: ["rollout", "decision", "metrics"],
  },
  {
    id: "seg-002",
    speaker: "Ravi Nair",
    speakerRole: "Engineering lead",
    startMs: 33000,
    endMs: 68000,
    text: "The event pipeline is deduping the late webhook fan-out, but billing still writes phantom retries when a tenant reconnects inside the ninety-second backoff window.",
    confidence: 0.96,
    plainEnglish:
      "We fixed one source of duplicate events, but billing can still create extra retry records if a customer reconnects too quickly.",
    audienceVersions: audienceVersions(
      "One billing edge case still creates duplicate retry records when customers reconnect quickly.",
      "There is still one backend issue that can briefly create duplicate billing attempts when an account reconnects quickly.",
      "Webhook fan-out dedupe is working, but billing still emits phantom retries when reconnect happens inside the 90-second backoff window.",
      "Part of the system is fixed, but billing can still log extra retry attempts if a customer reconnects too fast.",
      "One system issue is still causing duplicate billing retry records when an account reconnects very quickly.",
    ),
    glossary: [
      {
        term: "Webhook",
        meaning: "A message one system sends to another when something changes.",
      },
      {
        term: "Backoff window",
        meaning: "A short wait period before the system tries again.",
      },
      {
        term: "Phantom retries",
        meaning: "Retry records that appear even though the user did not do the action again.",
      },
    ],
    translationBrief: {
      meaning:
        "A billing-related technical bug can create duplicate retry records if reconnection happens too soon.",
      keepTerms: ["billing", "retries", "90-second window"],
      avoid: ["phantom", "fan-out"],
      localizedDrafts: {
        ar: "لا تزال هناك مشكلة في الفوترة قد تُنشئ محاولات إعادة مكررة إذا أعاد الحساب الاتصال بسرعة كبيرة.",
      },
    },
    tags: ["risk", "billing", "engineering"],
  },
  {
    id: "seg-003",
    speaker: "Lena Brooks",
    speakerRole: "Solutions consultant",
    startMs: 69000,
    endMs: 96000,
    text: "If we say 'phantom retries' on the customer call, they will hear 'double charge'. The better translation is 'you may briefly see duplicate draft notices, but final billing stays correct'.",
    confidence: 0.98,
    plainEnglish:
      "Customers may misunderstand the engineering wording. We should tell them they might briefly see duplicate draft notices, but the final bill will still be correct.",
    audienceVersions: audienceVersions(
      "Customer-facing language should emphasize that billing remains correct even if duplicate draft notices appear briefly.",
      "Do not use internal engineering terms with customers. Tell them they may briefly see duplicate draft notices, but final billing remains accurate.",
      "Translate 'phantom retries' into customer-safe billing language to prevent it sounding like duplicate charges.",
      "The team wants customer wording that explains the effect clearly without scary technical terms.",
      "Use simple customer language: they may briefly see duplicate draft notices, but the final bill is still correct.",
    ),
    glossary: [
      {
        term: "Draft notice",
        meaning: "A temporary billing message shown before the final state is confirmed.",
      },
    ],
    translationBrief: {
      meaning:
        "Customer wording must describe the effect clearly without implying a real double charge.",
      keepTerms: ["final billing stays correct"],
      avoid: ["phantom retries", "double charge"],
      localizedDrafts: {
        es: "Puede que vean avisos duplicados de forma temporal, pero la facturación final seguirá siendo correcta.",
      },
    },
    tags: ["audience-adaptation", "client-language"],
  },
  {
    id: "seg-004",
    speaker: "Omar Haddad",
    speakerRole: "Design lead",
    startMs: 97000,
    endMs: 124000,
    text: "The launch banner still says 'AI-assisted onboarding orchestration'. Nobody outside this room knows what that means. The interface should just say 'step-by-step setup help'.",
    confidence: 0.99,
    plainEnglish:
      "The product copy is too technical. We should rename it to 'step-by-step setup help'.",
    audienceVersions: audienceVersions(
      "Replace vague internal wording with a simple product benefit users understand immediately.",
      "We should use plain product language instead of internal phrasing. The clearer label is 'step-by-step setup help'.",
      "Rename the banner copy so it reflects user value rather than internal architecture language.",
      "The current phrase sounds impressive internally but is hard for new people to understand. Use a direct label instead.",
      "The current label is too technical. Use 'step-by-step setup help' instead.",
    ),
    glossary: [
      {
        term: "Onboarding orchestration",
        meaning: "Internal wording for coordinating setup steps across the product.",
      },
    ],
    translationBrief: {
      meaning:
        "The UI label should describe the user benefit in direct language, not internal terminology.",
      keepTerms: ["step-by-step setup help"],
      avoid: ["AI-assisted onboarding orchestration"],
    },
    tags: ["copy", "ux", "clarity"],
  },
  {
    id: "seg-005",
    speaker: "Maya Chen",
    speakerRole: "Product lead",
    startMs: 125000,
    endMs: 162000,
    text: "Decision: we keep the pilot to internal design partners through Tuesday, then open the waitlist batch on Wednesday morning if Ravi's patch lands and support macros are updated.",
    confidence: 0.99,
    plainEnglish:
      "Decision: only internal pilot customers will use it through Tuesday. The waitlist rollout starts Wednesday morning if the bug fix and support updates are done.",
    audienceVersions: audienceVersions(
      "Decision: keep rollout limited through Tuesday, then expand Wednesday morning if the engineering and support prerequisites are complete.",
      "Decision: the staged release stays limited through Tuesday. We widen access on Wednesday only if the fix and support guidance are ready.",
      "Decision: design partners only through Tuesday, then release to the waitlist Wednesday if the patch ships and macros are updated.",
      "The team decided not to broaden access yet. More users get access on Wednesday only if two specific tasks are finished first.",
      "Decision: keep access limited through Tuesday. Open to the waitlist on Wednesday only if the fix and support updates are complete.",
    ),
    glossary: [
      {
        term: "Pilot",
        meaning: "A controlled early release to a small group of users.",
      },
      {
        term: "Design partners",
        meaning: "Early customers who test features before wider release.",
      },
    ],
    translationBrief: {
      meaning:
        "The rollout will stay limited until Tuesday and only expand on Wednesday if two conditions are met.",
      keepTerms: ["Tuesday", "Wednesday", "patch", "support updates"],
      avoid: ["waitlist batch"],
    },
    tags: ["decision", "rollout"],
  },
  {
    id: "seg-006",
    speaker: "Ravi Nair",
    speakerRole: "Engineering lead",
    startMs: 163000,
    endMs: 194000,
    text: "I can ship the retry-window patch by Monday, March 30 at 3:00 PM GST, but only if we stop sneaking schema changes into the connector feed after lunch.",
    confidence: 0.95,
    plainEnglish:
      "I can deliver the bug fix by Monday, March 30 at 3:00 PM GST, but the data format must stay stable for the rest of the day.",
    audienceVersions: audienceVersions(
      "Engineering can deliver the bug fix by Monday, March 30 at 3:00 PM GST if input changes stop for the rest of the day.",
      "The bug fix will be ready by Monday afternoon if the data coming into the system does not change again today.",
      "Retry-window patch is feasible by Monday, March 30 at 3:00 PM GST if connector feed schema stops changing.",
      "Ravi can finish the fix by Monday afternoon, but only if the team stops changing the data structure during the day.",
      "The fix can be ready by Monday afternoon if the incoming data format stays stable.",
    ),
    glossary: [
      {
        term: "Schema change",
        meaning: "A change to the structure or format of data.",
      },
      {
        term: "Connector feed",
        meaning: "The stream of data coming from another integrated system.",
      },
    ],
    translationBrief: {
      meaning:
        "The patch has a clear delivery time, but it depends on keeping the incoming data format unchanged.",
      keepTerms: ["March 30", "3:00 PM GST", "patch"],
      avoid: ["sneaking schema changes"],
    },
    tags: ["action", "dependency"],
  },
  {
    id: "seg-007",
    speaker: "Sofia Patel",
    speakerRole: "Support operations",
    startMs: 195000,
    endMs: 230000,
    text: "Support still has beta-era macros telling people to refresh twice and clear cookies. That advice is wrong for the new flow and it is inflating ticket noise.",
    confidence: 0.98,
    plainEnglish:
      "Support is still using old instructions. Those instructions are wrong now and they are causing extra tickets.",
    audienceVersions: audienceVersions(
      "Outdated support guidance is creating avoidable ticket volume and needs to be corrected before broader rollout.",
      "Support articles and replies still include old instructions. Updating them will reduce avoidable confusion.",
      "Legacy beta macros are producing inaccurate troubleshooting guidance and inflating support volume.",
      "The support team is using old help text that no longer matches the product. That is causing unnecessary tickets.",
      "Old support instructions are no longer correct and are creating extra support requests.",
    ),
    glossary: [
      {
        term: "Beta-era",
        meaning: "From an earlier test version of the product.",
      },
    ],
    translationBrief: {
      meaning:
        "Support content is outdated and should be corrected before more users get access.",
      keepTerms: ["support", "macros", "ticket volume"],
      avoid: ["ticket noise"],
    },
    tags: ["support", "risk"],
  },
  {
    id: "seg-008",
    speaker: "Lena Brooks",
    speakerRole: "Solutions consultant",
    startMs: 231000,
    endMs: 268000,
    text: "For the client recap, we should frame this as 'guided setup is rolling out in stages' instead of 'progressive activation with instrumentation gating'. Same idea, less translation tax.",
    confidence: 0.99,
    plainEnglish:
      "For clients, say the feature is rolling out in stages. Do not use internal product language.",
    audienceVersions: audienceVersions(
      "Use simple rollout language externally so clients understand the status without translation effort.",
      "Say 'guided setup is rolling out in stages'. Avoid internal rollout jargon in client communication.",
      "Replace internal launch jargon with a customer-safe status explanation in recap copy.",
      "Lena is rewriting the message so people outside the team can understand the rollout immediately.",
      "Use simple wording for clients: the feature is rolling out in stages.",
    ),
    glossary: [
      {
        term: "Instrumentation gating",
        meaning: "Internal jargon for releasing only when tracking and metrics are ready.",
      },
    ],
    translationBrief: {
      meaning:
        "Client-facing recap should use plain release wording, not internal launch terminology.",
      keepTerms: ["guided setup", "rolling out in stages"],
      avoid: ["instrumentation gating", "translation tax"],
    },
    tags: ["audience-adaptation", "client-language"],
  },
  {
    id: "seg-009",
    speaker: "Maya Chen",
    speakerRole: "Product lead",
    startMs: 269000,
    endMs: 306000,
    text: "Big risk: the analytics dashboard is lagging by about twelve minutes, so if a judge or customer asks whether onboarding completion improved live, we may not have trustworthy numbers in the room.",
    confidence: 0.97,
    plainEnglish:
      "Main risk: analytics are delayed by about 12 minutes, so we may not have reliable live numbers during the launch conversation.",
    audienceVersions: audienceVersions(
      "Primary risk: delayed analytics could weaken live reporting confidence during launch conversations.",
      "Risk: live performance numbers may be delayed, so we should not overstate results in real time.",
      "Risk: dashboard latency is around 12 minutes, which makes live activation reporting unreliable.",
      "The main blocker is that the dashboard updates late, so the team may not have accurate numbers during the meeting.",
      "Main risk: the dashboard is about 12 minutes behind, so live numbers may not be reliable.",
    ),
    glossary: [
      {
        term: "Dashboard lag",
        meaning: "The reporting screen updates later than the real events happen.",
      },
    ],
    translationBrief: {
      meaning:
        "Analytics data is delayed, so real-time reporting should be presented carefully.",
      keepTerms: ["12 minutes", "analytics", "live numbers"],
      avoid: ["in the room"],
    },
    tags: ["risk", "analytics"],
  },
  {
    id: "seg-010",
    speaker: "Omar Haddad",
    speakerRole: "Design lead",
    startMs: 307000,
    endMs: 340000,
    text: "I will rewrite the launch note in two versions by Monday, March 30 at 6:00 PM GST: one for admins and one for end users, because the current copy assumes everyone knows what a workspace-level policy is.",
    confidence: 0.98,
    plainEnglish:
      "I will rewrite the launch message by Monday evening in two versions: one for admins and one for end users.",
    audienceVersions: audienceVersions(
      "Design will deliver two audience-specific launch notes by Monday evening so the message matches who is reading it.",
      "You will get clearer launch notes for both admins and end users by Monday evening.",
      "Two audience-specific launch-note variants will be ready by Monday, March 30 at 6:00 PM GST.",
      "Omar is creating two versions of the message because different readers need different context.",
      "Two clearer message versions will be ready by Monday evening: one for admins and one for end users.",
    ),
    glossary: [
      {
        term: "Workspace-level policy",
        meaning: "A setting applied to an entire team or account, not one individual user.",
      },
    ],
    translationBrief: {
      meaning:
        "The launch communication will be split by audience so each group gets the right level of context.",
      keepTerms: ["admins", "end users", "March 30", "6:00 PM GST"],
      avoid: ["workspace-level policy"],
    },
    tags: ["action", "copy"],
  },
  {
    id: "seg-011",
    speaker: "Priya Shah",
    speakerRole: "Legal and privacy",
    startMs: 341000,
    endMs: 378000,
    text: "Before we broaden access, I need a final pass on the transcript retention line in the privacy FAQ. The current wording sounds like we store raw meeting audio forever, which we do not.",
    confidence: 0.99,
    plainEnglish:
      "Before launch expands, legal needs to fix the privacy FAQ because it currently sounds like meeting audio is kept forever.",
    audienceVersions: audienceVersions(
      "Privacy wording needs final legal review before expansion so we do not overstate data retention.",
      "Before broader rollout, we need clearer privacy wording so customers understand what is and is not stored.",
      "Legal needs to revise the retention copy because the current FAQ implies indefinite raw-audio storage.",
      "Priya needs to update the privacy explanation before launch so it matches what the product actually stores.",
      "The privacy FAQ needs one final review before launch because the current wording is misleading.",
    ),
    glossary: [
      {
        term: "Retention",
        meaning: "How long data is kept before it is deleted.",
      },
      {
        term: "Privacy FAQ",
        meaning: "A help page that answers common data and privacy questions.",
      },
    ],
    translationBrief: {
      meaning:
        "The privacy FAQ needs clearer wording so it does not imply permanent raw-audio storage.",
      keepTerms: ["privacy FAQ", "retention", "raw meeting audio"],
      avoid: ["forever"],
    },
    tags: ["risk", "privacy"],
  },
  {
    id: "seg-012",
    speaker: "Maya Chen",
    speakerRole: "Product lead",
    startMs: 379000,
    endMs: 418000,
    text: "Good. Decisions are staged rollout through Tuesday, patch by Monday, support macros updated, and client-safe copy tomorrow. If the dashboard lag is still there by Tuesday, March 31 at noon GST, we call that out instead of bluffing.",
    confidence: 0.97,
    plainEnglish:
      "Summary: keep the rollout staged, deliver the patch Monday, update support and client messaging, and be honest if analytics are still delayed by Tuesday noon.",
    audienceVersions: audienceVersions(
      "Closeout: maintain the staged launch, complete the core fixes, and communicate any analytics limitation transparently.",
      "The plan is set: staged launch, fix the issue, update support and customer wording, and be transparent about any reporting delay.",
      "Closeout: staged rollout stays in place, patch lands Monday, support macros and client copy update, and analytics lag will be disclosed if it persists past Tuesday, March 31 at noon GST.",
      "Maya is restating the final plan and making clear that the team should be honest about the analytics gap if it is not fixed in time.",
      "Final plan: staged rollout, patch on Monday, support and copy updates, and clear communication if analytics are still delayed on Tuesday.",
    ),
    glossary: [
      {
        term: "Client-safe copy",
        meaning: "Wording that is accurate and easy for customers to understand.",
      },
    ],
    translationBrief: {
      meaning:
        "The final plan is confirmed, and the team agrees to disclose analytics limitations instead of improvising around them.",
      keepTerms: ["Tuesday, March 31", "noon GST", "analytics"],
      avoid: ["bluffing"],
    },
    tags: ["decision", "closeout"],
  },
];

const followUps: FollowUpItem[] = [
  {
    id: "followup-analytics",
    title: "Confirm analytics freshness before broader rollout",
    body: "Check whether dashboard latency is still around 12 minutes before the Tuesday noon readiness call.",
    sourceSegmentIds: ["seg-009", "seg-012"],
    confidence: "High confidence",
    owner: "Maya Chen",
  },
  {
    id: "followup-privacy",
    title: "Approve final privacy FAQ language",
    body: "Legal needs to confirm the transcript-retention wording before rollout expands beyond design partners.",
    sourceSegmentIds: ["seg-011"],
    confidence: "High confidence",
    owner: "Priya Shah",
  },
];

export const DEMO_SESSION: SessionRecord = {
  id: "demo-guided-setup-sync",
  title: "Guided Setup launch sync",
  subtitle: "Cross-functional rollout review with product, engineering, support, and legal",
  createdAt: "2026-03-28T08:30:00.000Z",
  updatedAt: "2026-03-28T09:06:00.000Z",
  durationMs: 11 * 60 * 1000 + 48 * 1000,
  kind: "demo",
  status: "ready",
  inputLanguage: "en-US",
  outputLanguage: "en",
  attendees,
  transcript,
  overview:
    "The team aligned on a cautious staged rollout for Guided Setup. They agreed to keep exposure at 20% until adoption and support metrics stabilize, fix a billing retry edge case, rewrite customer-facing language in simpler terms, update outdated support guidance, and review privacy wording before expanding access. The main blocker is analytics lag, which could make live reporting unreliable during launch conversations.",
  keyPoints: [
    {
      id: "key-rollout-guardrail",
      title: "Rollout stays limited until the core signals improve",
      body: "The feature remains at 20% exposure until activation improves and support volume settles.",
      sourceSegmentIds: ["seg-001", "seg-005"],
      confidence: "High confidence",
    },
    {
      id: "key-language-shift",
      title: "The team actively translated internal jargon into audience-safe language",
      body: "Engineering and internal launch terminology were rewritten into wording clients and end users can understand immediately.",
      sourceSegmentIds: ["seg-003", "seg-004", "seg-008"],
      confidence: "High confidence",
    },
    {
      id: "key-support-readiness",
      title: "Support content is part of launch readiness, not an afterthought",
      body: "Legacy macros are outdated and are currently driving avoidable ticket volume.",
      sourceSegmentIds: ["seg-007"],
      confidence: "High confidence",
    },
    {
      id: "key-live-risk",
      title: "Analytics freshness is the main demo and launch risk",
      body: "Dashboard latency could leave the team without trustworthy live numbers in front of judges or customers.",
      sourceSegmentIds: ["seg-009", "seg-012"],
      confidence: "High confidence",
    },
  ],
  decisions: [
    {
      id: "decision-limited-rollout",
      title: "Keep rollout at 20% until adoption and support stabilize",
      body: "The team will not broaden access until activation clears the current threshold and support demand calms down.",
      sourceSegmentIds: ["seg-001"],
      confidence: "High confidence",
      impact: "Reduces the risk of scaling confusion and support load before the launch is ready.",
    },
    {
      id: "decision-partner-through-tuesday",
      title: "Keep the pilot limited through Tuesday",
      body: "Only design-partner accounts stay in the rollout through Tuesday. Waitlist users open Wednesday morning if the patch and support updates are complete.",
      sourceSegmentIds: ["seg-005"],
      confidence: "High confidence",
      impact: "Gives engineering and support a fixed window to stabilize the experience before expanding access.",
    },
    {
      id: "decision-client-language",
      title: "Use plain customer language in launch communication",
      body: "External messaging will say Guided Setup is rolling out in stages, not use internal terminology like instrumentation gating or phantom retries.",
      sourceSegmentIds: ["seg-003", "seg-004", "seg-008"],
      confidence: "High confidence",
      impact: "Makes launch messaging clearer for customers, executives, and judges.",
    },
  ],
  actionItems: [
    {
      id: "action-ravi-patch",
      title: "Ship retry-window patch",
      body: "Deliver the billing retry fix and keep connector-feed schema stable long enough to ship it safely.",
      sourceSegmentIds: ["seg-002", "seg-006"],
      confidence: "High confidence",
      owner: "Ravi Nair",
      dueDate: "Mar 30, 2026, 3:00 PM GST",
      status: "Open",
    },
    {
      id: "action-sofia-macros",
      title: "Replace outdated support macros",
      body: "Remove beta-era troubleshooting advice and align support messaging with the current Guided Setup flow.",
      sourceSegmentIds: ["seg-007"],
      confidence: "High confidence",
      owner: "Sofia Patel",
      dueDate: "Mar 31, 2026, 10:00 AM GST",
      status: "Open",
    },
    {
      id: "action-omar-copy",
      title: "Write audience-specific launch notes",
      body: "Prepare one launch note for admins and one for end users, both in plain language.",
      sourceSegmentIds: ["seg-004", "seg-010"],
      confidence: "High confidence",
      owner: "Omar Haddad",
      dueDate: "Mar 30, 2026, 6:00 PM GST",
      status: "Planned",
    },
    {
      id: "action-priya-privacy",
      title: "Approve final privacy FAQ language",
      body: "Revise the transcript-retention wording so it clearly reflects actual storage behavior.",
      sourceSegmentIds: ["seg-011"],
      confidence: "High confidence",
      owner: "Priya Shah",
      dueDate: "Mar 31, 2026, 12:00 PM GST",
      status: "Open",
    },
  ],
  risks: [
    {
      id: "risk-analytics-lag",
      title: "Analytics data is delayed by about 12 minutes",
      body: "The team may not have trustworthy real-time completion numbers during launch demos or customer conversations.",
      sourceSegmentIds: ["seg-009", "seg-012"],
      confidence: "High confidence",
      severity: "High",
    },
    {
      id: "risk-privacy-wording",
      title: "Privacy FAQ wording may overstate raw-audio retention",
      body: "If the copy is not fixed before rollout expands, customers may misunderstand what data is stored.",
      sourceSegmentIds: ["seg-011"],
      confidence: "High confidence",
      severity: "Medium",
    },
  ],
  followUps,
  audienceRecaps: {
    executive:
      "Guided Setup stays in a controlled rollout through Tuesday. The team has clear owners for the billing patch, support updates, launch copy, and privacy review. The main leadership risk is a 12-minute analytics delay that could weaken live reporting confidence during launch conversations.",
    client:
      "Guided Setup is rolling out in stages. The team is fixing one billing edge case, updating support guidance, and simplifying launch communication so customers see accurate, clearer messaging before broader access opens.",
    engineer:
      "The rollout remains at 20% while the team tracks activation and support volume. Billing still emits phantom retries if reconnect happens inside the 90-second backoff window, support macros need cleanup, and dashboard latency remains the largest launch risk.",
    newHire:
      "The team is preparing a careful launch for Guided Setup. They want to expand only after the experience is more stable, the bug fix is ready, customer wording is simpler, and support and privacy updates are complete.",
    nonNative:
      "The team is releasing Guided Setup slowly. They will fix one billing issue, update support messages, simplify customer wording, and review privacy text before giving access to more users.",
  },
};

export const DEMO_SEGMENT_STREAM_ORDER = transcript.map((segment) => segment.id);
