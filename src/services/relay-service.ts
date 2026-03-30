import { DEMO_SESSION } from "@/lib/demo-data";
import { providerStatus } from "@/lib/env";
import type {
  InputLanguageCode,
  OutputLanguageCode,
  SessionKind,
  SessionRecord,
} from "@/lib/types";

interface SessionFactoryOptions {
  kind: SessionKind;
  inputLanguage: InputLanguageCode;
  outputLanguage: OutputLanguageCode;
  title?: string;
  subtitle?: string;
  sourceFileName?: string;
  sourceDurationLabel?: string;
}

export function getProviderStatus() {
  return providerStatus;
}

function cloneSession() {
  return structuredClone(DEMO_SESSION);
}

export function createSessionFromDemo(options: SessionFactoryOptions): SessionRecord {
  const now = new Date().toISOString();
  const session = cloneSession();

  session.id = crypto.randomUUID();
  session.kind = options.kind;
  session.status = "ready";
  session.createdAt = now;
  session.updatedAt = now;
  session.inputLanguage = options.inputLanguage;
  session.outputLanguage = options.outputLanguage;
  session.title =
    options.title ??
    (options.kind === "upload"
      ? "Processed upload review"
      : options.kind === "live"
        ? "Live session"
        : session.title);
  session.subtitle =
    options.subtitle ??
    (options.kind === "upload"
      ? "Imported audio or video processed in demo mode"
      : options.kind === "live"
        ? "Real-time workspace using demo-safe transcript streaming"
        : session.subtitle);
  session.sourceFileName = options.sourceFileName;
  session.sourceDurationLabel = options.sourceDurationLabel;

  return session;
}
