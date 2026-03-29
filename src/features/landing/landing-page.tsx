import Link from "next/link";
import { ArrowRight, Mic, PlayCircle } from "lucide-react";

import { RelayLogo } from "@/components/relay-logo";
import { Button } from "@/components/ui/button";
import { AUDIENCE_OPTIONS } from "@/lib/constants";

import { LandingPreview } from "@/features/landing/landing-preview";

const valuePillars = [
  {
    number: "01",
    title: "Clarify",
    body: "Capture what was actually said so the original meaning never disappears behind a rewrite.",
  },
  {
    number: "02",
    title: "Adapt",
    body: "Switch the explanation for executives, clients, engineers, new hires, or non-native speakers in one click.",
  },
  {
    number: "03",
    title: "Align",
    body: "Turn the conversation into a recap with summary, decisions, action items, and supporting context.",
  },
];

const steps = [
  {
    number: "01",
    title: "Capture what was said",
    body: "Use live speech capture when the browser supports it, or start from a ready-made sample scenario instantly.",
  },
  {
    number: "02",
    title: "Rewrite for who is listening",
    body: "Keep the original sentence visible while Common Ground reframes it for the people in the room.",
  },
  {
    number: "03",
    title: "Turn conversation into recap and action items",
    body: "Leave the meeting with a grounded summary, explicit decisions, and clear next steps tied to the transcript.",
  },
];

const useCases = [
  "Client calls",
  "Onboarding",
  "Project handoffs",
  "Leadership updates",
  "Demos and presentations",
];

const proofPoints = [
  "People do not struggle because the message is missing. They struggle because the message is framed for the wrong listener.",
  "Common Ground solves that in real time by keeping the source visible and adapting the explanation without changing the core meaning.",
  "That makes the product instantly legible in a demo: speech in, clearer audience-ready explanation out, then a recap you can actually use.",
];

