import type {
  AudienceMode,
  ConfidenceLabel,
  InputLanguageCode,
  OutputLanguageCode,
  RiskItem,
  SessionKind,
  SessionRecord,
  TranscriptSegment,
} from "@/lib/types";

interface SegmentSeed {
  id: string;
  text: string;
  speaker: string;
  speakerRole: string;
  startMs: number;
  endMs: number;
  confidence?: number;
}

const glossaryLibrary = [
  {
    pattern: /\bwebhook\b/i,
    term: "Webhook",
    meaning: "An automatic message another system sends when something changes.",
  },
  {
    pattern: /\bbackoff\b/i,
    term: "Backoff window",
    meaning: "A short waiting period before the system retries.",
  },
  {
    pattern: /\bqueue\b/i,
    term: "Queue",
    meaning: "The list of work the system is still processing.",
  },
  {
    pattern: /\brollout\b|\btraffic\b/i,
    term: "Rollout",
    meaning: "How much live usage is currently seeing the change.",
  },
  {
    pattern: /\bschema\b/i,
    term: "Schema",
    meaning: "The structure or format of incoming data.",
  },
  {
    pattern: /\bapi\b/i,
    term: "API",
    meaning: "The interface one piece of software uses to talk to another.",
  },
  {
    pattern: /\bocr\b/i,
    term: "OCR",
    meaning: "Software that reads text from images or documents.",
  },
];

const simplifications: Array<[RegExp, string]> = [
  [/\bdedup(?:ing|e)?\b/gi, "removing duplicates"],
  [/\bphantom retries?\b/gi, "extra retry records"],
  [/\bbackoff window\b/gi, "retry wait period"],
  [/\bfan-out\b/gi, "broadcast step"],
  [/\bpre-warm\b/gi, "keep ready"],
  [/\bcold containers?\b/gi, "services restarting after idle time"],
  [/\binstrumentation gating\b/gi, "release checks"],
  [/\bprogressive activation\b/gi, "staged rollout"],
  [/\bshorthand\b/gi, "internal short wording"],
  [/\bmacros\b/gi, "saved support replies"],
];

