"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";

import { ClarityStudio } from "@/features/workspace/clarity-studio";
import { InsightsTray } from "@/features/workspace/insights-tray";
import { PreflightPanel } from "@/features/workspace/preflight-panel";
import { TranscriptStream } from "@/features/workspace/transcript-stream";
import { WaveformIndicator } from "@/features/workspace/waveform-indicator";
import { ExportMenu } from "@/components/export-menu";
import { LanguageSelect } from "@/components/language-select";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useSessions } from "@/components/providers/session-provider";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildFallbackSession, buildGeneratedSegment } from "@/lib/adaptation";
import { INPUT_LANGUAGE_OPTIONS, OUTPUT_LANGUAGE_OPTIONS } from "@/lib/constants";
import { DEMO_SCENARIOS, getDemoScenario } from "@/lib/demo-data";
import type {
  AudienceMode,
  InputLanguageCode,
  OutputLanguageCode,
  PermissionState,
  SessionKind,
  SessionRecord,
  TranscriptSegment,
} from "@/lib/types";
import { formatDuration, formatTimestamp } from "@/lib/utils";

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

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function buildVisibleDemoSession(
  baseSession: SessionRecord,
  displayedSegments: TranscriptSegment[],
  kind: SessionKind,
  inputLanguage: InputLanguageCode,
  outputLanguage: OutputLanguageCode,
) {
  const visibleIds = new Set(displayedSegments.map((segment) => segment.id));

  const isReady = (sourceSegmentIds: string[]) =>
    sourceSegmentIds.every((segmentId) => visibleIds.has(segmentId));

  return {
    ...baseSession,
    kind,
    inputLanguage,
    outputLanguage,
    transcript: displayedSegments,
    overview:
      displayedSegments.length >= 3
        ? baseSession.overview
        : "Common Ground is collecting enough transcript evidence to draft a grounded recap.",
    keyPoints: baseSession.keyPoints.filter((item) => isReady(item.sourceSegmentIds)),
    decisions: baseSession.decisions.filter((item) => isReady(item.sourceSegmentIds)),
    actionItems: baseSession.actionItems.filter((item) =>
      isReady(item.sourceSegmentIds),
    ),
    risks: baseSession.risks.filter((item) => isReady(item.sourceSegmentIds)),
    followUps: baseSession.followUps.filter((item) => isReady(item.sourceSegmentIds)),
    audienceRecaps:
      displayedSegments.length >= 4
        ? baseSession.audienceRecaps
        : {
            executive: "Common Ground is still gathering enough context for an executive recap.",
            client: "Common Ground is still gathering enough context for a client-facing recap.",
            engineer: "Common Ground is still gathering enough context for an engineering recap.",
            newHire: "Common Ground is still gathering enough context for a new-hire recap.",
            nonNative:
              "Common Ground is still gathering enough context for a simplified recap.",
          },
  };
}

function getReadableStatusLabel(
  mode: "demo" | "live",
  running: boolean,
  paused: boolean,
  permissionState: PermissionState,
  complete: boolean,
) {
  if (permissionState === "denied") {
    return "Permission denied";
  }

  if (permissionState === "unsupported") {
    return "Browser unsupported";
  }

  if (permissionState === "no-device") {
    return "No microphone";
  }

  if (complete) {
    return mode === "demo" ? "Scenario ready" : "Ready to recap";
  }

  if (paused) {
    return "Paused";
  }

  if (running) {
    return mode === "demo" ? "Scenario live" : "Listening";
  }

  return "Ready";
}

function createSavedDemoSession(session: SessionRecord) {
  const now = new Date().toISOString();
  return {
    ...structuredClone(session),
    id: crypto.randomUUID(),
    kind: "demo" as const,
    updatedAt: now,
    createdAt: now,
  };
}

