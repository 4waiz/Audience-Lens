"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, AudioLines, CheckCircle2, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AUDIENCE_OPTIONS } from "@/lib/constants";
import { DEMO_SCENARIOS, getDemoScenario } from "@/lib/demo-data";
import type { AudienceMode } from "@/lib/types";

export function LandingPreview({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const [scenarioId, setScenarioId] = useState(DEMO_SCENARIOS[0].id);
  const scenario = useMemo(() => getDemoScenario(scenarioId), [scenarioId]);
  const [audience, setAudience] = useState<AudienceMode>(scenario.recommendedAudience);

  const activeSegment = scenario.session.transcript[0];
  const evidenceSegment = scenario.session.transcript[1];

  return (
    <div
      className={`relative overflow-hidden rounded-[36px] border border-[rgba(23,19,41,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,240,255,0.96))] shadow-soft ${
        variant === "compact" ? "p-6 sm:p-7" : "p-6 sm:p-8"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,77,255,0.14),transparent_24%)]" />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="max-w-[28rem]">
            <p className="eyebrow">Live product preview</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--ink)] sm:text-4xl">
              One message. Different listeners. Clear for all.
            </h3>
          </div>
          {variant === "full" ? (
            <Button asChild size="sm" className="min-w-[150px]">
              <Link href="/app/demo">
                Open full demo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : null}
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
                className={`rounded-[28px] border px-4 py-4 text-left transition ${
                  item.id === scenarioId
                    ? "border-[rgba(124,77,255,0.3)] bg-[rgba(124,77,255,0.12)] shadow-[0_12px_28px_rgba(124,77,255,0.12)]"
                    : "border-border bg-white/90 hover:bg-white"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-[rgba(23,19,41,0.74)]">{item.description}</p>
              </button>
            ))}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <div className="rounded-[30px] border border-border bg-[#fbfaf7] p-6 shadow-panel">
            <div className="flex items-center gap-2">
              <AudioLines className="size-4 text-accent" />
              <p className="eyebrow text-accent">What was said</p>
            </div>
            <p className="mt-3 text-sm font-medium text-[rgba(23,19,41,0.68)]">
              {scenario.session.title}
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--ink)] sm:text-lg">
              {activeSegment.text}
            </p>
            <div className="mt-5 rounded-[24px] border border-border bg-white p-4 shadow-[0_10px_24px_rgba(23,19,41,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(23,19,41,0.58)]">
                Supporting context
              </p>
              <p className="mt-2 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                {evidenceSegment.text}
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-[rgba(124,77,255,0.2)] bg-[rgba(124,77,255,0.12)] p-6 shadow-panel">
            <div className="flex items-center gap-2">
              <WandSparkles className="size-4 text-accent" />
              <p className="eyebrow text-accent">Adapted for the room</p>
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
                      : "border-[rgba(23,19,41,0.08)] bg-white/88 text-[rgba(23,19,41,0.72)] hover:bg-white hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-5 text-base leading-8 text-[var(--ink)] sm:text-lg">
              {activeSegment.audienceVersions[audience]}
            </p>
            <div className="mt-5 rounded-[24px] border border-[rgba(23,19,41,0.12)] bg-white p-4 shadow-[0_10px_24px_rgba(23,19,41,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(23,19,41,0.58)]">
                Recap for this audience
              </p>
              <p className="mt-2 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                {scenario.session.audienceRecaps[audience]}
              </p>
            </div>
          </div>
        </div>

        <div className={`grid gap-3 ${variant === "full" ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          <div className="rounded-[24px] border border-border bg-[#fbfaf7] p-4">
            <p className="eyebrow">Plain-language rewrite</p>
            <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
              {activeSegment.plainEnglish}
            </p>
          </div>
          <div className="rounded-[24px] border border-border bg-[#fbfaf7] p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-accent" />
              <p className="eyebrow">Decision captured</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
              {scenario.session.decisions[0]?.title ?? "Decisions appear as enough evidence arrives."}
            </p>
          </div>
          {variant === "full" ? (
            <div className="rounded-[24px] border border-border bg-[#fbfaf7] p-4">
              <p className="eyebrow">Action item</p>
              <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                {scenario.session.actionItems[0]
                  ? `${scenario.session.actionItems[0].owner}: ${scenario.session.actionItems[0].title}`
                  : "Action items appear as Common Ground detects owners and next steps."}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
