"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, WandSparkles } from "lucide-react";

import { AUDIENCE_OPTIONS } from "@/lib/constants";
import { DEMO_SESSION } from "@/lib/demo-data";
import type { AudienceMode } from "@/lib/types";

const showcaseSegment = DEMO_SESSION.transcript[1];
const audienceSafeSegment = DEMO_SESSION.transcript[2];

export function LandingPreview() {
  const [audience, setAudience] = useState<AudienceMode>("client");

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="surface relative overflow-hidden p-5 sm:p-6"
      initial={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-accent/12 via-transparent to-live/10" />
      <div className="relative space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          {AUDIENCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                option.id === audience
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setAudience(option.id)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_auto_1fr]">
          <div className="rounded-[28px] border border-border bg-card/75 p-5">
            <p className="eyebrow">What was said</p>
            <p className="mt-3 text-sm text-muted-foreground">Ravi, Engineering</p>
            <p className="mt-3 text-base leading-8 text-foreground">
              {showcaseSegment.text}
            </p>
          </div>

          <div className="hidden items-center justify-center xl:flex">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
              <ArrowRight className="size-5" />
            </span>
          </div>

          <div className="rounded-[28px] border border-accent/20 bg-accent/8 p-5">
            <div className="flex items-center gap-2">
              <WandSparkles className="size-4 text-accent" />
              <p className="eyebrow text-accent">Relay for {audience}</p>
            </div>
            <p className="mt-4 text-base leading-8 text-foreground">
              {showcaseSegment.audienceVersions[audience]}
            </p>
            <div className="mt-5 rounded-[22px] border border-border bg-card/80 p-4">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Supporting context
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {audienceSafeSegment.audienceVersions[audience]}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-border bg-card/70 p-4">
            <p className="eyebrow">Plain English</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {showcaseSegment.plainEnglish}
            </p>
          </div>
          <div className="rounded-[24px] border border-border bg-card/70 p-4">
            <p className="eyebrow">Decision captured</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {DEMO_SESSION.decisions[0].title}
            </p>
          </div>
          <div className="rounded-[24px] border border-border bg-card/70 p-4">
            <p className="eyebrow">Action item detected</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {DEMO_SESSION.actionItems[0].owner}: {DEMO_SESSION.actionItems[0].title}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
