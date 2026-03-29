export const audienceModes = [
  "executive",
  "client",
  "engineer",
  "newHire",
  "nonNative",
] as const;

export type AudienceMode = (typeof audienceModes)[number];

export const sessionKinds = ["demo", "live", "upload"] as const;

export type SessionKind = (typeof sessionKinds)[number];

export const inputLanguages = ["en-US", "ar-AE", "es-ES", "fr-FR"] as const;

export type InputLanguageCode = (typeof inputLanguages)[number];

export const outputLanguages = ["en", "ar", "es", "fr"] as const;

export type OutputLanguageCode = (typeof outputLanguages)[number];

export type SessionStatus = "ready" | "live" | "processing" | "ended" | "failed";

export type ConfidenceLabel = "High confidence" | "Medium confidence" | "Review";

export type ActionItemStatus = "Open" | "Planned" | "Blocked";

export type SeverityLabel = "Low" | "Medium" | "High";

export type PermissionState =
  | "idle"
  | "prompting"
  | "granted"
  | "denied"
  | "unsupported"
  | "no-device";

export type ProcessingStage =
  | "idle"
  | "uploading"
  | "transcribing"
  | "clarifying"
  | "extracting"
  | "complete"
  | "error";

export type ExportFormat = "slack" | "email" | "plain" | "markdown" | "json";

export interface LanguageOption<TCode extends string> {
  code: TCode;
  label: string;
  helper: string;
}

export interface AudienceOption {
  id: AudienceMode;
  label: string;
  shortLabel: string;
  description: string;
}

export interface GlossaryTerm {
  term: string;
  meaning: string;
  whyItMatters?: string;
}

export interface TranslationBrief {
  meaning: string;
  keepTerms: string[];
  avoid: string[];
  localizedDrafts?: Partial<Record<OutputLanguageCode, string>>;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  speakerRole: string;
  startMs: number;
  endMs: number;
  text: string;
  confidence: number;
  plainEnglish: string;
  audienceVersions: Record<AudienceMode, string>;
  glossary: GlossaryTerm[];
  translationBrief: TranslationBrief;
  tags: string[];
}

export interface TraceableInsight {
  id: string;
  title: string;
  body: string;
  sourceSegmentIds: string[];
  confidence: ConfidenceLabel;
}

export interface DecisionItem extends TraceableInsight {
  impact: string;
}

export interface ActionItem extends TraceableInsight {
  owner: string;
  dueDate: string;
  status: ActionItemStatus;
}

export interface RiskItem extends TraceableInsight {
  severity: SeverityLabel;
}

export interface FollowUpItem extends TraceableInsight {
  owner: string;
}

export interface SessionAttendee {
  name: string;
  role: string;
}

export interface SessionRecord {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  durationMs: number;
  kind: SessionKind;
  status: SessionStatus;
  inputLanguage: InputLanguageCode;
  outputLanguage: OutputLanguageCode;
  sourceFileName?: string;
  sourceDurationLabel?: string;
  attendees: SessionAttendee[];
  transcript: TranscriptSegment[];
  overview: string;
  keyPoints: TraceableInsight[];
  decisions: DecisionItem[];
  actionItems: ActionItem[];
  risks: RiskItem[];
  followUps: FollowUpItem[];
  audienceRecaps: Record<AudienceMode, string>;
}

export interface SessionPreferences {
  defaultAudience: AudienceMode;
  inputLanguage: InputLanguageCode;
  outputLanguage: OutputLanguageCode;
  motionPreference: "system" | "reduced" | "full";
}
