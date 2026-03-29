"use client";

import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import {
  AudioLines,
  CheckCheck,
  CircleAlert,
  Clipboard,
  LoaderCircle,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  UploadCloud,
  WandSparkles,
} from "lucide-react";
import { toast } from "sonner";

import { AudienceSelector } from "@/components/audience-selector";
import { RelayLogo } from "@/components/relay-logo";
import { useSessions } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  buildAdaptedNarrative,
  buildFallbackSessionFromText,
  buildSourceTextFromSession,
} from "@/lib/adaptation";
import { DEMO_SCENARIOS, getDemoScenario } from "@/lib/demo-data";
import type {
  AudienceMode,
  PermissionState,
  ProcessingStage,
  SessionRecord,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type WorkspaceMode = "type" | "sample" | "speak" | "upload";

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | ((event: SpeechRecognitionErrorLike) => void);
  onresult: null | ((event: SpeechRecognitionEventLike) => void);
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

const proofItems = [
  {
    title: "Transcript",
    body: "Keep the original words visible.",
    icon: AudioLines,
  },
  {
    title: "Audience rewrite",
    body: "Switch the framing in one click.",
    icon: WandSparkles,
  },
  {
    title: "Clear recap",
    body: "Pull the summary, decision, and action.",
    icon: CheckCheck,
  },
] as const;

const useCases = [
  {
    title: "Client calls",
    body: "Turn internal language into clear customer wording.",
  },
  {
    title: "Onboarding",
    body: "Add context for someone new to the topic.",
  },
  {
    title: "Status updates",
    body: "Simplify technical updates without losing the point.",
  },
] as const;

const uploadStageProgress: Record<ProcessingStage, number> = {
  idle: 0,
  uploading: 24,
  transcribing: 52,
  clarifying: 78,
  extracting: 92,
  complete: 100,
  error: 0,
};

const uploadStageOrder: ProcessingStage[] = [
  "uploading",
  "transcribing",
  "clarifying",
  "extracting",
];

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function buildRecapSnapshot(session: SessionRecord, audience: AudienceMode) {
  return {
    summary: session.audienceRecaps[audience] || session.overview,
    decision: session.decisions[0]?.body || "No decision detected yet.",
    action: session.actionItems[0]?.body || "No action item detected yet.",
    risk: session.risks[0]?.body || "",
  };
}

function buildRecapClipboardText(session: SessionRecord, audience: AudienceMode) {
  const recap = buildRecapSnapshot(session, audience);
  const lines = [
    `Summary: ${recap.summary}`,
    `Decision: ${recap.decision}`,
    `Action: ${recap.action}`,
  ];

  if (recap.risk) {
    lines.push(`Risk: ${recap.risk}`);
  }

  return lines.join("\n");
}

async function copyTextToClipboard(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const element = document.createElement("textarea");
  element.value = value;
  element.setAttribute("readonly", "");
  element.style.position = "absolute";
  element.style.left = "-9999px";
  document.body.appendChild(element);
  element.select();
  document.execCommand("copy");
  document.body.removeChild(element);
}

export function CommonGroundProductPage({
  initialMode = "sample",
}: {
  initialMode?: WorkspaceMode;
}) {
  const initialScenario = DEMO_SCENARIOS[0];
  const initialSourceText =
    initialMode === "sample" ? buildSourceTextFromSession(initialScenario.session) : "";
  const { upsertSession } = useSessions();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const stopRequestedRef = useRef(false);
  const workspaceRef = useRef<HTMLElement | null>(null);

  const [mode, setMode] = useState<WorkspaceMode>(initialMode);
  const [sourceText, setSourceText] = useState(initialSourceText);
  const [audience, setAudience] = useState<AudienceMode>(
    initialScenario.recommendedAudience,
  );
  const [activePresetId, setActivePresetId] = useState(initialScenario.id);
  const [uploadedSession, setUploadedSession] = useState<SessionRecord | null>(null);
  const [generatedRecapKey, setGeneratedRecapKey] = useState<string | null>(null);
  const [autoGenerateRecap, setAutoGenerateRecap] = useState(initialMode === "sample");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechState, setSpeechState] = useState<PermissionState>("idle");
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStage, setUploadStage] = useState<ProcessingStage>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const deferredSourceText = useDeferredValue(sourceText);
  const activeScenario = useMemo(
    () => getDemoScenario(activePresetId),
    [activePresetId],
  );
  const presetSourceText = useMemo(
    () => buildSourceTextFromSession(activeScenario.session),
    [activeScenario.session],
  );
  const uploadSourceText = useMemo(
    () => (uploadedSession ? buildSourceTextFromSession(uploadedSession) : ""),
    [uploadedSession],
  );
  const activeModes = speechSupported
    ? (["type", "speak", "sample", "upload"] as const)
    : (["type", "sample", "upload"] as const);

  const currentSession = useMemo(() => {
    const normalizedSource = normalizeText(deferredSourceText);

    if (!normalizedSource) {
      return null;
    }

    if (
      mode === "sample" &&
      normalizeText(presetSourceText) === normalizedSource
    ) {
      return activeScenario.session;
    }

    if (
      mode === "upload" &&
      uploadedSession &&
      normalizeText(uploadSourceText) === normalizedSource
    ) {
      return uploadedSession;
    }

    return buildFallbackSessionFromText({
      id: "workspace-draft",
      title: "Workspace draft",
      subtitle: "Generated from the current Common Ground workspace input",
      kind: mode === "upload" ? "upload" : mode === "speak" ? "live" : "demo",
      inputLanguage: "en-US",
      outputLanguage: "en",
      sourceText: deferredSourceText,
    });
  }, [
    activeScenario.session,
    deferredSourceText,
    mode,
    presetSourceText,
    uploadedSession,
    uploadSourceText,
  ]);

  const adaptedOutput = useMemo(() => {
    if (!currentSession) {
      return "";
    }

    return buildAdaptedNarrative(currentSession, audience);
  }, [audience, currentSession]);

  const currentRecapKey = useMemo(
    () =>
      [
        mode,
        audience,
        normalizeText(deferredSourceText),
        activePresetId,
        uploadedSession?.id ?? "none",
      ].join("::"),
    [activePresetId, audience, deferredSourceText, mode, uploadedSession?.id],
  );

  const recapReady = Boolean(currentSession && generatedRecapKey === currentRecapKey);
  const recap =
    recapReady && currentSession
      ? buildRecapSnapshot(currentSession, audience)
      : null;

  const appendRecognizedText = useCallback((text: string) => {
    setSourceText((current) => (current.trim() ? `${current.trim()}\n\n${text}` : text));
    setMode("speak");
    setGeneratedRecapKey(null);
    setAutoGenerateRecap(false);
  }, []);

  const stopListening = useCallback(() => {
    stopRequestedRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterimText("");
  }, []);

  useEffect(() => {
    const supported = Boolean(getSpeechRecognitionConstructor());
    setSpeechSupported(supported);

    if (!supported) {
      setSpeechState("unsupported");

      if (initialMode === "speak") {
        setMode("type");
      }
    }
  }, [initialMode]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mode !== "speak") {
      stopListening();
    }
  }, [mode, stopListening]);

  useEffect(() => {
    if (autoGenerateRecap && currentSession) {
      setGeneratedRecapKey(currentRecapKey);
      setAutoGenerateRecap(false);
    }
  }, [autoGenerateRecap, currentRecapKey, currentSession]);

  const dropzone = useDropzone({
    accept: {
      "audio/*": [],
      "video/*": [],
    },
    maxFiles: 1,
    onDropAccepted: (acceptedFiles) => {
      setSelectedFile(acceptedFiles[0] ?? null);
      setUploadError(null);
      setUploadStage("idle");
    },
    onDropRejected: () => {
      setUploadError("Choose one audio or video file.");
      setUploadStage("error");
    },
  });

  async function startListening() {
    const SpeechRecognition = getSpeechRecognitionConstructor();

    if (!SpeechRecognition || !navigator.mediaDevices?.getUserMedia) {
      setSpeechState("unsupported");
      return;
    }

    stopRequestedRef.current = false;
    setSpeechState("prompting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setSpeechState("granted");
        setIsListening(true);
        setInterimText("");
      };

      recognition.onresult = (event) => {
        let nextInterim = "";

        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          const transcript = result[0]?.transcript?.trim();

          if (!transcript) {
            continue;
          }

          if (result.isFinal) {
            appendRecognizedText(transcript);
            nextInterim = "";
            continue;
          }

          nextInterim = transcript;
        }

        setInterimText(nextInterim);
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          setSpeechState("denied");
          toast.error("Microphone access was denied.");
          return;
        }

        if (event.error === "no-speech") {
          toast.message("No speech detected yet.");
          return;
        }

        setSpeechState("unsupported");
        toast.error("Live capture is unavailable in this browser.");
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setIsListening(false);
        setInterimText("");

        if (!stopRequestedRef.current && mode === "speak") {
          void startListening();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setSpeechState("denied");
        return;
      }

      setSpeechState("unsupported");
    }
  }

  function focusWorkspace(nextMode?: WorkspaceMode) {
    if (nextMode) {
      setMode(nextMode);
    }

    workspaceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function loadPreset(scenarioId: string) {
    const scenario = getDemoScenario(scenarioId);
    stopListening();

    startTransition(() => {
      setActivePresetId(scenarioId);
      setAudience(scenario.recommendedAudience);
      setMode("sample");
      setSourceText(buildSourceTextFromSession(scenario.session));
      setUploadedSession(null);
      setGeneratedRecapKey(null);
      setAutoGenerateRecap(true);
      setUploadError(null);
      setSelectedFile(null);
      setUploadStage("idle");
    });
  }

  function handleModeChange(nextMode: WorkspaceMode) {
    if (nextMode === "sample") {
      loadPreset(activePresetId);
      return;
    }

    if (nextMode === "upload") {
      stopListening();
      setMode("upload");
      setGeneratedRecapKey(null);

      if (uploadedSession) {
        setSourceText(uploadSourceText);
      }

      return;
    }

    if (nextMode === "speak") {
      setMode("speak");
      setGeneratedRecapKey(null);
      return;
    }

    stopListening();
    setMode("type");
    setGeneratedRecapKey(null);
  }

  function handleSourceChange(nextValue: string) {
    setSourceText(nextValue);
    setGeneratedRecapKey(null);
    setAutoGenerateRecap(false);

    if (mode !== "speak") {
      setMode("type");
    }
  }

  async function handleGenerateRecap() {
    if (!currentSession) {
      toast.error("Add a message first.");
      return;
    }

    setGeneratedRecapKey(currentRecapKey);
    toast.success("Recap ready.");
  }

  async function handleCopyAdaptedOutput() {
    if (!adaptedOutput) {
      toast.error("There is no adapted output to copy.");
      return;
    }

    await copyTextToClipboard(adaptedOutput);
    toast.success("Adapted output copied.");
  }

  async function handleCopyRecap() {
    if (!currentSession || !recapReady) {
      toast.error("Generate the recap first.");
      return;
    }

    await copyTextToClipboard(buildRecapClipboardText(currentSession, audience));
    toast.success("Recap copied.");
  }

  function handleReset() {
    stopListening();
    setMode("type");
    setSourceText("");
    setAudience("client");
    setUploadedSession(null);
    setGeneratedRecapKey(null);
    setAutoGenerateRecap(false);
    setSelectedFile(null);
    setUploadStage("idle");
    setUploadError(null);
  }

  async function handleProcessUpload() {
    if (!selectedFile) {
      setUploadError("Choose a file first.");
      return;
    }

    setUploadError(null);

    try {
      for (const stage of uploadStageOrder) {
        setUploadStage(stage);
        await sleep(450);
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/process-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = (await response.json()) as { session: SessionRecord };

      upsertSession(data.session);

      startTransition(() => {
        setMode("upload");
        setUploadedSession(data.session);
        setSourceText(buildSourceTextFromSession(data.session));
        setGeneratedRecapKey(null);
        setAutoGenerateRecap(true);
        setUploadStage("complete");
      });

      toast.success("Recording processed.");
    } catch {
      setUploadStage("error");
      setUploadError("Processing failed. Try another file.");
      toast.error("Processing failed.");
    }
  }

  const activePresetLabel = activeScenario.label;
  const speakingUnsupported = !speechSupported || speechState === "unsupported";

  return (
    <div className="light-canvas min-h-screen">
      <header className="sticky top-0 z-40 border-b border-[rgba(23,19,41,0.08)] bg-[rgba(248,246,240,0.94)] backdrop-blur">
        <div className="section-shell flex min-h-16 items-center justify-between gap-4 py-3">
          <RelayLogo className="gap-3" href="/" showTagline={false} />
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#workspace"
              className="text-sm font-medium text-[var(--ink-tint)] transition hover:text-[var(--ink)]"
            >
              Workspace
            </a>
            <a
              href="#proof"
              className="text-sm font-medium text-[var(--ink-tint)] transition hover:text-[var(--ink)]"
            >
              Why it works
            </a>
            <a
              href="#use-cases"
              className="text-sm font-medium text-[var(--ink-tint)] transition hover:text-[var(--ink)]"
            >
              Use cases
            </a>
          </nav>
          <Button
            size="sm"
            onClick={() => focusWorkspace(speechSupported ? "speak" : "type")}
          >
            {speechSupported ? "Start live" : "Try it now"}
          </Button>
        </div>
      </header>

      <main className="section-shell py-5 sm:py-6 lg:py-8">
        <section
          id="workspace"
          ref={workspaceRef}
          className="surface overflow-hidden border-[rgba(23,19,41,0.1)] bg-white/92 p-4 shadow-soft sm:p-6 lg:p-7"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="eyebrow">Real-time audience adaptation</p>
                <h1 className="max-w-[10ch] text-[clamp(2.9rem,7vw,5rem)] font-semibold tracking-[-0.075em] text-[var(--ink)]">
                  Speak once. Meet people where they are.
                </h1>
                <p className="max-w-[40rem] text-[15px] leading-6 text-[var(--ink-tint)] sm:text-base">
                  Paste, speak, or load a scenario. Then adapt it for the room in real time.
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(124,77,255,0.14)] bg-[rgba(124,77,255,0.06)] px-4 py-3 text-sm text-[var(--ink-tint-strong)]">
                Source in. Audience-ready language out.
              </div>
            </div>

            <div className="rounded-[28px] border border-[rgba(23,19,41,0.08)] bg-[#fcfbf8] p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="eyebrow">Input mode</p>
                  <div className="flex flex-wrap gap-2">
                    {activeModes.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleModeChange(item)}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-sm font-medium transition",
                          mode === item
                            ? "border-[rgba(124,77,255,0.28)] bg-[rgba(124,77,255,0.12)] text-[var(--ink)] shadow-[0_12px_28px_rgba(124,77,255,0.1)]"
                            : "border-[rgba(23,19,41,0.12)] bg-white text-[var(--ink-tint)] hover:border-[rgba(124,77,255,0.2)] hover:text-[var(--ink)]",
                        )}
                      >
                        {item === "type" && "Type"}
                        {item === "sample" && "Sample"}
                        {item === "speak" && "Speak"}
                        {item === "upload" && "Upload"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="eyebrow">Presets</p>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_SCENARIOS.map((scenario) => (
                      <button
                        key={scenario.id}
                        type="button"
                        onClick={() => loadPreset(scenario.id)}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-sm font-medium transition",
                          activePresetId === scenario.id && mode === "sample"
                            ? "border-[rgba(23,19,41,0.14)] bg-[var(--bg-dark)] text-white"
                            : "border-[rgba(23,19,41,0.12)] bg-white text-[var(--ink-tint)] hover:border-[rgba(23,19,41,0.2)] hover:text-[var(--ink)]",
                        )}
                      >
                        {scenario.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="rounded-[28px] border border-[rgba(23,19,41,0.08)] bg-[#fbfaf7] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ink-faint)]">
                      What was said
                    </p>
                    <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                      Source
                    </p>
                    <p className="mt-1 text-sm text-[var(--ink-tint)]">
                      Paste your words or load a preset.
                    </p>
                  </div>
                  <div className="rounded-full border border-[rgba(23,19,41,0.08)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--ink-tint)]">
                    {mode === "sample" && `Preset: ${activePresetLabel}`}
                    {mode === "type" && "Manual input"}
                    {mode === "speak" && (isListening ? "Listening live" : "Mic ready")}
                    {mode === "upload" && "Upload transcript"}
                  </div>
                </div>

                {mode === "speak" ? (
                  <div className="mt-4 rounded-[24px] border border-[rgba(23,19,41,0.08)] bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--ink)]">
                          {isListening ? "Listening now" : "Live capture"}
                        </p>
                        <p className="mt-1 text-sm text-[var(--ink-tint)]">
                          {speakingUnsupported
                            ? "Speech recognition is unavailable here. Typing still works."
                            : "Browser speech will append to the source box below."}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isListening ? "outline" : "live"}
                        onClick={() => {
                          if (isListening) {
                            stopListening();
                            return;
                          }

                          if (
                            normalizeText(sourceText) === normalizeText(presetSourceText)
                          ) {
                            setSourceText("");
                          }

                          void startListening();
                        }}
                        disabled={speakingUnsupported}
                      >
                        {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                        {isListening ? "Stop mic" : "Start mic"}
                      </Button>
                    </div>

                    {speechState === "denied" ? (
                      <div className="mt-3 flex items-start gap-2 rounded-[20px] border border-danger/20 bg-danger/8 px-3 py-2.5 text-sm text-[var(--ink)]">
                        <CircleAlert className="mt-0.5 size-4 text-danger" />
                        Allow mic access in the browser, or keep typing.
                      </div>
                    ) : null}

                    {interimText ? (
                      <div className="mt-3 rounded-[20px] border border-[rgba(124,77,255,0.16)] bg-[rgba(124,77,255,0.06)] px-3 py-2.5 text-sm text-[var(--ink-tint-strong)]">
                        Hearing: {interimText}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {mode === "upload" ? (
                  <div className="mt-4 rounded-[24px] border border-[rgba(23,19,41,0.08)] bg-white p-4">
                    <div
                      {...dropzone.getRootProps()}
                      className={cn(
                        "rounded-[22px] border border-dashed p-5 text-center transition",
                        dropzone.isDragActive
                          ? "border-[rgba(124,77,255,0.28)] bg-[rgba(124,77,255,0.06)]"
                          : "border-[rgba(23,19,41,0.12)] bg-[#fcfbf8]",
                      )}
                    >
                      <input {...dropzone.getInputProps()} />
                      <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-[rgba(124,77,255,0.12)] text-accent">
                        <UploadCloud className="size-5" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-[var(--ink)]">
                        Drop audio or video here
                      </p>
                      <p className="mt-1 text-sm text-[var(--ink-tint)]">
                        Upload stays secondary but available.
                      </p>
                    </div>

                    {selectedFile ? (
                      <div className="mt-3 rounded-[20px] border border-[rgba(23,19,41,0.08)] bg-[#fcfbf8] px-3 py-2.5 text-sm text-[var(--ink)]">
                        {selectedFile.name}
                      </div>
                    ) : null}

                    {uploadStage !== "idle" && uploadStage !== "error" ? (
                      <div className="mt-3 space-y-2">
                        <Progress value={uploadStageProgress[uploadStage]} />
                        <p className="text-sm text-[var(--ink-tint)]">
                          {uploadStage === "uploading" && "Uploading file"}
                          {uploadStage === "transcribing" && "Building transcript"}
                          {uploadStage === "clarifying" && "Adapting language"}
                          {uploadStage === "extracting" && "Generating recap"}
                          {uploadStage === "complete" && "Upload ready"}
                        </p>
                      </div>
                    ) : null}

                    {uploadError ? (
                      <div className="mt-3 rounded-[20px] border border-danger/20 bg-danger/8 px-3 py-2.5 text-sm text-[var(--ink)]">
                        {uploadError}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" onClick={handleProcessUpload}>
                        {uploadStage !== "idle" && uploadStage !== "error" ? (
                          <LoaderCircle className="size-4 animate-spin" />
                        ) : null}
                        Process upload
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadStage("idle");
                          setUploadError(null);
                        }}
                      >
                        Clear file
                      </Button>
                    </div>
                  </div>
                ) : null}

                <Textarea
                  aria-label="What was said"
                  className="mt-4 min-h-[340px] resize-none rounded-[24px] border-[rgba(23,19,41,0.08)] bg-white px-4 py-4 text-sm leading-7 shadow-none"
                  onChange={(event) => handleSourceChange(event.target.value)}
                  placeholder="Paste a message, meeting note, or quick update."
                  value={sourceText}
                />
              </div>

              <div className="rounded-[28px] border border-[rgba(23,19,41,0.08)] bg-[var(--bg-dark)] p-5 text-white">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/64">
                    Adapted for
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em]">
                    Audience
                  </p>
                  <p className="mt-1 text-sm text-white/72">
                    Switch the same message for the room.
                  </p>
                </div>

                <div className="mt-4">
                  <AudienceSelector onValueChange={setAudience} value={audience} />
                </div>

                <div className="mt-4 min-h-[340px] rounded-[24px] border border-white/10 bg-white/6 p-4 sm:p-5">
                  {adaptedOutput ? (
                    <p className="whitespace-pre-wrap text-sm leading-7 text-white/90">
                      {adaptedOutput}
                    </p>
                  ) : (
                    <div className="flex h-full min-h-[280px] items-center justify-center rounded-[20px] border border-dashed border-white/16 bg-black/10 px-6 text-center text-sm text-white/64">
                      Add input or load a preset to see the rewrite.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleGenerateRecap}>
                <Sparkles className="size-4" />
                {recapReady ? "Refresh recap" : "Generate recap"}
              </Button>
              <Button variant="outline" onClick={handleCopyAdaptedOutput}>
                <Clipboard className="size-4" />
                Copy adapted output
              </Button>
              <Button
                disabled={!recapReady}
                variant="outline"
                onClick={handleCopyRecap}
              >
                <Clipboard className="size-4" />
                Copy recap
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="size-4" />
                Reset
              </Button>
            </div>

            <div className="rounded-[28px] border border-[rgba(23,19,41,0.08)] bg-[#fbfaf7] p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="eyebrow">Recap</p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
                    Summary, decision, and action
                  </p>
                </div>
                <p className="text-sm text-[var(--ink-tint)]">
                  {recapReady
                    ? "Built from the current source and audience."
                    : "Generate recap from the current source."}
                </p>
              </div>

              <div
                className={cn(
                  "mt-4 grid gap-3",
                  recap?.risk ? "lg:grid-cols-4" : "lg:grid-cols-3",
                )}
              >
                {[
                  {
                    title: "Summary",
                    body: recap?.summary || "Generate recap to pull the main point.",
                  },
                  {
                    title: "Decision",
                    body: recap?.decision || "Generate recap to surface the decision.",
                  },
                  {
                    title: "Action",
                    body: recap?.action || "Generate recap to surface the next step.",
                  },
                  ...(recap?.risk
                    ? [
                        {
                          title: "Risk",
                          body: recap.risk,
                        },
                      ]
                    : []),
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-[rgba(23,19,41,0.08)] bg-white p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-faint)]">
                      {item.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--ink)]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="proof"
          className="mt-6 grid gap-3 rounded-[32px] border border-[rgba(23,19,41,0.08)] bg-white/82 p-4 shadow-panel md:grid-cols-3 md:p-5"
        >
          {proofItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[24px] border border-[rgba(23,19,41,0.08)] bg-[#fcfbf8] p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-accent" />
                  <p className="text-base font-semibold tracking-[-0.03em] text-[var(--ink)]">
                    {item.title}
                  </p>
                </div>
                <p className="mt-2 text-sm text-[var(--ink-tint)]">{item.body}</p>
              </div>
            );
          })}
        </section>

        <section id="use-cases" className="mt-6">
          <div className="grid gap-3 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-[rgba(23,19,41,0.08)] bg-white/88 p-5 shadow-panel"
              >
                <p className="text-lg font-semibold tracking-[-0.04em] text-[var(--ink)]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[var(--ink-tint)]">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(23,19,41,0.08)] bg-white/70">
        <div className="section-shell flex flex-col gap-3 py-6 text-sm text-[var(--ink-tint)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[var(--ink)]">Common Ground</p>
            <p>Say it once. Adapt it for the room.</p>
          </div>
          <p>
            Made by{" "}
            <a
              href="https://awaizahmed.com"
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-[var(--ink)] hover:text-accent"
            >
              Team Kanban
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
