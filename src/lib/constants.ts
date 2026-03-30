import {
  type AudienceOption,
  type InputLanguageCode,
  type LanguageOption,
  type OutputLanguageCode,
  type SessionPreferences,
} from "@/lib/types";

export const AUDIENCE_OPTIONS: AudienceOption[] = [
  {
    id: "executive",
    label: "Executive",
    shortLabel: "Exec",
    description: "Focus on outcome, risk, and next steps.",
  },
  {
    id: "client",
    label: "Client",
    shortLabel: "Client",
    description: "Reduce internal jargon and make value explicit.",
  },
  {
    id: "engineer",
    label: "Engineer",
    shortLabel: "Eng",
    description: "Keep technical detail, dependencies, and precision.",
  },
  {
    id: "newHire",
    label: "New hire",
    shortLabel: "New hire",
    description: "Add context so the conversation makes sense quickly.",
  },
  {
    id: "nonNative",
    label: "Non-native speaker",
    shortLabel: "Clear",
    description: "Use simpler syntax and avoid idioms.",
  },
];

export const INPUT_LANGUAGE_OPTIONS: LanguageOption<InputLanguageCode>[] = [
  {
    code: "en-US",
    label: "English (US)",
    helper: "Best for the included demo and sample live mode.",
  },
  {
    code: "ar-AE",
    label: "Arabic",
    helper: "Good for bilingual meeting capture in the Gulf region.",
  },
  {
    code: "es-ES",
    label: "Spanish",
    helper: "Structured output still stays traceable to the transcript.",
  },
  {
    code: "fr-FR",
    label: "French",
    helper: "Use when reviewing multilingual customer calls.",
  },
];

export const OUTPUT_LANGUAGE_OPTIONS: LanguageOption<OutputLanguageCode>[] = [
  {
    code: "en",
    label: "English",
    helper: "Default working language for recap and export.",
  },
  {
    code: "ar",
    label: "Arabic",
    helper: "Useful for handoff and stakeholder follow-up.",
  },
  {
    code: "es",
    label: "Spanish",
    helper: "Useful for regional customer-facing summaries.",
  },
  {
    code: "fr",
    label: "French",
    helper: "Useful for multinational teams and partner updates.",
  },
];

export const DEFAULT_PREFERENCES: SessionPreferences = {
  defaultAudience: "client",
  inputLanguage: "en-US",
  outputLanguage: "en",
  motionPreference: "system",
};

export const APP_NAV_ITEMS = [
  { href: "/app", label: "Home" },
  { href: "/app/live", label: "Live" },
  { href: "/app/demo", label: "Demo" },
  { href: "/app/upload", label: "Upload" },
  { href: "/app/history", label: "History" },
  { href: "/app/settings", label: "Settings" },
] as const;

export const SESSION_STORAGE_KEY = "common-ground.sessions.v1";
export const PREFERENCES_STORAGE_KEY = "common-ground.preferences.v1";

export const PROCESSING_STAGE_LABELS = {
  idle: "Ready",
  uploading: "Uploading",
  transcribing: "Transcribing",
  clarifying: "Adapting for the room",
  extracting: "Building recap",
  complete: "Complete",
  error: "Something went wrong",
} as const;

export const EXPORT_LABELS = {
  slack: "Copy for Slack",
  email: "Copy for email",
  plain: "Copy plain summary",
  markdown: "Download Markdown",
  json: "Download JSON",
} as const;

export const SESSION_KIND_LABELS = {
  demo: "Sample demo",
  live: "Live session",
  upload: "Uploaded recording",
} as const;