export function LandingPage() {
  return (
    <div className="bg-[var(--bg-light)] text-foreground">
      <div className="border-b border-[var(--line-dark)] bg-[rgba(124,77,255,0.18)]">
        <div className="section-shell flex min-h-11 items-center justify-center text-center text-[13px] font-medium text-[var(--ink)]">
          Built for clearer communication in meetings, demos, and onboarding
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--line-dark)] bg-[rgba(252,251,248,0.94)] shadow-[0_10px_24px_rgba(23,19,41,0.04)] backdrop-blur">
        <div className="page-shell flex items-center justify-between gap-4 py-4">
          <RelayLogo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-[rgba(23,19,41,0.74)] lg:flex">
            <Link href="#how-it-works" className="hover:text-foreground">
              How it works
            </Link>
            <Link href="#audience-modes" className="hover:text-foreground">
              Audience modes
            </Link>
            <Link href="#use-cases" className="hover:text-foreground">
              Use cases
            </Link>
            <Link href="#demo" className="hover:text-foreground">
              Demo
            </Link>
            <Link href="#about" className="hover:text-foreground">
              About
            </Link>
          </nav>
          <Button asChild size="sm" className="min-w-[122px]">
            <Link href="#demo">Try demo</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-[var(--line-dark)]">
          <div className="absolute inset-0 grid-fade" />
          <div className="page-shell relative grid gap-10 py-12 lg:grid-cols-[minmax(0,0.96fr)_minmax(520px,1.04fr)] lg:items-start lg:py-16 xl:gap-12">
            <div className="space-y-7 pt-4 lg:max-w-none lg:pt-10">
              <div className="space-y-5">
                <p className="eyebrow">Real-time communication adaptation</p>
                <h1 className="max-w-[10.5ch] text-[var(--ink)] lg:text-[5.25rem] xl:text-[5.9rem]">
                  Speak once. Meet people <span className="capsule-outline">where they are.</span>
                </h1>
                <p className="max-w-xl body-large">
                  Common Ground listens to what someone is saying in a meeting or presentation and turns it into clearer words for the people listening.
                </p>
                <p className="max-w-xl text-base leading-7 text-[rgba(23,19,41,0.76)]">
                  It keeps the original meaning visible, adapts the explanation for the selected audience, and ends with a recap you can actually use.
                </p>
              </div>

              <div className="flex flex-wrap gap-3.5">
                <Button asChild size="lg">
                  <Link href="/app/demo">
                    <PlayCircle className="size-4" />
                    Try sample demo
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/app/live">
                    <Mic className="size-4" />
                    Start live session
                  </Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="#how-it-works">
                    View how it works
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-3">
                <div className="rounded-[30px] border border-border bg-white p-5 shadow-panel">
                  <p className="eyebrow">Live transcript</p>
                  <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                    See speech as text while the original source stays visible.
                  </p>
                </div>
                <div className="rounded-[30px] border border-border bg-white p-5 shadow-panel">
                  <p className="eyebrow">Audience adaptation</p>
                  <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                    Switch between executive, client, engineer, new hire, and clear-language views.
                  </p>
                </div>
                <div className="rounded-[30px] border border-border bg-white p-5 shadow-panel">
                  <p className="eyebrow">Traceable recap</p>
                  <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                    Summary, decisions, and action items stay tied to what was actually said.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:pt-2">
              <LandingPreview />
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--line-dark)] bg-[var(--bg-light)] py-16 lg:py-20" id="about">
          <div className="section-shell">
            <div className="max-w-3xl space-y-4">
              <p className="inline-flex rounded-full border border-[rgba(124,77,255,0.22)] bg-[rgba(124,77,255,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Values
              </p>
              <h2 className="section-title max-w-[10ch]">Turn technical talk into shared understanding.</h2>
              <p className="max-w-2xl text-base leading-7 text-[rgba(23,19,41,0.76)]">
                Common Ground is narrow by design. It helps one person explain one thing clearly to different listeners, then turns that conversation into a recap the team can act on.
              </p>
            </div>

            <div className="mt-10">
              {valuePillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="grid gap-5 border-t border-[var(--line-dark)] py-7 lg:grid-cols-[160px_minmax(0,280px)_1fr] lg:py-8"
                >
                  <p className="text-4xl font-semibold tracking-[-0.05em] text-accent">
                    {pillar.number}
                  </p>
                  <h3 className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="max-w-2xl text-base leading-7 text-[rgba(23,19,41,0.76)]">{pillar.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--line-light)] bg-[var(--bg-dark)] py-16 text-white lg:py-20" id="how-it-works">
          <div className="absolute hidden" aria-hidden />
          <div className="section-shell space-y-10">
            <div className="max-w-3xl space-y-4">
              <p className="eyebrow text-white/72">How it works</p>
              <h2 className="section-title text-white">Say it once. Make it make sense.</h2>
              <p className="max-w-2xl text-base leading-7 text-white/82">
                The product flow is deliberately simple so the demo lands fast: transcript first, adaptation second, recap third.
              </p>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-[32px] border border-[var(--line-light)] bg-[rgba(255,255,255,0.05)] p-6"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--purple-soft)]">
                    {step.number}
                  </p>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/80">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--line-dark)] py-16 lg:py-20" id="audience-modes">
          <div className="section-shell">
            <div className="max-w-3xl space-y-4">
              <p className="eyebrow">Audience modes</p>
              <h2 className="section-title">Keep the original meaning visible while adapting the explanation for who is in the room.</h2>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {AUDIENCE_OPTIONS.map((mode) => (
                <div key={mode.id} className="rounded-[30px] border border-border bg-white p-6 shadow-panel">
                  <p className="inline-flex rounded-full border border-[rgba(124,77,255,0.24)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
                    {mode.label}
                  </p>
                  <p className="mt-5 text-base font-semibold text-foreground">
                    {mode.description}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[rgba(23,19,41,0.76)]">
                    Common Ground changes vocabulary, framing, and level of detail instead of making cosmetic wording swaps.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--line-light)] bg-[var(--bg-dark)] py-16 lg:py-20" id="use-cases">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div className="space-y-4">
              <p className="eyebrow text-white/72">Use cases</p>
              <h2 className="section-title text-white">Clear communication matters most when different people hear the same meeting in different ways.</h2>
              <p className="max-w-xl text-base leading-7 text-white/82">
                Common Ground is most useful in the moments where the room is mixed: technical and non-technical, internal and external, experienced and new.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {useCases.map((item, index) => (
                <div
                  key={item}
                  className="rounded-[32px] border border-[var(--line-light)] bg-[rgba(255,255,255,0.05)] p-6"
                >
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--purple-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-white">
                    {item}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/80">
                    Use one explanation, then switch the framing so every listener gets the version that makes sense to them.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[var(--line-dark)] py-16 lg:py-20" id="demo">
          <div className="section-shell space-y-6">
            <div className="max-w-3xl space-y-4">
              <p className="eyebrow">Interactive demo</p>
              <h2 className="section-title">The transformation is the product.</h2>
              <p className="max-w-2xl text-base leading-7 text-[rgba(23,19,41,0.76)]">
                Switch the scenario. Switch the audience. Watch the same explanation become clearer for the person listening, then review the recap below it.
              </p>
            </div>
            <LandingPreview variant="full" />
          </div>
        </section>

        <section className="bg-[var(--bg-dark)] py-16 lg:py-20" id="proof">
          <div className="section-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <p className="eyebrow text-white/72">Why it matters</p>
              <h2 className="section-title text-white">The communication problem is obvious. The fix should be too.</h2>
            </div>
            <div className="space-y-4">
              {proofPoints.map((point) => (
                <div key={point} className="rounded-[28px] border border-[var(--line-light)] bg-[rgba(255,255,255,0.05)] p-5 text-sm leading-7 text-white/82">
                  {point}
                </div>
              ))}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <Link href="/app/demo">Try sample demo</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/24 bg-white/6 text-white hover:bg-white/12">
                  <Link href="/app/live">Start live session</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line-dark)] bg-[var(--bg-light)]">
        <div className="page-shell flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Made by <a href="https://awaizahmed.com" target="_blank" rel="noreferrer noopener" className="underline underline-offset-4">Team Kanban</a></p>
            <p className="text-sm text-[rgba(23,19,41,0.76)]">
              Common Ground turns live speech into audience-ready understanding and a traceable recap.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[rgba(23,19,41,0.72)]">
            <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
            <Link href="#audience-modes" className="hover:text-foreground">Audience modes</Link>
            <Link href="#demo" className="hover:text-foreground">Demo</Link>
            <Link href="/app/live" className="hover:text-foreground">Start live session</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
