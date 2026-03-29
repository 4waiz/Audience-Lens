"use client";

import Link from "next/link";
import { FileUp, Lightbulb, Mic, PlayCircle, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { useSessions } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionListCard } from "@/features/sessions/session-list-card";

const actions = [
  {
    href: "/app/live",
    title: "Start live session",
    description: "Open the real-time workspace with microphone preflight and instant audience adaptation.",
    icon: Mic,
  },
  {
    href: "/app/demo",
    title: "Try sample demo",
    description: "See the full product story in seconds with a realistic preloaded session.",
    icon: PlayCircle,
  },
  {
    href: "/app/upload",
    title: "Upload recording",
    description: "Process an audio or video file into a recap with traceable transcript evidence.",
    icon: FileUp,
  },
];

export function DashboardHome() {
  const { hydrated, sessions } = useSessions();
  const recentSessions = sessions.slice(0, 3);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="app-gradient">
          <CardHeader>
            <p className="eyebrow">Welcome</p>
            <CardTitle className="text-3xl">Control center</CardTitle>
            <CardDescription className="max-w-2xl">
              Start with the sample demo if you want the fastest path. Use live mode
              when you want to show the preflight and microphone experience as well.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.href}
                  className="rounded-[24px] border border-border bg-card/80 p-5 transition hover:bg-card"
                  href={action.href}
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/12 text-accent">
                    <Icon className="size-5" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-foreground">
                    {action.title}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Helpful tips</CardTitle>
            <CardDescription>
              Keep the demo path fast and the output reviewable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[22px] border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="size-4 text-accent" />
                Choose the audience first
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Executive mode surfaces outcomes and risk. Client mode reduces internal
                jargon. New hire mode adds context.
              </p>
            </div>
            <div className="rounded-[22px] border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Lightbulb className="size-4 text-warning" />
                Use the sample demo if the microphone is blocked
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Judges still see the full story: transcript, adaptation, decisions,
                action items, and export.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Recent sessions</p>
            <h2 className="section-title">Latest recaps</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/app/history">View all</Link>
          </Button>
        </div>

        {!hydrated ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <Card key={index}>
                <CardContent className="h-52 p-6" />
              </Card>
            ))}
          </div>
        ) : recentSessions.length ? (
          <div className="grid gap-4 xl:grid-cols-3">
            {recentSessions.map((session) => (
              <SessionListCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <EmptyState
            action={
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/app/demo">Try sample demo</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/app/live">Start live session</Link>
                </Button>
              </div>
            }
            description="You have not saved any sessions yet. Start with the sample demo for the fastest walkthrough."
            icon={<PlayCircle className="size-5" />}
            title="No sessions yet"
          />
        )}
      </section>
    </div>
  );
}
