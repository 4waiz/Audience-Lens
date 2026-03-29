"use client";

import { Languages, Sparkles } from "lucide-react";

import { AudienceSelector } from "@/components/audience-selector";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AudienceMode, OutputLanguageCode, SessionRecord, TranscriptSegment } from "@/lib/types";

export function ClarityStudio({
  audience,
  onAudienceChange,
  outputLanguage,
  activeSegment,
  visibleSession,
}: {
  audience: AudienceMode;
  onAudienceChange: (value: AudienceMode) => void;
  outputLanguage: OutputLanguageCode;
  activeSegment?: TranscriptSegment;
  visibleSession: SessionRecord;
}) {
  const source = activeSegment ?? visibleSession.transcript.at(-1);
  const visibleKeyPoints = visibleSession.keyPoints.slice(0, 3);

  return (
    <Card className="min-h-[580px]">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle>Audience adaptation</CardTitle>
            <StatusPill label="Adapted draft" tone="accent" showDot={false} />
          </div>
          <p className="text-sm text-muted-foreground">
            Common Ground keeps the source transcript visible and rewrites meaning
            for the audience listening.
          </p>
          <AudienceSelector onValueChange={onAudienceChange} value={audience} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs className="w-full" defaultValue="plain">
          <TabsList className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
            <TabsTrigger value="plain">Plain English</TabsTrigger>
            <TabsTrigger value="audience">Audience mode</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
            <TabsTrigger value="summary">Summary preview</TabsTrigger>
          </TabsList>

          <TabsContent value="plain">
            <div className="space-y-5 rounded-[24px] border border-border bg-[#faf9f7] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="size-4 text-accent" />
                Plain-English rewrite
              </div>
              <p className="text-sm leading-7 text-foreground">
                {source?.plainEnglish ??
                  "Once transcript lines start arriving, Common Ground will simplify the selected segment here."}
              </p>
              <div className="rounded-[20px] border border-border bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(23,19,41,0.58)]">
                  Why this matters
                </p>
                <ul className="mt-3 space-y-2 text-sm text-[rgba(23,19,41,0.76)]">
                  {(source?.glossary ?? []).map((term) => (
                    <li key={term.term}>
                      <span className="font-medium text-foreground">{term.term}:</span>{" "}
                      {term.meaning}
                    </li>
                  ))}
                  {source?.glossary.length ? null : (
                    <li>Common Ground will surface jargon explanations for the active segment.</li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audience">
            <div className="space-y-5 rounded-[24px] border border-border bg-[#faf9f7] p-5">
              <p className="text-sm font-medium text-foreground">Adapted for {audience}</p>
              <p className="text-sm leading-7 text-foreground">
                {source?.audienceVersions[audience] ??
                  visibleSession.audienceRecaps[audience]}
              </p>
              <div className="rounded-[20px] border border-border bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(23,19,41,0.58)]">
                  Session recap for this audience
                </p>
                <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                  {visibleSession.audienceRecaps[audience]}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="translation">
            <div className="space-y-5 rounded-[24px] border border-border bg-[#faf9f7] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Languages className="size-4 text-info" />
                Translation-ready structure
              </div>
              <div className="space-y-4 rounded-[20px] border border-border bg-white p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(23,19,41,0.58)]">
                    Meaning to preserve
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {source?.translationBrief.meaning ??
                      "Common Ground will summarize the selected segment in translator-friendly language."}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(23,19,41,0.58)]">
                      Keep these terms
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-[rgba(23,19,41,0.76)]">
                      {(source?.translationBrief.keepTerms ?? ["Key terms appear here"]).map(
                        (term) => (
                          <li key={term}>{term}</li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(23,19,41,0.58)]">
                      Avoid these phrases
                    </p>
                    <ul className="mt-2 space-y-2 text-sm text-[rgba(23,19,41,0.76)]">
                      {(source?.translationBrief.avoid ?? ["Ambiguous phrases appear here"]).map(
                        (term) => (
                          <li key={term}>{term}</li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(23,19,41,0.58)]">
                    Output language draft
                  </p>
                  <p className="mt-2 text-sm text-foreground">
                    {source?.translationBrief.localizedDrafts?.[outputLanguage] ??
                      "No direct localized draft for this segment yet. Common Ground is still providing a translation-safe structure and preserved terminology."}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="space-y-4 rounded-[24px] border border-border bg-[#faf9f7] p-5">
              <p className="text-sm font-medium text-foreground">Summary preview</p>
              <p className="text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                {visibleSession.overview}
              </p>
              <div className="space-y-3">
                {visibleKeyPoints.length ? (
                  visibleKeyPoints.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[20px] border border-border bg-white p-4"
                    >
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-2 text-sm text-[rgba(23,19,41,0.76)]">{item.body}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[20px] border border-dashed border-border bg-white/80 p-4 text-sm text-[rgba(23,19,41,0.76)]">
                    Summary cards will appear as Common Ground gathers enough transcript evidence.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
