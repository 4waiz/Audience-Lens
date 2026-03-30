"use client";

import { useMemo, useState } from "react";
import { AudioLines, CheckCircle2, WandSparkles } from "lucide-react";

import { AUDIENCE_OPTIONS } from "@/lib/constants";
import { DEMO_SCENARIOS, getDemoScenario } from "@/lib/demo-data";
import type { AudienceMode } from "@/lib/types";

export function LandingPreview({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const [scenarioId, setScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const scenario = useMemo(() => getDemoScenario(scenarioId), [scenarioId]);
  const [audience, setAudience] = useState<AudienceMode>(scenario.recommendedAudience);

  const activeSegment = scenario.session.transcript[0];
  const summary = scenario.session.keyPoints[0]?.title ?? "Summary builds from the transcript.";
  const decision = scenario.session.decisions[0]?.title ?? "Decision builds from the transcript.";
  const action = scenario.session.actionItems[0]
    ? `${scenario.session.actionItems[0].owner}: ${scenario.session.actionItems[0].title}`
    : "Action items appear here.";

  return (
    <div
      className={`relative overflow-hidden rounded-[36px] border border-[rgba(23,19,41,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,240,255,0.96))] shadow-soft ${
        variant === "compact" ? "p-5 sm:p-6" : "p-6 sm:p-7"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,77,255,0.14),transparent_24%)]" />

      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Live preview</p>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--ink)]">
              {scenario.title}
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-[rgba(124,77,255,0.2)] bg-[rgba(124,77,255,0.1)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            {scenario.label}
          </div>
        </div>

        {variant === "full" ? (
          <div className="grid gap-3 md:grid-cols-3">
            {DEMO_SCENARIOS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setScenarioId(item.id);
                  setAudience(item.recommendedAudience);
                }}
                className={`rounded-[24px] border px-4 py-4 text-left transition ${
                  item.id === scenarioId
                    ? "border-[rgba(124,77,255,0.28)] bg-[rgba(124,77,255,0.12)] shadow-[0_12px_28px_rgba(124,77,255,0.12)]"
                    : "border-border bg-white/88 hover:bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--ink)]">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-[rgba(23,19,41,0.72)]">
                  {item.description}
                </p>
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[28px] border border-border bg-[#fbfaf7] p-5 shadow-panel">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AudioLines className="size-4 text-accent" />
                <p className="eyebrow text-accent">Transcript</p>
              </div>
              <p className="text-xs font-medium text-[rgba(23,19,41,0.56)]">
                {activeSegment.speaker}
              </p>
            </div>
            <p className="mt-4 text-base leading-8 text-[var(--ink)] sm:text-lg">
              {activeSegment.text}
            </p>
          </div>

          <div className="rounded-[28px] border border-[rgba(124,77,255,0.2)] bg-[rgba(124,77,255,0.12)] p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <WandSparkles className="size-4 text-accent" />
              <p className="eyebrow text-accent">Adapted</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {AUDIENCE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAudience(option.id)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                    option.id === audience
                      ? "border-[rgba(124,77,255,0.24)] bg-accent text-white shadow-[0_10px_24px_rgba(124,77,255,0.16)]"
                      : "border-[rgba(23,19,41,0.08)] bg-white/90 text-[rgba(23,19,41,0.72)] hover:bg-white hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-5 text-base leading-8 text-[var(--ink)] sm:text-lg">
              {activeSegment.audienceVersions[audience]}
            </p>
          </div>
        </div>

        <div className={`grid gap-3 ${variant === "full" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <div className="rounded-[24px] border border-border bg-white/92 p-4">
            <p className="eyebrow">Summary</p>
            <p className="mt-3 text-sm leading-6 text-[rgba(23,19,41,0.76)]">{summary}</p>
          </div>
          <div className="rounded-[24px] border border-border bg-white/92 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-accent" />
              <p className="eyebrow">Decision</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[rgba(23,19,41,0.76)]">{decision}</p>
          </div>
          {variant === "full" ? (
            <div className="rounded-[24px] border border-border bg-white/92 p-4">
              <p className="eyebrow">Action</p>
              <p className="mt-3 text-sm leading-6 text-[rgba(23,19,41,0.76)]">{action}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