export function LiveWorkspace({ mode }: { mode: "demo" | "live" }) {
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferences();
  const { seedDemoSession, upsertSession } = useSessions();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const stopRequestedRef = useRef(false);

  const [scenarioId, setScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const scenario = useMemo(() => getDemoScenario(scenarioId), [scenarioId]);
  const [inputLanguage, setInputLanguage] =
    useState<InputLanguageCode>(preferences.inputLanguage);
  const [outputLanguage, setOutputLanguage] =
    useState<OutputLanguageCode>(preferences.outputLanguage);
  const [audience, setAudience] =
    useState<AudienceMode>(preferences.defaultAudience || scenario.recommendedAudience);
  const [permissionState, setPermissionState] = useState<PermissionState>(() => {
    if (mode === "demo") {
      return "granted";
    }

    if (typeof window !== "undefined") {
      const hasMedia = Boolean(navigator.mediaDevices?.getUserMedia);
      const hasRecognition = Boolean(
        window.SpeechRecognition || window.webkitSpeechRecognition,
      );

      if (!hasMedia || !hasRecognition) {
        return "unsupported";
      }
    }

    return "idle";
  });
  const [searchValue, setSearchValue] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();
  const [visibleCount, setVisibleCount] = useState(mode === "demo" ? 3 : 0);
  const [running, setRunning] = useState(mode === "demo");
  const [paused, setPaused] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [networkLost, setNetworkLost] = useState(false);
  const [liveSegments, setLiveSegments] = useState<TranscriptSegment[]>([]);

  const speechRecognitionConstructor = useMemo(
    () => getSpeechRecognitionConstructor(),
    [],
  );

  const displayedSegments =
    mode === "demo"
      ? scenario.session.transcript.slice(0, visibleCount)
      : liveSegments;

  const effectiveSelectedSegmentId = displayedSegments.some(
    (segment) => segment.id === selectedSegmentId,
  )
    ? selectedSegmentId
    : displayedSegments.at(-1)?.id;

  const activeSegment = displayedSegments.find(
    (segment) => segment.id === effectiveSelectedSegmentId,
  );

  const visibleSession = useMemo(() => {
    if (mode === "demo") {
      return buildVisibleDemoSession(
        scenario.session,
        displayedSegments,
        "demo",
        inputLanguage,
        outputLanguage,
      );
    }

    return buildFallbackSession({
      id: "live-session",
      title: "Live session",
      subtitle: "Captured with browser speech recognition and Common Ground fallback adaptation",
      kind: "live",
      inputLanguage,
      outputLanguage,
      transcript: displayedSegments,
    });
  }, [displayedSegments, inputLanguage, mode, outputLanguage, scenario.session]);

  const complete =
    mode === "demo"
      ? visibleCount >= scenario.session.transcript.length
      : !running && displayedSegments.length > 0;

  const timerValue = displayedSegments.at(-1)?.endMs ?? 0;

  useEffect(() => {
    if (mode === "demo") {
      seedDemoSession(scenario.session);
    }
  }, [mode, scenario.session, seedDemoSession]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleNetworkChange = () => {
      setNetworkLost(!window.navigator.onLine);
    };

    handleNetworkChange();
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, []);

  useEffect(() => {
    if (mode !== "live") {
      return;
    }

    if (!navigator.mediaDevices?.enumerateDevices) {
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((availableDevices) => {
        const audioInputs = availableDevices.filter(
          (device) => device.kind === "audioinput",
        );

        if (!audioInputs.length) {
          setPermissionState("no-device");
          return;
        }

      })
      .catch(() => {
        setPermissionState("unsupported");
      });
  }, [mode, speechRecognitionConstructor]);

  useEffect(() => {
    if (mode !== "demo" || !running || paused || complete) {
      return;
    }

    const interval = window.setInterval(() => {
      setVisibleCount((current) =>
        Math.min(current + 1, scenario.session.transcript.length),
      );
    }, 1300);

    return () => {
      window.clearInterval(interval);
    };
  }, [complete, mode, paused, running, scenario.session.transcript.length]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
    };
  }, []);

  function applyPreferenceUpdates(nextAudience: AudienceMode) {
    updatePreferences({
      defaultAudience: nextAudience,
      inputLanguage,
      outputLanguage,
    });
  }

  function appendLiveSegment(text: string) {
    setLiveSegments((current) => {
      const previousEnd = current.at(-1)?.endMs ?? 0;
      const duration = Math.max(5000, text.trim().split(/\s+/).length * 420);
      const segment = buildGeneratedSegment({
        id: `live-${current.length + 1}`,
        text,
        speaker: "Live speaker",
        speakerRole: "Microphone capture",
        startMs: previousEnd,
        endMs: previousEnd + duration,
      });
      return [...current, segment];
    });
  }

  async function startRecognitionSession({ resume = false }: { resume?: boolean } = {}) {
    if (!speechRecognitionConstructor || !navigator.mediaDevices?.getUserMedia) {
      setPermissionState("unsupported");
      return;
    }

    setPermissionState("prompting");
    stopRequestedRef.current = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());

      if (!resume) {
        setLiveSegments([]);
        setSelectedSegmentId(undefined);
      }

      const recognition = new speechRecognitionConstructor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = inputLanguage;

      recognition.onstart = () => {
        setPermissionState("granted");
        setRunning(true);
        setPaused(false);
        toast.success("Common Ground started listening.");
      };

      recognition.onresult = (event) => {
        for (let index = event.resultIndex; index < event.results.length; index += 1) {
          const result = event.results[index];
          if (result.isFinal) {
            const transcript = result[0]?.transcript?.trim();
            if (transcript) {
              appendLiveSegment(transcript);
            }
          }
        }
      };

      recognition.onerror = (event) => {
        if (event.error === "not-allowed") {
          setPermissionState("denied");
          toast.error("Microphone access was denied.");
          return;
        }

        if (event.error === "no-speech") {
          toast.message("No speech detected yet. Keep talking to generate transcript lines.");
          return;
        }

        toast.error("Live transcription paused. Use the sample demo if the browser blocks speech recognition.");
        setPermissionState("unsupported");
      };

      recognition.onend = () => {
        recognitionRef.current = null;

        if (stopRequestedRef.current) {
          return;
        }

        if (!paused) {
          void startRecognitionSession({ resume: true });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setPermissionState("denied");
        return;
      }

      if (error instanceof DOMException && error.name === "NotFoundError") {
        setPermissionState("no-device");
        return;
      }

      setPermissionState("unsupported");
    }
  }

  function handleReplay() {
    if (mode === "demo") {
      setVisibleCount(0);
      setPaused(false);
      setRunning(true);
      setSelectedSegmentId(undefined);
      return;
    }

    void startRecognitionSession();
  }

  function handlePauseToggle() {
    if (mode === "demo") {
      setPaused((current) => !current);
      return;
    }

    if (paused) {
      void startRecognitionSession({ resume: true });
      return;
    }

    stopRequestedRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRunning(false);
    setPaused(true);
  }

  function handleStop() {
    if (!displayedSegments.length) {
      toast.error("Start a session or open the sample demo first.");
      return;
    }

    stopRequestedRef.current = true;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setRunning(false);
    setPaused(false);

    const completedSession =
      mode === "demo"
        ? createSavedDemoSession(visibleSession)
        : {
            ...visibleSession,
            id: crypto.randomUUID(),
            title: `Live session - ${formatTimestamp(timerValue)}`,
            subtitle: "Captured in Common Ground with browser speech recognition and local recap fallback",
            updatedAt: new Date().toISOString(),
          };

    upsertSession(completedSession);
    router.push(`/app/session/${completedSession.id}`);
  }

  function renderWorkspace() {
    return (
      <div className="space-y-6">
        {networkLost ? (
          <Card className="border-warning/20 bg-warning/8">
            <CardContent className="flex items-start gap-3 p-5">
              <AlertCircle className="mt-0.5 size-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Network connection lost
                </p>
                <p className="mt-1 text-sm text-[rgba(23,19,41,0.76)]">
                  Common Ground keeps the current transcript visible. Reconnect to
                  resume exports and any future provider calls.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="overflow-hidden">
          <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">
                {mode === "demo" ? "Sample workspace" : "Live workspace"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold tracking-[-0.05em] md:text-3xl">
                  {mode === "demo" ? scenario.session.title : "Live session"}
                </h2>
                <StatusPill
                  label={getReadableStatusLabel(
                    mode,
                    running,
                    paused,
                    permissionState,
                    complete,
                  )}
                  tone={
                    permissionState === "denied"
                      ? "danger"
                      : running
                        ? "live"
                        : complete
                          ? "success"
                          : "default"
                  }
                />
                <WaveformIndicator active={running && !paused && !complete} />
              </div>
              <p className="mt-2 text-sm text-[rgba(23,19,41,0.76)]">
                Timer: {formatDuration(timerValue)} | {displayedSegments.length} transcript lines ready
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
              <div className="min-w-[180px]">
                <LanguageSelect
                  onValueChange={(value) => {
                    if (value === inputLanguage) {
                      return;
                    }

                    setInputLanguage(value);
                    updatePreferences({ inputLanguage: value });
                  }}
                  options={INPUT_LANGUAGE_OPTIONS}
                  placeholder="Input language"
                  value={inputLanguage}
                />
              </div>
              <div className="min-w-[180px]">
                <LanguageSelect
                  onValueChange={(value) => {
                    if (value === outputLanguage) {
                      return;
                    }

                    setOutputLanguage(value);
                    updatePreferences({ outputLanguage: value });
                  }}
                  options={OUTPUT_LANGUAGE_OPTIONS}
                  placeholder="Output language"
                  value={outputLanguage}
                />
              </div>
              {running || paused || complete ? (
                <Button
                  onClick={handlePauseToggle}
                  variant="outline"
                  disabled={mode === "live" && permissionState === "unsupported"}
                >
                  {paused ? <Play className="size-4" /> : <Pause className="size-4" />}
                  {paused ? "Resume" : "Pause"}
                </Button>
              ) : (
                <Button onClick={handleReplay} variant="outline">
                  <Play className="size-4" />
                  {mode === "demo" ? "Replay" : "Start"}
                </Button>
              )}
              <Button onClick={handleStop} variant="outline">
                <Square className="size-4" />
                Stop
              </Button>
              <ExportMenu buttonSize="sm" buttonVariant="outline" session={visibleSession} />
            </div>
          </CardContent>
        </Card>

        {mode === "demo" ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {DEMO_SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setScenarioId(item.id);
                  setAudience(item.recommendedAudience);
                  setVisibleCount(3);
                  setSelectedSegmentId(undefined);
                  setPaused(false);
                  setRunning(true);
                }}
                className={`rounded-[28px] border p-5 text-left transition ${
                  item.id === scenarioId
                    ? "border-accent/30 bg-[rgba(124,77,255,0.12)] shadow-panel"
                    : "border-border bg-white hover:bg-[rgba(124,77,255,0.04)]"
                }`}
              >
                <p className="eyebrow">{item.label}</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-foreground">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-[rgba(23,19,41,0.76)]">{item.description}</p>
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,1fr)]">
          <TranscriptStream
            displayedSegments={displayedSegments}
            onSearchChange={setSearchValue}
            onSelectSegment={setSelectedSegmentId}
            running={running && !paused && !complete}
            searchValue={searchValue}
            selectedSegmentId={effectiveSelectedSegmentId}
          />
          <ClarityStudio
            activeSegment={activeSegment}
            audience={audience}
            onAudienceChange={(value) => {
              setAudience(value);
              applyPreferenceUpdates(value);
            }}
            outputLanguage={outputLanguage}
            visibleSession={visibleSession}
          />
        </div>

        <InsightsTray
          onToggle={() => setInsightsOpen((current) => !current)}
          open={insightsOpen}
          session={visibleSession}
        />
      </div>
    );
  }

  if (mode === "live" && !running && !paused && displayedSegments.length === 0) {
    return (
      <PreflightPanel
        audience={audience}
        inputLanguage={inputLanguage}
        onAudienceChange={(value) => {
          setAudience(value);
          applyPreferenceUpdates(value);
        }}
        onInputLanguageChange={(value) => {
          if (value === inputLanguage) {
            return;
          }

          setInputLanguage(value);
          updatePreferences({ inputLanguage: value });
        }}
        onOutputLanguageChange={(value) => {
          if (value === outputLanguage) {
            return;
          }

          setOutputLanguage(value);
          updatePreferences({ outputLanguage: value });
        }}
        onStart={() => {
          void startRecognitionSession();
        }}
        onUseSampleDemo={() => router.push("/app/demo")}
        outputLanguage={outputLanguage}
        permissionState={permissionState}
      />
    );
  }

  return renderWorkspace();
}


