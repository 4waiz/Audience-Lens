import type {
  AudienceMode,
  DemoScenario,
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

function buildSession(options: {
  id: string;
  title: string;
  subtitle: string;
  attendees: SessionAttendee[];
  transcript: TranscriptSegment[];
  overview: string;
  keyPoints: SessionRecord["keyPoints"];
  decisions: SessionRecord["decisions"];
  actionItems: SessionRecord["actionItems"];
  risks: SessionRecord["risks"];
  followUps: FollowUpItem[];
  audienceRecaps: SessionRecord["audienceRecaps"];
  createdAt?: string;
  updatedAt?: string;
}) {
  return {
    id: options.id,
    title: options.title,
    subtitle: options.subtitle,
    createdAt: options.createdAt ?? "2026-03-29T09:00:00.000Z",
    updatedAt: options.updatedAt ?? "2026-03-29T09:11:00.000Z",
    durationMs: options.transcript.at(-1)?.endMs ?? 0,
    kind: "demo" as const,
    status: "ready" as const,
    inputLanguage: "en-US" as const,
    outputLanguage: "en" as const,
    attendees: options.attendees,
    transcript: options.transcript,
    overview: options.overview,
    keyPoints: options.keyPoints,
    decisions: options.decisions,
    actionItems: options.actionItems,
    risks: options.risks,
    followUps: options.followUps,
    audienceRecaps: options.audienceRecaps,
  };
}

const clientCallAttendees: SessionAttendee[] = [
  { name: "Maya Chen", role: "Product lead" },
  { name: "Ravi Nair", role: "Engineering lead" },
  { name: "Lena Brooks", role: "Solutions consultant" },
  { name: "Sofia Patel", role: "Support operations" },
];

const clientCallTranscript: TranscriptSegment[] = [
  {
    id: "client-001",
    speaker: "Ravi Nair",
    speakerRole: "Engineering lead",
    startMs: 0,
    endMs: 25000,
    text: "The event pipeline is deduping late webhook fan-out, but billing still writes phantom retries during the ninety-second backoff window.",
    confidence: 0.98,
    plainEnglish:
      "We fixed one duplicate-event issue, but billing can still create extra retry attempts during reconnects.",
    audienceVersions: audienceVersions(
      "There is one remaining billing risk during rapid reconnects. It is limited, understood, and being patched.",
      "There is still one backend issue that can briefly create duplicate billing attempts when an account reconnects quickly.",
      "The webhook dedupe path is fixed, but billing still emits phantom retries when reconnect happens inside the ninety-second backoff window.",
      "We fixed one duplicate-event issue, but billing can still create extra retry attempts during reconnects.",
      "There is one billing problem. If an account reconnects fast, the system may try billing again for a short time.",
    ),
    glossary: [
      {
        term: "Webhook",
        meaning: "An automatic message another system sends when something changes.",
      },
      {
        term: "Backoff window",
        meaning: "A short waiting period before the system retries.",
      },
      {
        term: "Phantom retries",
        meaning: "Retry records that appear even though the customer did not trigger a new charge.",
      },
    ],
    translationBrief: {
      meaning:
        "A reconnect edge case can create duplicate retry records for a short period, but the team is already patching it.",
      keepTerms: ["billing", "retries", "ninety-second window"],
      avoid: ["phantom", "fan-out"],
    },
    tags: ["billing", "risk", "engineering"],
  },
  {
    id: "client-002",
    speaker: "Lena Brooks",
    speakerRole: "Solutions consultant",
    startMs: 26000,
    endMs: 52000,
    text: "On the client call, we should translate that as 'you may briefly see duplicate draft notices, but final billing stays correct' so nobody hears 'double charge'.",
    confidence: 0.99,
    plainEnglish:
      "For clients, say they may briefly see duplicate draft notices, but the final bill will still be correct.",
    audienceVersions: audienceVersions(
      "Client language should protect trust while making clear that final billing stays correct.",
      "Tell the client they may briefly see duplicate draft notices, but the final bill remains accurate.",
      "Customer-safe wording should avoid 'double charge' and keep the statement tied to temporary draft notices.",
      "This is the team rewriting technical wording so clients understand the effect without hearing a worse problem than the one that exists.",
      "Use simple words: the client may briefly see duplicate draft notices, but the final bill is correct.",
    ),
    glossary: [
      {
        term: "Draft notice",
        meaning: "A temporary billing message shown before the final state is confirmed.",
      },
    ],
    translationBrief: {
      meaning:
        "The client-facing version must explain the effect clearly without implying a real double charge.",
      keepTerms: ["final billing stays correct"],
      avoid: ["double charge", "phantom retries"],
    },
    tags: ["client-language", "messaging"],
  },
  {
    id: "client-003",
    speaker: "Maya Chen",
    speakerRole: "Product lead",
    startMs: 53000,
    endMs: 76000,
    text: "Decision: we keep the pilot on the design-partner accounts through Tuesday and widen access Wednesday morning only if Ravi's patch is in and support macros are updated.",
    confidence: 0.99,
    plainEnglish:
      "Decision: keep access limited through Tuesday. Open it wider on Wednesday only if the fix and support updates are complete.",
    audienceVersions: audienceVersions(
      "Decision: stay in controlled rollout through Tuesday, then expand Wednesday if the engineering and support prerequisites are complete.",
      "We are keeping the release limited through Tuesday and widening it on Wednesday only if the fix and support guidance are ready.",
      "Pilot stays on design partners through Tuesday. Waitlist expansion starts Wednesday only after the patch ships and macros are updated.",
      "The team decided not to broaden access yet. Two things must be finished before more customers get it.",
      "Keep access limited through Tuesday. Open it wider on Wednesday only if the fix and support updates are done.",
    ),
    glossary: [
      {
        term: "Pilot",
        meaning: "A limited early release to a small group of users.",
      },
      {
        term: "Support macros",
        meaning: "Saved support replies used to answer repeated questions quickly.",
      },
    ],
    translationBrief: {
      meaning:
        "The rollout remains limited until the bug fix and support updates are both complete.",
      keepTerms: ["Tuesday", "Wednesday", "patch", "support updates"],
      avoid: ["design partners", "widen access"],
    },
    tags: ["decision", "rollout"],
  },
  {
    id: "client-004",
    speaker: "Sofia Patel",
    speakerRole: "Support operations",
    startMs: 77000,
    endMs: 102000,
    text: "Support still has beta-era macros telling customers to refresh twice and clear cookies. That advice is wrong for the new flow and it is inflating ticket volume.",
    confidence: 0.97,
    plainEnglish:
      "Support is still using old instructions. They are wrong for the new flow and they are causing extra tickets.",
    audienceVersions: audienceVersions(
      "Outdated support guidance is still creating avoidable ticket volume before the wider release.",
      "Support content still includes old instructions. Updating it will reduce avoidable customer confusion.",
      "Legacy macros are pushing inaccurate troubleshooting steps and inflating ticket volume.",
      "Old help text is still being used. It no longer matches the product and creates unnecessary confusion.",
      "Old support instructions are still live. They are wrong now and create extra support requests.",
    ),
    glossary: [
      {
        term: "Beta-era",
        meaning: "From an older testing version of the product.",
      },
    ],
    translationBrief: {
      meaning:
        "Support responses are outdated and need to be updated before a broader release.",
      keepTerms: ["support", "ticket volume"],
      avoid: ["beta-era", "macros"],
    },
    tags: ["support", "risk"],
  },
  {
    id: "client-005",
    speaker: "Maya Chen",
    speakerRole: "Product lead",
    startMs: 103000,
    endMs: 129000,
    text: "For the recap, keep the original wording visible, then show the client-safe version next to it so account teams can trust what changed and why.",
    confidence: 0.99,
    plainEnglish:
      "In the recap, keep the original wording visible and show the client-safe rewrite next to it so people can verify the change.",
    audienceVersions: audienceVersions(
      "The recap should preserve source wording and show exactly how it was reframed for the audience.",
      "Keep the original wording beside the client-safe version so account teams can see the difference clearly.",
      "Recap output should preserve transcript provenance while exposing the rewritten customer-safe variant.",
      "The recap should show both versions so new people can learn how the message changed.",
      "Show the original words and the simpler version together so people can compare them easily.",
    ),
    glossary: [
      {
        term: "Client-safe",
        meaning: "Clear wording that is accurate and appropriate for customers.",
      },
    ],
    translationBrief: {
      meaning:
        "The recap must keep the source wording visible while showing the audience-specific rewrite beside it.",
      keepTerms: ["original wording", "client-safe version"],
      avoid: ["provenance"],
    },
    tags: ["recap", "traceability"],
  },
];

const clientCallSession = buildSession({
  id: "demo-client-call",
  title: "Engineering update for a client call",
  subtitle: "Backend billing issue translated into customer-safe language for the room",
  attendees: clientCallAttendees,
  transcript: clientCallTranscript,
  overview:
    "The team aligned on how to explain a billing retry edge case without alarming the client. They kept the rollout limited through Tuesday, agreed to update support macros before expanding access, and insisted that the recap keep both the original wording and the adapted explanation visible.",
  keyPoints: [
    {
      id: "client-key-risk",
      title: "One billing edge case remains",
      body: "A reconnect inside the retry window can still create duplicate draft retry records for a short period.",
      sourceSegmentIds: ["client-001"],
      confidence: "High confidence",
    },
    {
      id: "client-key-language",
      title: "The team rewrote the issue for a client audience",
      body: "They replaced internal engineering terms with a simpler explanation that preserves trust and accuracy.",
      sourceSegmentIds: ["client-002"],
      confidence: "High confidence",
    },
    {
      id: "client-key-proof",
      title: "The recap must preserve source wording",
      body: "The original explanation stays visible next to the audience-safe rewrite so the change is traceable.",
      sourceSegmentIds: ["client-005"],
      confidence: "High confidence",
    },
  ],
  decisions: [
    {
      id: "client-decision-rollout",
      title: "Keep access limited through Tuesday",
      body: "The rollout stays on design-partner accounts until the patch and support updates are complete.",
      sourceSegmentIds: ["client-003"],
      confidence: "High confidence",
      impact: "This keeps the issue contained while engineering and support finish the release blockers.",
    },
  ],
  actionItems: [
    {
      id: "client-action-patch",
      title: "Ship the retry-window patch",
      body: "Close the reconnect billing edge case before Wednesday morning.",
      sourceSegmentIds: ["client-001", "client-003"],
      confidence: "High confidence",
      owner: "Ravi Nair",
      dueDate: "Tue 10:00 AM GST",
      status: "Open",
    },
    {
      id: "client-action-support",
      title: "Replace outdated support macros",
      body: "Remove instructions that no longer match the current billing flow.",
      sourceSegmentIds: ["client-004"],
      confidence: "High confidence",
      owner: "Sofia Patel",
      dueDate: "Tue 4:00 PM GST",
      status: "Open",
    },
  ],
  risks: [
    {
      id: "client-risk-language",
      title: "Technical wording could sound worse than the real issue",
      body: "Using phrases like 'phantom retries' on a client call can be misheard as duplicate charges.",
      sourceSegmentIds: ["client-001", "client-002"],
      confidence: "High confidence",
      severity: "High",
    },
  ],
  followUps: [
    {
      id: "client-followup-recap",
      title: "Keep original and adapted wording side by side in the recap",
      body: "Account teams should be able to verify exactly how the explanation changed before sharing it onward.",
      sourceSegmentIds: ["client-005"],
      confidence: "High confidence",
      owner: "Maya Chen",
    },
  ],
  audienceRecaps: {
    executive:
      "There is one contained billing risk during fast reconnects. The team is holding rollout through Tuesday, patching the issue, updating support guidance, and using traceable client-safe messaging.",
    client:
      "There is one temporary backend billing issue that can show duplicate draft notices during a fast reconnect. Final billing stays correct, and the team is patching the issue before the broader release.",
    engineer:
      "Webhook dedupe is fixed, but billing still emits phantom retries when reconnect happens inside the ninety-second backoff window. Rollout remains limited until the patch and macro cleanup land.",
    newHire:
      "The team is preparing for a client conversation. They are turning technical billing language into something safer and easier to understand, while keeping the rollout limited until the fix is ready.",
    nonNative:
      "There is one billing issue during fast reconnects. The team is fixing it, keeping the rollout small, and using simpler client wording in the recap.",
  },
});

const onboardingAttendees: SessionAttendee[] = [
  { name: "Nadia Rahman", role: "Product manager" },
  { name: "Jon Park", role: "Design lead" },
  { name: "Riya Desai", role: "Solutions engineer" },
  { name: "Alex Rivera", role: "New hire, customer success" },
];

const onboardingTranscript: TranscriptSegment[] = [
  {
    id: "onboard-001",
    speaker: "Nadia Rahman",
    speakerRole: "Product manager",
    startMs: 0,
    endMs: 22000,
    text: "Common Ground keeps the live transcript visible on the left, then rewrites the same explanation for whoever is in the room without hiding the original source.",
    confidence: 0.99,
    plainEnglish:
      "Common Ground shows the original transcript and a clearer version for the selected audience at the same time.",
    audienceVersions: audienceVersions(
      "The product preserves source truth while making the explanation immediately usable for different listeners.",
      "The product shows the original explanation and a clearer version side by side so every listener can follow it.",
      "The UI keeps transcript provenance visible while rendering audience-specific rewrites in parallel.",
      "You can always see the original words and the adapted version together, so you learn both what was said and how it changed.",
      "The product shows the original words and a clearer version together.",
    ),
    glossary: [
      {
        term: "Original source",
        meaning: "The exact wording that was spoken before any rewrite happens.",
      },
    ],
    translationBrief: {
      meaning:
        "The product keeps the original wording visible while also showing an audience-specific rewrite.",
      keepTerms: ["live transcript", "original source"],
      avoid: ["provenance"],
    },
    tags: ["product", "overview"],
  },
  {
    id: "onboard-002",
    speaker: "Riya Desai",
    speakerRole: "Solutions engineer",
    startMs: 23000,
    endMs: 49000,
    text: "Audience modes are not tone presets. Executive mode compresses to outcome and risk, while new-hire mode adds context, expands shorthand, and slows the explanation down.",
    confidence: 0.98,
    plainEnglish:
      "Audience modes change the explanation itself. Executive mode gets shorter, and new-hire mode adds more background and context.",
    audienceVersions: audienceVersions(
      "Each audience mode changes the level of detail and framing, not just the style of the sentence.",
      "Audience modes are built to match what each listener needs, not just make the wording sound nicer.",
      "Modes alter information density, jargon retention, and framing rather than only changing tone.",
      "This feature is important because it explains the same idea differently for people with different context.",
      "Audience modes change detail and wording. They do not only change tone.",
    ),
    glossary: [
      {
        term: "Tone preset",
        meaning: "A simple style change that does not change the actual content.",
      },
      {
        term: "Shorthand",
        meaning: "Short internal wording that only experienced teammates understand quickly.",
      },
    ],
    translationBrief: {
      meaning:
        "Each audience mode changes the amount of detail and context, not only the sentence style.",
      keepTerms: ["executive mode", "new-hire mode"],
      avoid: ["tone preset", "compresses"],
    },
    tags: ["audience-modes", "product"],
  },
  {
    id: "onboard-003",
    speaker: "Jon Park",
    speakerRole: "Design lead",
    startMs: 50000,
    endMs: 74000,
    text: "The interface has to explain itself in one pass, so the first screen shows transcript, adaptation, and recap at once instead of making people click through setup before they understand the product.",
    confidence: 0.97,
    plainEnglish:
      "The first screen should show the transcript, the adapted explanation, and the recap together so people understand the product immediately.",
    audienceVersions: audienceVersions(
      "The product must communicate value instantly without relying on onboarding friction.",
      "The first screen should make the product clear right away instead of making users go through setup first.",
      "The IA prioritizes immediate value by colocating transcript, adaptation, and recap in the first viewport.",
      "This helps a new person understand the whole workflow at a glance.",
      "Show the main parts on the first screen so people understand the product quickly.",
    ),
    glossary: [
      {
        term: "IA",
        meaning: "Information architecture, or how the interface is organized.",
      },
    ],
    translationBrief: {
      meaning:
        "The first screen should explain the product immediately by showing the core workflow together.",
      keepTerms: ["transcript", "adaptation", "recap"],
      avoid: ["IA", "one pass"],
    },
    tags: ["design", "demo"],
  },
  {
    id: "onboard-004",
    speaker: "Nadia Rahman",
    speakerRole: "Product manager",
    startMs: 75000,
    endMs: 100000,
    text: "Decision: every onboarding demo should start with the sample scenario, then switch one tab to show how the same message changes for executives, clients, engineers, and new hires.",
    confidence: 0.99,
    plainEnglish:
      "Decision: start every onboarding demo with the sample scenario and switch tabs to show how one message changes for different audiences.",
    audienceVersions: audienceVersions(
      "Decision: the demo flow should reveal differentiation immediately by switching audience tabs on the same message.",
      "We should begin with the sample scenario and then show how one message changes for each audience.",
      "Demo flow standardizes on scenario-first, then audience-tab switching to showcase output differences on the same source text.",
      "This gives new teammates a repeatable way to explain the product clearly.",
      "Start with the sample scenario, then change the audience tab to show the different versions.",
    ),
    glossary: [
      {
        term: "Scenario-first",
        meaning: "Start with a ready-made example instead of asking the user to set everything up first.",
      },
    ],
    translationBrief: {
      meaning:
        "The standard demo should begin with a sample scenario and then show audience switching on the same message.",
      keepTerms: ["sample scenario", "audience tabs"],
      avoid: ["scenario-first", "standardizes"],
    },
    tags: ["decision", "onboarding"],
  },
  {
    id: "onboard-005",
    speaker: "Alex Rivera",
    speakerRole: "New hire, customer success",
    startMs: 101000,
    endMs: 126000,
    text: "That side-by-side view helps because I can see the exact sentence, the simpler explanation, and the recap without guessing what the AI changed on my behalf.",
    confidence: 0.98,
    plainEnglish:
      "The side-by-side view is useful because it shows the original sentence, the simpler rewrite, and the recap together.",
    audienceVersions: audienceVersions(
      "The side-by-side model builds trust because the rewrite remains reviewable.",
      "Seeing the original sentence next to the simpler rewrite makes the product feel reliable and easy to trust.",
      "The transcript-plus-rewrite layout reduces ambiguity about what the model changed.",
      "This is useful for a new hire because it removes guesswork and teaches the product at the same time.",
      "The side-by-side view is easier to trust because you can compare both versions.",
    ),
    glossary: [
      {
        term: "Side-by-side view",
        meaning: "A layout that shows the original wording and the adapted wording next to each other.",
      },
    ],
    translationBrief: {
      meaning:
        "The side-by-side view makes the rewrite easier to trust because the original sentence stays visible.",
      keepTerms: ["side-by-side view", "original sentence"],
      avoid: ["on my behalf"],
    },
    tags: ["trust", "product"],
  },
];

const onboardingSession = buildSession({
  id: "demo-new-hire-onboarding",
  title: "Product explanation for a new hire",
  subtitle: "Internal onboarding walkthrough of how Common Ground works and why the side-by-side view matters",
  attendees: onboardingAttendees,
  transcript: onboardingTranscript,
  overview:
    "The team aligned on how to explain Common Ground to new teammates. They emphasized that the product keeps the original transcript visible, changes the explanation based on audience mode, and should demo its value on the first screen without setup friction.",
  keyPoints: [
    {
      id: "onboard-key-truth",
      title: "The original wording always stays visible",
      body: "The transcript remains on screen so every adapted explanation can be reviewed against what was actually said.",
      sourceSegmentIds: ["onboard-001", "onboard-005"],
      confidence: "High confidence",
    },
    {
      id: "onboard-key-modes",
      title: "Audience modes change content, not just tone",
      body: "Executive and new-hire modes intentionally change detail, framing, and context.",
      sourceSegmentIds: ["onboard-002"],
      confidence: "High confidence",
    },
    {
      id: "onboard-key-demo",
      title: "The first screen must explain the product",
      body: "Transcript, adaptation, and recap should be visible together before any setup wall appears.",
      sourceSegmentIds: ["onboard-003", "onboard-004"],
      confidence: "High confidence",
    },
  ],
  decisions: [
    {
      id: "onboard-decision-demo",
      title: "Start onboarding demos with the sample scenario",
      body: "Every walkthrough should begin with a ready-made scenario and then show the audience tab switch on the same message.",
      sourceSegmentIds: ["onboard-004"],
      confidence: "High confidence",
      impact: "New teammates see the differentiator quickly without needing setup or product context first.",
    },
  ],
  actionItems: [
    {
      id: "onboard-action-script",
      title: "Document the standard onboarding demo script",
      body: "Make the scenario-first, tab-switch walkthrough the default way to explain the product internally.",
      sourceSegmentIds: ["onboard-004"],
      confidence: "High confidence",
      owner: "Nadia Rahman",
      dueDate: "Wed 11:00 AM GST",
      status: "Planned",
    },
  ],
  risks: [
    {
      id: "onboard-risk-setup",
      title: "Setup friction can hide the product value",
      body: "If the first screen does not show transcript, adaptation, and recap together, new users may miss what makes the product different.",
      sourceSegmentIds: ["onboard-003"],
      confidence: "High confidence",
      severity: "Medium",
    },
  ],
  followUps: [
    {
      id: "onboard-followup-proof",
      title: "Keep reinforcing the side-by-side proof model",
      body: "Use examples that show the original wording and the adapted explanation together in every onboarding flow.",
      sourceSegmentIds: ["onboard-005"],
      confidence: "High confidence",
      owner: "Jon Park",
    },
  ],
  audienceRecaps: {
    executive:
      "Common Ground's core value is immediate comprehension without losing source truth. Onboarding should show the transcript, rewrite, and recap together so differentiation lands in seconds.",
    client:
      "The product listens to a meeting, shows the original wording, and rewrites the explanation for whoever is listening. That makes handoffs and client conversations clearer without hiding what was actually said.",
    engineer:
      "The product keeps transcript provenance visible while applying audience-specific rewrites with different information density and framing. The preferred demo flow is scenario-first with tab switching on a shared source message.",
    newHire:
      "Common Ground helps teams explain the same idea to different listeners without losing the original meaning. You can always compare the exact sentence with the adapted version and the recap.",
    nonNative:
      "The product shows the original words and a clearer version together. Different audience modes change detail and context so the message is easier to understand.",
  },
});

const standupAttendees: SessionAttendee[] = [
  { name: "Samir Khan", role: "Platform lead" },
  { name: "Elena Costa", role: "Infra engineer" },
  { name: "Marco Silva", role: "QA lead" },
];

const standupTranscript: TranscriptSegment[] = [
  {
    id: "status-001",
    speaker: "Samir Khan",
    speakerRole: "Platform lead",
    startMs: 0,
    endMs: 22000,
    text: "The ingestion worker caught up overnight, but the EU queue still spikes when the OCR bundle warms cold containers after a quiet period.",
    confidence: 0.97,
    plainEnglish:
      "The backlog is cleared, but the Europe queue still gets slower when the OCR service starts again after being idle.",
    audienceVersions: audienceVersions(
      "The backlog is under control, but one regional performance spike still needs attention after idle periods.",
      "The system recovered overnight, but there is still one regional slowdown when a service starts again after being idle.",
      "Ingestion is caught up, but EU queue latency still spikes while the OCR bundle warms cold containers after idle.",
      "The main queue is healthy again, but one Europe-specific startup slowdown still remains.",
      "The backlog is gone, but the Europe queue still gets slower when the OCR service starts after being idle.",
    ),
    glossary: [
      {
        term: "Cold containers",
        meaning: "Service instances that were not running and need time to start again.",
      },
      {
        term: "OCR bundle",
        meaning: "The part of the system that reads text from images or documents.",
      },
    ],
    translationBrief: {
      meaning:
        "The backlog is cleared, but a regional startup slowdown still causes queue spikes after idle periods.",
      keepTerms: ["EU queue", "OCR"],
      avoid: ["cold containers", "bundle warms"],
    },
    tags: ["latency", "queue", "infra"],
  },
  {
    id: "status-002",
    speaker: "Elena Costa",
    speakerRole: "Infra engineer",
    startMs: 23000,
    endMs: 49000,
    text: "I added a pre-warm job every fifteen minutes, but we should keep the rollout capped at fifty percent until the alert noise drops below five pages in a shift.",
    confidence: 0.98,
    plainEnglish:
      "I added a job to keep the service warm, but we should keep the rollout at 50% until alert volume drops below five pages per shift.",
    audienceVersions: audienceVersions(
      "The mitigation is in place, but the rollout should stay capped until the operational risk drops further.",
      "We added a fix to reduce the slowdown, but we should keep the release limited until alert volume is lower.",
      "A fifteen-minute pre-warm is live, but rollout should remain at 50% until pages fall below five per shift.",
      "A preventive fix is already running, but the team still wants proof that alerts stay low before expanding access.",
      "A new job is running to reduce the slowdown, but keep the rollout at 50% until alerts are lower.",
    ),
    glossary: [
      {
        term: "Pre-warm job",
        meaning: "An automated task that keeps a service ready so it does not start cold.",
      },
      {
        term: "Pages",
        meaning: "Urgent alert notifications sent to the on-call team.",
      },
    ],
    translationBrief: {
      meaning:
        "A mitigation is active, but rollout should stay limited until alert volume drops.",
      keepTerms: ["fifteen minutes", "fifty percent", "five pages"],
      avoid: ["capped", "shift"],
    },
    tags: ["mitigation", "decision"],
  },
  {
    id: "status-003",
    speaker: "Marco Silva",
    speakerRole: "QA lead",
    startMs: 50000,
    endMs: 73000,
    text: "For the release note, please say 'documents may process a little slower after long idle periods in Europe' instead of describing container warm-up behavior.",
    confidence: 0.99,
    plainEnglish:
      "In the release note, say documents may process a little slower in Europe after long idle periods instead of using internal infrastructure language.",
    audienceVersions: audienceVersions(
      "External wording should describe user impact, not internal infrastructure details.",
      "Say documents may be a little slower in Europe after quiet periods instead of using technical terms.",
      "Release notes should map infra behavior to user-visible latency, not mention container warm-up.",
      "This is the team translating technical cause into a simpler customer-facing explanation.",
      "Use simple release note wording about slower document processing in Europe after quiet periods.",
    ),
    glossary: [
      {
        term: "Container warm-up",
        meaning: "The time a service needs to start before it can process requests at full speed.",
      },
    ],
    translationBrief: {
      meaning:
        "Release notes should explain the user impact in simple terms rather than describing the infrastructure behavior.",
      keepTerms: ["documents", "Europe", "slower"],
      avoid: ["container warm-up"],
    },
    tags: ["release-note", "communication"],
  },
  {
    id: "status-004",
    speaker: "Samir Khan",
    speakerRole: "Platform lead",
    startMs: 74000,
    endMs: 98000,
    text: "Decision: stay at fifty percent traffic today, review the alert count at 4:00 PM GST, and only open full traffic if the queue remains flat.",
    confidence: 0.99,
    plainEnglish:
      "Decision: stay at 50% traffic today, review alerts at 4:00 PM GST, and move to full traffic only if the queue stays stable.",
    audienceVersions: audienceVersions(
      "Decision: keep today's rollout controlled and move to full traffic only if stability holds through the afternoon review.",
      "We are keeping traffic limited today and will expand only if the queue stays stable at the afternoon check-in.",
      "Stay at 50% traffic, review at 4:00 PM GST, and only open full traffic if queue depth stays flat.",
      "The team is using a checkpoint before widening traffic so they can confirm the mitigation is working.",
      "Keep traffic at 50% today. Check alerts at 4:00 PM GST. Open full traffic only if the queue stays stable.",
    ),
    glossary: [
      {
        term: "Traffic",
        meaning: "The share of live usage currently being sent to the system.",
      },
    ],
    translationBrief: {
      meaning:
        "The rollout remains limited until the team confirms queue stability during the afternoon review.",
      keepTerms: ["50%", "4:00 PM GST", "full traffic"],
      avoid: ["flat"],
    },
    tags: ["decision", "rollout"],
  },
  {
    id: "status-005",
    speaker: "Elena Costa",
    speakerRole: "Infra engineer",
    startMs: 99000,
    endMs: 123000,
    text: "Action item: I will post a simpler status line in the incident room after lunch so support and regional ops are not translating platform shorthand for everyone else.",
    confidence: 0.98,
    plainEnglish:
      "Action item: I will post a simpler status update after lunch so support and regional operations do not have to translate platform shorthand.",
    audienceVersions: audienceVersions(
      "Action: publish a clearer status update so downstream teams can act without translation overhead.",
      "I will send a simpler update after lunch so support and regional teams do not need to decode platform language.",
      "I will replace platform shorthand with a plain-language incident-room update after lunch.",
      "This keeps the whole team aligned because support and ops get a version that is easier to understand quickly.",
      "I will post a simpler update after lunch so support and ops can understand it easily.",
    ),
    glossary: [
      {
        term: "Incident room",
        meaning: "The shared channel where the team coordinates during an active issue.",
      },
      {
        term: "Platform shorthand",
        meaning: "Short internal technical wording that other teams may not understand immediately.",
      },
    ],
    translationBrief: {
      meaning:
        "A simpler update will be posted so support and regional operations can follow the status without translating technical shorthand.",
      keepTerms: ["after lunch", "support", "regional ops"],
      avoid: ["incident room", "platform shorthand"],
    },
    tags: ["action", "status"],
  },
];

const standupSession = buildSession({
  id: "demo-non-native-status",
  title: "Fast technical status update for a non-native speaker",
  subtitle: "Ops standup about queue latency, rollout guardrails, and clearer release-note wording",
  attendees: standupAttendees,
  transcript: standupTranscript,
  overview:
    "The platform team cleared the ingestion backlog, but one Europe-specific startup slowdown still causes queue spikes after idle periods. A pre-warm mitigation is already live, the rollout stays capped at 50% until alert volume drops, and the team is simplifying both the release note and the internal status update for broader audiences.",
  keyPoints: [
    {
      id: "status-key-recovery",
      title: "The backlog is cleared, but one regional slowdown remains",
      body: "The issue now is a startup latency spike in the EU queue after quiet periods, not a growing backlog.",
      sourceSegmentIds: ["status-001"],
      confidence: "High confidence",
    },
    {
      id: "status-key-mitigation",
      title: "A mitigation is already running",
      body: "A pre-warm job is active, but the team still wants alert volume to drop before expanding traffic.",
      sourceSegmentIds: ["status-002"],
      confidence: "High confidence",
    },
    {
      id: "status-key-language",
      title: "The team is simplifying both external and internal updates",
      body: "Release notes and incident updates should describe user impact instead of making other teams translate platform shorthand.",
      sourceSegmentIds: ["status-003", "status-005"],
      confidence: "High confidence",
    },
  ],
  decisions: [
    {
      id: "status-decision-cap",
      title: "Stay at 50% traffic until the afternoon review",
      body: "The team will keep traffic limited today and expand only if the queue remains stable at 4:00 PM GST.",
      sourceSegmentIds: ["status-002", "status-004"],
      confidence: "High confidence",
      impact: "This reduces operational risk while the mitigation proves itself under live load.",
    },
  ],
  actionItems: [
    {
      id: "status-action-update",
      title: "Post a simpler incident-room update",
      body: "Share a plain-language status line for support and regional operations after lunch.",
      sourceSegmentIds: ["status-005"],
      confidence: "High confidence",
      owner: "Elena Costa",
      dueDate: "Today after lunch",
      status: "Open",
    },
  ],
  risks: [
    {
      id: "status-risk-eu",
      title: "EU queue still spikes after idle periods",
      body: "Even with the mitigation, Europe still sees a startup slowdown when the OCR service has been quiet.",
      sourceSegmentIds: ["status-001", "status-002"],
      confidence: "High confidence",
      severity: "High",
    },
  ],
  followUps: [
    {
      id: "status-followup-review",
      title: "Review queue stability and alert count at 4:00 PM GST",
      body: "Use the afternoon checkpoint to decide whether the rollout can move from 50% to full traffic.",
      sourceSegmentIds: ["status-004"],
      confidence: "High confidence",
      owner: "Samir Khan",
    },
  ],
  audienceRecaps: {
    executive:
      "The backlog is cleared, but one regional performance spike remains after idle periods. A mitigation is live, the rollout stays capped at 50% today, and the afternoon review decides whether the risk is low enough to expand.",
    client:
      "The team resolved the main backlog issue overnight. One Europe-specific slowdown can still appear after long quiet periods, so rollout stays limited while the team confirms stability.",
    engineer:
      "Ingestion is caught up, but EU queue latency still spikes while the OCR bundle warms cold containers after idle. A fifteen-minute pre-warm is live and traffic remains capped at 50% pending the 4:00 PM GST review.",
    newHire:
      "The system is in better shape, but there is still one Europe-specific slowdown after the service sits idle. The team is keeping traffic limited until they confirm the fix is working.",
    nonNative:
      "The backlog is fixed. One Europe slowdown still remains after idle time. The team added a mitigation and is keeping traffic at 50% until the afternoon review.",
  },
});

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "client-call",
    label: "Client call",
    title: "Engineering update for a client",
    description:
      "Show how a technical billing issue becomes client-safe without losing the original meaning.",
    recommendedAudience: "client",
    session: clientCallSession,
  },
  {
    id: "new-hire",
    label: "Onboarding",
    title: "Product explanation for a new hire",
    description:
      "Show how the product can explain itself clearly to someone new to the team.",
    recommendedAudience: "newHire",
    session: onboardingSession,
  },
  {
    id: "non-native",
    label: "Status update",
    title: "Fast technical status update",
    description:
      "Show a quick infrastructure update rewritten into clearer language for a non-native speaker.",
    recommendedAudience: "nonNative",
    session: standupSession,
  },
];

export const DEMO_SESSION = DEMO_SCENARIOS[0].session;

export function getDemoScenario(scenarioId: string) {
  return DEMO_SCENARIOS.find((scenario) => scenario.id === scenarioId) ?? DEMO_SCENARIOS[0];
}
