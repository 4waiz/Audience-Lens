import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SESSION_KIND_LABELS } from "@/lib/constants";
import type { SessionRecord } from "@/lib/types";
import { formatDateTimeLabel, formatDuration } from "@/lib/utils";

export function SessionListCard({ session }: { session: SessionRecord }) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusPill label={SESSION_KIND_LABELS[session.kind]} tone="accent" />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock3 className="size-3.5" />
            {formatDuration(session.durationMs)}
          </div>
        </div>
        <div>
          <CardTitle>{session.title}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">{session.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[20px] border border-border bg-muted/30 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Decisions
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {session.decisions.length}
            </p>
          </div>
          <div className="rounded-[20px] border border-border bg-muted/30 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Actions
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {session.actionItems.length}
            </p>
          </div>
          <div className="rounded-[20px] border border-border bg-muted/30 p-3">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Risks
            </p>
            <p className="mt-2 text-lg font-semibold text-foreground">
              {session.risks.length}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Updated {formatDateTimeLabel(session.updatedAt)}
          </p>
          <Button asChild variant="outline">
            <Link href={`/app/session/${session.id}`}>
              Open recap
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