function toSentenceCase(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return trimmed;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function simplifyText(text: string) {
  let next = ` ${text.trim()} `;

  for (const [pattern, replacement] of simplifications) {
    next = next.replace(pattern, replacement);
  }

  return next.replace(/\s+/g, " ").trim();
}

function splitClauses(text: string) {
  return text
    .split(/[.;]|, and |, but /i)
    .map((part) => toSentenceCase(part.trim()))
    .filter(Boolean);
}

function extractGlossary(text: string) {
  return glossaryLibrary
    .filter((item) => item.pattern.test(text))
    .map(({ term, meaning }) => ({ term, meaning }));
}

function extractTags(text: string) {
  const lower = text.toLowerCase();
  const tags = new Set<string>();

  if (/\bdecision\b|\bwe keep\b|\bwe will\b/.test(lower)) {
    tags.add("decision");
  }
  if (/\baction item\b|\bi will\b|\bowner\b|\bfollow up\b/.test(lower)) {
    tags.add("action");
  }
  if (/\brisk\b|\bissue\b|\bblocker\b|\bslow\b|\bdelay\b|\bstill\b/.test(lower)) {
    tags.add("risk");
  }
  if (/\bclient\b|\bcustomer\b/.test(lower)) {
    tags.add("client");
  }
  if (/\brollout\b|\btraffic\b/.test(lower)) {
    tags.add("rollout");
  }
  if (/\bqueue\b|\bbilling\b|\bapi\b|\bwebhook\b|\bocr\b/.test(lower)) {
    tags.add("technical");
  }

  if (!tags.size) {
    tags.add("update");
  }

  return [...tags].slice(0, 3);
}

export function adaptText(text: string, audience: AudienceMode) {
  const simple = simplifyText(text);
  const clauses = splitClauses(simple);

  if (audience === "engineer") {
    return toSentenceCase(text.trim());
  }

  if (audience === "executive") {
    return toSentenceCase(
      clauses.slice(0, 2).join(". ") ||
        "Key point: the team has a clear status update and next step.",
    );
  }

  if (audience === "client") {
    return toSentenceCase(
      clauses
        .map((clause) =>
          clause
            .replace(/\binternal\b/gi, "")
            .replace(/\btechnical\b/gi, "")
            .replace(/\s+/g, " ")
            .trim(),
        )
        .join(". "),
    );
  }

  if (audience === "newHire") {
    const context =
      clauses.length > 1
        ? `${clauses[0]}. This means ${clauses[1].charAt(0).toLowerCase()}${clauses[1].slice(1)}`
        : `${clauses[0] ?? simple}. This is the main point the team is discussing.`;

    return toSentenceCase(context);
  }

  return toSentenceCase(
    clauses.map((clause) => clause.replace(/:/g, ".")).join(". "),
  );
}

function summarizeMeaning(text: string) {
  return adaptText(text, "nonNative");
}

export function buildGeneratedSegment(seed: SegmentSeed): TranscriptSegment {
  const glossary = extractGlossary(seed.text);
  const plainEnglish = adaptText(seed.text, "nonNative");

  return {
    id: seed.id,
    speaker: seed.speaker,
    speakerRole: seed.speakerRole,
    startMs: seed.startMs,
    endMs: seed.endMs,
    text: seed.text.trim(),
    confidence: seed.confidence ?? 0.9,
    plainEnglish,
    audienceVersions: {
      executive: adaptText(seed.text, "executive"),
      client: adaptText(seed.text, "client"),
      engineer: adaptText(seed.text, "engineer"),
      newHire: adaptText(seed.text, "newHire"),
      nonNative: plainEnglish,
    },
    glossary,
    translationBrief: {
      meaning: summarizeMeaning(seed.text),
      keepTerms: glossary.map((item) => item.term).slice(0, 3),
      avoid: ["internal shorthand", "unexplained acronyms"],
    },
    tags: extractTags(seed.text),
  };
}

function createInsightTitle(prefix: string, text: string) {
  const simplified = adaptText(text, "executive");
  const firstClause = splitClauses(simplified)[0] ?? simplified;
  return `${prefix}: ${firstClause.replace(/\.$/, "")}`;
}

function toConfidence(value: number): ConfidenceLabel {
  if (value >= 0.95) {
    return "High confidence";
  }

  if (value >= 0.8) {
    return "Medium confidence";
  }

  return "Review";
}

function detectDecision(segment: TranscriptSegment) {
  return /\bdecision\b|\bwe keep\b|\bwe will\b|\bonly if\b/i.test(segment.text);
}

function detectAction(segment: TranscriptSegment) {
  return /\baction item\b|\bi will\b|\bnext step\b|\bfollow up\b/i.test(segment.text);
}

function detectRisk(segment: TranscriptSegment) {
  return /\brisk\b|\bissue\b|\bblocker\b|\bslow\b|\bdelay\b|\bstill\b/i.test(segment.text);
}

function buildAudienceRecap(segments: TranscriptSegment[], audience: AudienceMode) {
  const excerpt = segments
    .slice(0, 3)
    .map((segment) => segment.audienceVersions[audience])
    .join(" ");

  return excerpt || "Once transcript lines arrive, Common Ground will draft a recap for this audience.";
}

export function buildFallbackSession(options: {
  id: string;
  title: string;
  subtitle: string;
  kind: SessionRecord["kind"];
  inputLanguage: SessionRecord["inputLanguage"];
  outputLanguage: SessionRecord["outputLanguage"];
  transcript: TranscriptSegment[];
}): SessionRecord {
  const now = new Date().toISOString();
  const transcript = options.transcript;
  const firstSegments = transcript.slice(0, 3);
  const overview = firstSegments.length
    ? firstSegments.map((segment) => segment.plainEnglish).join(" ")
    : "Common Ground is listening for enough transcript evidence to draft a grounded recap.";

  const decisions = transcript.filter(detectDecision).map((segment) => ({
    id: `decision-${segment.id}`,
    title: createInsightTitle("Decision", segment.text),
    body: segment.plainEnglish,
    sourceSegmentIds: [segment.id],
    confidence: toConfidence(segment.confidence),
    impact: "Keeps the next step explicit for the people who need to act on it.",
  }));

  const actionItems = transcript.filter(detectAction).map((segment) => ({
    id: `action-${segment.id}`,
    title: createInsightTitle("Action", segment.text),
    body: segment.plainEnglish,
    sourceSegmentIds: [segment.id],
    confidence: toConfidence(segment.confidence),
    owner: segment.speaker,
    dueDate: "Needs follow-up",
    status: "Open" as const,
  }));

  const risks: RiskItem[] = transcript.filter(detectRisk).map((segment) => ({
    id: `risk-${segment.id}`,
    title: createInsightTitle("Risk", segment.text),
    body: segment.plainEnglish,
    sourceSegmentIds: [segment.id],
    confidence: toConfidence(segment.confidence),
    severity: "Medium",
  }));

  const keyPoints = firstSegments.map((segment) => ({
    id: `key-${segment.id}`,
    title: createInsightTitle("Key point", segment.text),
    body: segment.plainEnglish,
    sourceSegmentIds: [segment.id],
    confidence: toConfidence(segment.confidence),
  }));

  const followUps = actionItems.slice(0, 2).map((item) => ({
    id: `followup-${item.id}`,
    title: item.title.replace(/^Action:/, "Follow-up:"),
    body: item.body,
    sourceSegmentIds: item.sourceSegmentIds,
    confidence: item.confidence,
    owner: item.owner,
  }));

  return {
    id: options.id,
    title: options.title,
    subtitle: options.subtitle,
    createdAt: now,
    updatedAt: now,
    durationMs: transcript.at(-1)?.endMs ?? 0,
    kind: options.kind,
    status: "ready",
    inputLanguage: options.inputLanguage,
    outputLanguage: options.outputLanguage,
    attendees: [],
    transcript,
    overview,
    keyPoints,
    decisions,
    actionItems,
    risks,
    followUps,
    audienceRecaps: {
      executive: buildAudienceRecap(transcript, "executive"),
      client: buildAudienceRecap(transcript, "client"),
      engineer: buildAudienceRecap(transcript, "engineer"),
      newHire: buildAudienceRecap(transcript, "newHire"),
      nonNative: buildAudienceRecap(transcript, "nonNative"),
    },
  };
}

function splitSourceIntoChunks(sourceText: string) {
  const normalized = sourceText.replace(/\r/g, "").trim();

  if (!normalized) {
    return [];
  }

  return normalized
    .split(/\n{2,}/)
    .flatMap((paragraph) => {
      const trimmedParagraph = paragraph.trim();

      if (!trimmedParagraph) {
        return [];
      }

      const explicitLines = trimmedParagraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (explicitLines.length > 1) {
        return explicitLines;
      }

      if (trimmedParagraph.length < 220) {
        return [trimmedParagraph];
      }

      return trimmedParagraph
        .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);
    });
}

