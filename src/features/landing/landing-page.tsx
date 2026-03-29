import Link from "next/link";
import { ArrowRight, AudioLines, CheckCircle2, WandSparkles } from "lucide-react";

import { RelayLogo } from "@/components/relay-logo";
import { Button } from "@/components/ui/button";
import { LandingPreview } from "@/features/landing/landing-preview";

const proofItems = [
  {
    title: "Transcript",
    body: "Keep the original words visible as they land.",
    icon: AudioLines,
  },
  {
    title: "Audience-aware rewrite",
    body: "Switch the framing for the room in one click.",
    icon: WandSparkles,
  },
  {
    title: "Clear recap",
    body: "Leave with summary, decision, and next steps.",
    icon: CheckCircle2,
  },
] as const;

const useCases = [
  {
    title: "Client calls",
    body: "Turn internal language into clear customer-facing explanation.",
  },
  {
    title: "Onboarding",
    body: "Add context for someone new without repeating the meeting.",
  },
  {
    title: "Status updates",
    body: "Simplify technical updates without losing the important detail.",
  },
] as const;

export function LandingPage() {
  return (
    <div className="light-canvas min-h-screen">
      <div className="border-b border-[rgba(23,19,41,0.08)] bg-[#cfc2f4] px-4 py-3 text-center text-sm font-medium text-[var(--ink)]">
        Built for clearer communication in meetings, demos, and onboarding
      </div>

      <header className="sticky top-0 z-40 border-b border-[rgba(23,19,41,0.08)] bg-[rgba(246,244,238,0.94)] backdrop-blur">
        <div className="section-shell py-4">
          <div className="flex items-center justify-between gap-4 rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--bg-dark)] px-4 py-3 shadow-[0_18px_42px_rgba(23,19,41,0.16)] sm:px-5 lg:px-6">
            <RelayLogo href="/" tone="dark" showTagline={false} className="shrink-0" />
            <nav className="hidden items-center gap-8 lg:flex">
              <a href="#how-it-works" className="text-sm font-medium text-white/80 transition hover:text-white">
                How it works
              </a>
              <a href="#use-cases" className="text-sm font-medium text-white/80 transition hover:text-white">
                Use cases
              </a>
              <a href="#demo" className="text-sm font-medium text-white/80 transition hover:text-white">
                Demo
              </a>
            </nav>
            <Button asChild size="sm">
              <Link href="/app/demo">Try demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="section-shell py-10 sm:py-14 lg:py-16">
        <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10">
          <div className="space-y-6 lg:pt-6">
            <p className="eyebrow">Real-time communication adaptation</p>
            <h1 className="max-w-[10ch] text-[clamp(3.4rem,7vw,6.6rem)] font-semibold tracking-[-0.075em] text-[var(--ink)]">
              Speak once. Meet people{" "}
              <span className="capsule-outline">where they are.</span>
            </h1>
            <p className="max-w-[34rem] text-lg leading-8 text-[var(--ink-tint)]">
              Paste, speak, or load a scenario. Then adapt it for the room in real time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app/demo">Try sample demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/app/live">Start live session</Link>
              </Button>
            </div>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-tint-strong)] transition hover:text-[var(--ink)]"
            >
              View how it works
              <ArrowRight className="size-4" />
            </a>
          </div>

          <div id="demo">
            <LandingPreview variant="full" />
          </div>
        </section>

        <section
          id="how-it-works"
          className="mt-10 grid gap-4 rounded-[32px] border border-[rgba(23,19,41,0.1)] bg-white/94 p-5 shadow-soft md:grid-cols-3 md:p-7"
        >
          {proofItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[24px] border border-[rgba(23,19,41,0.08)] bg-[#fcfbf8] p-5">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-accent" />
                  <p className="text-lg font-semibold tracking-[-0.04em] text-[var(--ink)]">
                    {item.title}
                  </p>
                </div>
                <p className="mt-3 text-[15px] leading-7 text-[var(--ink-tint)]">
                  {item.body}
                </p>
              </div>
            );
          })}
        </section>

        <section id="use-cases" className="mt-14 space-y-5">
          <div className="space-y-3">
            <p className="eyebrow">Use cases</p>
            <h2 className="section-title max-w-[8ch] text-[var(--ink)]">Where it helps.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-[rgba(23,19,41,0.1)] bg-white/94 p-6 shadow-panel"
              >
                <p className="text-xl font-semibold tracking-[-0.04em] text-[var(--ink)]">
                  {item.title}
                </p>
                <p className="mt-3 text-[15px] leading-7 text-[var(--ink-tint)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[rgba(23,19,41,0.08)] bg-white/72">
        <div className="section-shell flex flex-col gap-3 py-6 text-sm text-[var(--ink-tint)] sm:flex-row sm:items-center sm:justify-between">
          <p>One message, tuned for the room.</p>
          <p>
            Made by{" "}
            <a
              href="https://awaizahmed.com"
              target="_blank"
              rel="noreferrer noopener"
              className="font-semibold text-[var(--ink-tint-strong)] hover:text-[var(--ink)]"
            >
              Team Kanban
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
