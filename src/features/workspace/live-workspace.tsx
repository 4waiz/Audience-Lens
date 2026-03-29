"use client";

import { useEffect, useState } from "react";
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
import { INPUT_LANGUAGE_OPTIONS, OUTPUT_LANGUAGE_OPTIONS } from "@/lib/constants";
import { DEMO_SESSION } from "@/lib/demo-data";
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
import { createSessionFromDemo } from "@/services/relay-service";

function buildVisibleSession(
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
        : "Relay is collecting enough transcript evidence to draft a reliable recap.",
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
            executive: "Relay is still gathering enough context for an executive recap.",
            client: "Relay is still gathering enough context for a client-safe recap.",
            engineer: "Relay is still gathering enough context for an engineering recap.",
            newHire: "Relay is still gathering enough context for a new-hire recap.",
            nonNative:
              "Relay is still gathering enough context for a simplified recap.",
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
    return mode === "demo" ? "Sample complete" : "Ready to recap";
  }

  if (paused) {
    return "Paused";
  }

  if (running) {
    return mode === "demo" ? "Sample live" : "Listening";
  }

  return "Ready";
}

export function LiveWorkspace({ mode }: { mode: "demo" | "live" }) {
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferences();
  const { seedDemoSession, upsertSession } = useSessions();

  const [inputLanguage, setInputLanguage] =
    useState<InputLanguageCode>(preferences.inputLanguage);
  const [outputLanguage, setOutputLanguage] =
    useState<OutputLanguageCode>(preferences.outputLanguage);
  const [audience, setAudience] = useState<AudienceMode>(preferences.defaultAudience);
  const [permissionState, setPermissionState] = useState<PermissionState>(() => {
    if (mode === "demo") {
      return "granted";
    }

    if (
      typeof navigator !== "undefined" &&
      (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    ) {
      return "unsupported";
    }

    return "idle";
  });
  const [deviceId, setDeviceId] = useState("default");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();
  const [visibleCount, setVisibleCount] = useState(mode === "demo" ? 4 : 0);
  const [running, setRunning] = useState(mode === "demo");
  const [paused, setPaused] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(true);
  const [networkLost, setNetworkLost] = useState(false);

  const displayedSegments = DEMO_SESSION.transcript.slice(0, visibleCount);
  const effectiveSelectedSegmentId = displayedSegments.some(
    (segment) => segment.id === selectedSegmentId,
  )
    ? selectedSegmentId
    : displayedSegments.at(-1)?.id;
  const activeSegment = displayedSegments.find(
    (segment) => segment.id === effectiveSelectedSegmentId,
  );
  const visibleSession = buildVisibleSession(
    DEMO_SESSION,
    displayedSegments,
    mode === "demo" ? "demo" : "live",
    inputLanguage,
    outputLanguage,
  );
  const complete = visibleCount >= DEMO_SESSION.transcript.length;
  const timerValue = displayedSegments.at(-1)?.endMs ?? 0;

  useEffect(() => {
    if (mode === "demo") {
      seedDemoSession();
    }
  }, [mode, seedDemoSession]);

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

    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((availableDevices) => {
        const audioInputs = availableDevices.filter(
          (device) => device.kind === "audioinput",
        );
        setDevices(audioInputs);

        if (!audioInputs.length) {
          setPermissionState("no-device");
        }
      })
      .catch(() => {
        setPermissionState("unsupported");
      });
  }, [mode]);

  useEffect(() => {
    if (!running || paused || complete) {
      return;
    }

    const interval = window.setInterval(() => {
      setVisibleCount((current) => {
        if (current >= DEMO_SESSION.transcript.length) {
          return current;
        }

        return current + 1;
      });
    }, mode === "demo" ? 1200 : 1400);

    return () => {
      window.clearInterval(interval);
    };
  }, [complete, mode, paused, running]);

  function applyPreferenceUpdates(nextAudience: AudienceMode) {
    updatePreferences({
      defaultAudience: nextAudience,
      inputLanguage,
      outputLanguage,
    });
  }

  async function handleStartLiveSession() {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setPermissionState("unsupported");
      return;
    }

    setPermissionState("prompting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio:
          deviceId !== "default"
            ? {
                deviceId: {
                  exact: deviceId,
                },
              }
            : true,
      });

      stream.getTracks().forEach((track) => track.stop());

      setPermissionState("granted");
      setRunning(true);
      setPaused(false);
      setVisibleCount(0);
      setSelectedSegmentId(undefined);
      toast.success("Relay started a demo-safe live session.");
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
    setVisibleCount(0);
    setPaused(false);
    setRunning(true);
    setSelectedSegmentId(undefined);
  }

  function handlePauseToggle() {
    setPaused((current) => !current);
  }

  function handleStop() {
    if (!displayedSegments.length) {
      toast.error("Start a session or open the sample demo first.");
      return;
    }

    setRunning(false);
    setPaused(false);

    const savedSession = createSessionFromDemo({
      kind: mode === "demo" ? "demo" : "live",
      inputLanguage,
      outputLanguage,
      title:
        mode === "demo"
          ? DEMO_SESSION.title
          : `Live clarity session - ${formatTimestamp(timerValue)}`,
      subtitle:
        mode === "demo"
          ? DEMO_SESSION.subtitle
          : "Captured in the Relay live workspace using demo-safe streaming",
    });

    const completedSession = {
      ...savedSession,
      transcript: visibleSession.transcript,
      overview: visibleSession.overview,
      keyPoints: visibleSession.keyPoints,
      decisions: visibleSession.decisions,
      actionItems: visibleSession.actionItems,
      risks: visibleSession.risks,
      followUps: visibleSession.followUps,
      audienceRecaps: visibleSession.audienceRecaps,
      updatedAt: new Date().toISOString(),
      durationMs: timerValue,
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
                <p className="mt-1 text-sm text-muted-foreground">
                  Relay keeps the current transcript visible. Reconnect to resume
                  syncing exports and future provider calls.
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
                <h2 className="text-2xl font-semibold tracking-tight">
                  {mode === "demo" ? DEMO_SESSION.title : "Live clarity session"}
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
              <p className="mt-2 text-sm text-muted-foreground">
                Timer: {formatDuration(timerValue)} - {displayedSegments.length} transcript
                lines ready
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
                  disabled={!running && !paused}
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
              <ExportMenu
                buttonSize="sm"
                buttonVariant="outline"
                session={visibleSession}
              />
            </div>
          </CardContent>
        </Card>

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

  if (mode === "live" && !running && visibleCount === 0 && permissionState !== "granted") {
    return (
      <PreflightPanel
        audience={audience}
        deviceId={deviceId}
        devices={devices}
        inputLanguage={inputLanguage}
        onAudienceChange={(value) => {
          setAudience(value);
          applyPreferenceUpdates(value);
        }}
        onDeviceChange={setDeviceId}
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
        onStart={handleStartLiveSession}
        onUseSampleDemo={() => router.push("/app/demo")}
        outputLanguage={outputLanguage}
        permissionState={permissionState}
      />
    );
  }

  return renderWorkspace();
}