function extractSpeakerFromChunk(chunk: string, index: number) {
  const match = chunk.match(/^([A-Za-z][A-Za-z .'-]{1,40}):\s+(.+)$/);

  if (match) {
    return {
      speaker: match[1].trim(),
      text: match[2].trim(),
    };
  }

  return {
    speaker: index === 0 ? "Speaker" : `Speaker ${index + 1}`,
    text: chunk.trim(),
  };
}

export function buildSourceTextFromSession(session: SessionRecord) {
  return session.transcript
    .map((segment) => `${segment.speaker}: ${segment.text}`)
    .join("\n\n");
}

export function buildAdaptedNarrative(
  session: SessionRecord,
  audience: AudienceMode,
) {
  return session.transcript
    .map((segment) => segment.audienceVersions[audience])
    .join("\n\n");
}

export function buildFallbackSessionFromText(options: {
  id: string;
  title: string;
  subtitle: string;
  kind: SessionKind;
  inputLanguage: InputLanguageCode;
  outputLanguage: OutputLanguageCode;
  sourceText: string;
}) {
  const chunks = splitSourceIntoChunks(options.sourceText);
  let currentStart = 0;

  const transcript = chunks.map((chunk, index) => {
    const { speaker, text } = extractSpeakerFromChunk(chunk, index);
    const duration = Math.max(4800, text.split(/\s+/).length * 420);

    const segment = buildGeneratedSegment({
      id: `${options.kind}-${index + 1}`,
      text,
      speaker,
      speakerRole: "Captured input",
      startMs: currentStart,
      endMs: currentStart + duration,
    });

    currentStart += duration;

    return segment;
  });

  return buildFallbackSession({
    id: options.id,
    title: options.title,
    subtitle: options.subtitle,
    kind: options.kind,
    inputLanguage: options.inputLanguage,
    outputLanguage: options.outputLanguage,
    transcript,
  });
}
