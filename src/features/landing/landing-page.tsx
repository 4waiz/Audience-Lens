import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  Languages,
  ListChecks,
  Mic,
  Radio,
} from "lucide-react";

import { RelayLogo } from "@/components/relay-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_SESSION } from "@/lib/demo-data";

import { LandingPreview } from "@/features/landing/landing-preview";

const problems = [
  {
    title: "Too much jargon",
    body: "People speak in shortcuts, acronyms, and internal language that others do not share.",
  },
  {
    title: "Wrong explanation for the audience",
    body: "The same sentence should sound different to a client, an executive, a new hire, or a non-native speaker.",
  },
  {
    title: "Meetings end without clear actions",
    body: "Important decisions and owners get lost unless someone manually cleans up notes afterward.",
  },
];

const features = [
  "Live transcript",
  "Audience mode",
  "Plain-English rewrite",
  "Decisions + actions",
  "Export recap",
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="page-shell flex items-center justify-between py-6">
        <RelayLogo />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="#how-it-works">How it works</Link>
          <Link href="#example">Example</Link>
          <Link href="/app/history">History</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button asChild variant="outline">
            <Link href="/app">Continue as guest</Link>
          </Button>
        </div>
      </header>

      <main className="page-shell pb-20">
        <section className="grid gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-16">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="eyebrow">Real-time communication adaptation</p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl xl:text-[3.5rem]">
                Speak normally. Relay makes it understandable.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Relay listens to what someone is saying in a meeting or presentation
                and turns it into clearer words for the people listening.
              </p>
              <p className="max-w-2xl text-base text-muted-foreground">
                It helps people understand each other better in real time. Then it
                turns the conversation into a short recap with decisions and action
                items.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/app/demo">
                  Try sample demo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/app/live">
                  <Mic className="size-4" />
                  Start live session
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/app/upload">
                  <FileUp className="size-4" />
                  Upload recording
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Live transcript</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  See speech as text while Relay keeps the original source visible.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Audience adaptation</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Switch between executive, client, engineer, new hire, and clear-language views.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Traceable recap</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Decisions, owners, and blockers link back to the transcript lines that support them.
                </CardContent>
              </Card>
            </div>
          </div>

          <LandingPreview />
        </section>

        <section className="grid gap-4 py-12 md:grid-cols-3">
          {problems.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="surface mb-12 grid gap-4 p-6 md:grid-cols-5">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-3 rounded-[22px] bg-card/70 px-4 py-4">
              <CheckCircle2 className="size-4 text-accent" />
              <span className="text-sm font-medium text-foreground">{feature}</span>
            </div>
          ))}
        </section>

        <section className="py-12" id="how-it-works">
          <div className="mb-8">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 section-title">Three steps from confusion to clarity</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <Radio className="size-5" />
                </div>
                <CardTitle className="mt-4">1. Capture the conversation</CardTitle>
                <CardDescription>
                  Start a live session or upload a recording. Relay shows the original
                  transcript as the conversation unfolds.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <Languages className="size-5" />
                </div>
                <CardTitle className="mt-4">2. Adapt it for the audience</CardTitle>
                <CardDescription>
                  Relay rewrites jargon into plain language and reframes the same idea
                  for the person hearing it.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                  <ListChecks className="size-5" />
                </div>
                <CardTitle className="mt-4">3. Share the async recap</CardTitle>
                <CardDescription>
                  Decisions, action items, risks, and follow-ups are grouped into a
                  clean recap you can export or copy into Slack and email.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 py-12 lg:grid-cols-[0.9fr_1.1fr]" id="example">
          <Card className="h-full">
            <CardHeader>
              <p className="eyebrow">Before</p>
              <CardTitle>{DEMO_SESSION.transcript[1].text}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="h-full border-accent/20 bg-accent/8">
            <CardHeader>
              <p className="eyebrow text-accent">After</p>
              <CardTitle>
                {DEMO_SESSION.transcript[1].audienceVersions.client}
              </CardTitle>
              <CardDescription>
                If someone says something too technical, Relay changes it into something
                a client, manager, new hire, or non-native speaker can understand.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        <section className="surface mt-12 overflow-hidden p-8 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow">Ready to demo</p>
              <h2 className="mt-3 section-title">
                It takes confusing communication and makes it clear, live.
              </h2>
              <p className="mt-3 max-w-2xl text-base text-muted-foreground">
                Open the sample workspace and the product explains itself in seconds.
                No account, no keys, no setup wall.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/app/demo">Try sample demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/app/live">Start live session</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="page-shell flex flex-col gap-4 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>Relay turns speech into audience-safe understanding and a usable recap.</p>
        <div className="flex items-center gap-4">
          <Link href="/app/demo">Demo</Link>
          <Link href="/app/live">Live</Link>
          <Link href="/app/settings">Settings</Link>
        </div>
      </footer>
    </div>
  );
}
