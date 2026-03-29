"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleAlert, ClipboardList, Mail, MessageSquareText } from "lucide-react";
import { toast } from "sonner";

import { AudienceSelector } from "@/components/audience-selector";
import { EmptyState } from "@/components/empty-state";
import { ExportMenu } from "@/components/export-menu";
import { StatusPill } from "@/components/status-pill";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useSessions } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEMO_SESSION } from "@/lib/demo-data";
import { buildEmailSummary, buildPlainSummary, buildSlackSummary } from "@/lib/export";
import type { AudienceMode, SessionRecord } from "@/lib/types";
import { formatDateTimeLabel, formatDuration, formatTimestamp } from "@/lib/utils";

function copyActionItems(session: SessionRecord) {
  return session.actionItems
    .map((item) => `- ${item.owner}: ${item.title} (${item.dueDate})`)
    .join("\n");
}

async function copyText(contents: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(contents);
    toast.success(successMessage);
  } catch {
    toast.error("Copy failed. Try again from a secure browser context.");
  }
}

export function SessionDetailPage({ sessionId }: { sessionId: string }) {
  const { preferences } = usePreferences();
  const { hydrated, getSessionById } = useSessions();
  const [audience, setAudience] = useState<AudienceMode>(preferences.defaultAudience);
  const [tab, setTab] = useState("overview");

  const session =
    getSessionById(sessionId) ?? (sessionId === DEMO_SESSION.id ? DEMO_SESSION : undefined);

  function jumpToTranscript(segmentId: string) {
    setTab("transcript");

    window.setTimeout(() => {
      document.getElementById(`segment-${segmentId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  }

  if (hydrated && !session) {
    return (
      <EmptyState
        action={
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/app/demo">Open sample demo</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/history">Back to history</Link>
            </Button>
          </div>
        }
        description="The requested session was not found in local history. You can reopen the sample demo or start a new session."
        icon={<ClipboardList className="size-5" />}
        title="Session not found"
      />
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-6" data-testid="session-detail">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Button asChild size="sm" variant="ghost">
            <Link href="/app/history">
              <ArrowLeft className="size-4" />
              Back to history
            </Link>
          </Button>
          <div>
            <p className="eyebrow">Session recap</p>
            <h2 className="section-title">{session.title}</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              {session.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill label={formatDateTimeLabel(session.updatedAt)} tone="default" />
            <StatusPill label={formatDuration(session.durationMs)} tone="accent" />
            <StatusPill label={`Input: ${session.inputLanguage}`} tone="default" />
            <StatusPill label={`Output: ${session.outputLanguage}`} tone="default" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => copyText(buildSlackSummary(session), "Slack update copied.")}
            variant="outline"
          >
            <MessageSquareText className="size-4" />
            Copy for Slack
          </Button>
          <Button
            onClick={() => copyText(buildEmailSummary(session), "Email recap copied.")}
            variant="outline"
          >
            <Mail className="size-4" />
            Copy for Email
          </Button>
          <Button
            onClick={() => copyText(buildPlainSummary(session), "Plain summary copied.")}
            variant="outline"
          >
            Copy plain summary
          </Button>
          <Button
            onClick={() => copyText(copyActionItems(session), "Action items copied.")}
            variant="outline"
          >
            Copy action items only
          </Button>
          <ExportMenu session={session} />
        </div>
      </div>

      <Tabs onValueChange={setTab} value={tab}>
        <TabsList className="grid w-full grid-cols-2 gap-2 lg:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience versions</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="actions">Action items</TabsTrigger>
          <TabsTrigger value="risks">Risks / blockers</TabsTrigger>
          <TabsTrigger value="transcript">Full transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle>Overview</CardTitle>
                  <StatusPill label="Draft recap - review before sharing" tone="accent" showDot={false} />
                </div>
                <CardDescription data-testid="summary-overview">
                  {session.overview}
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>People in the room</CardTitle>
                <CardDescription>
                  {session.attendees.map((person) => `${person.name} (${person.role})`).join(", ")}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {session.keyPoints.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <StatusPill label={item.confidence} tone="accent" showDot={false} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                  <Button
                    onClick={() => jumpToTranscript(item.sourceSegmentIds[0])}
                    variant="outline"
                  >
                    Jump to transcript
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audience">
          <Card>
            <CardHeader>
              <CardTitle>Audience-specific recap</CardTitle>
              <CardDescription>
                Same meeting, different framing for the person receiving it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <AudienceSelector onValueChange={setAudience} value={audience} />
              <div className="rounded-[24px] border border-border bg-muted/30 p-5">
                <p className="text-sm leading-7 text-foreground">
                  {session.audienceRecaps[audience]}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <div className="grid gap-4 lg:grid-cols-2">
            {session.decisions.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <StatusPill label={item.confidence} tone="accent" showDot={false} />
                  </div>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[20px] border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                    {item.impact}
                  </div>
                  <Button
                    onClick={() => jumpToTranscript(item.sourceSegmentIds[0])}
                    variant="outline"
                  >
                    Jump to transcript
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <div className="grid gap-4 lg:grid-cols-2">
            {session.actionItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <StatusPill
                      label={item.status}
                      tone={item.status === "Blocked" ? "warning" : item.status === "Planned" ? "accent" : "success"}
                      showDot={false}
                    />
                  </div>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[20px] border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">Owner:</span> {item.owner}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium text-foreground">Due:</span> {item.dueDate}
                    </p>
                  </div>
                  <Button
                    onClick={() => jumpToTranscript(item.sourceSegmentIds[0])}
                    variant="outline"
                  >
                    Jump to transcript
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks">
          <div className="grid gap-4 lg:grid-cols-2">
            {session.risks.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    <StatusPill
                      label={item.severity}
                      tone={item.severity === "High" ? "danger" : item.severity === "Medium" ? "warning" : "default"}
                      showDot={false}
                    />
                  </div>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => jumpToTranscript(item.sourceSegmentIds[0])}
                    variant="outline"
                  >
                    Jump to transcript
                  </Button>
                </CardContent>
              </Card>
            ))}

            {session.followUps.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CircleAlert className="size-4 text-warning" />
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </div>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Owner:</span> {item.owner}
                  </p>
                  <Button
                    onClick={() => jumpToTranscript(item.sourceSegmentIds[0])}
                    variant="outline"
                  >
                    Jump to transcript
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardHeader>
              <CardTitle>Full transcript</CardTitle>
              <CardDescription data-testid="full-transcript">
                Original transcript with timestamps. Use it to verify the generated recap.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.transcript.map((segment) => (
                <div
                  id={`segment-${segment.id}`}
                  key={segment.id}
                  className="rounded-[24px] border border-border bg-card/70 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {segment.speaker}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {segment.speakerRole}
                      </p>
                    </div>
                    <StatusPill label={formatTimestamp(segment.startMs)} tone="default" showDot={false} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-foreground">{segment.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
