"use client";

import { ChevronDown, ShieldAlert } from "lucide-react";

import { StatusPill } from "@/components/status-pill";
import { Card } from "@/components/ui/card";
import type { SessionRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export function InsightsTray({
  open,
  onToggle,
  session,
}: {
  open: boolean;
  onToggle: () => void;
  session: SessionRecord;
}) {
  return (
    <Card className="overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-6 py-4 text-left"
        onClick={onToggle}
        type="button"
      >
        <div>
          <p className="text-base font-semibold text-foreground">Recap</p>
          <p className="text-sm text-muted-foreground">
            Decisions, action items, blockers, and follow-ups update as evidence arrives.
          </p>
        </div>
        <ChevronDown
          className={cn("size-5 text-muted-foreground transition", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="grid gap-4 border-t border-border px-6 py-6 lg:grid-cols-4">
          <div className="space-y-3">
            <StatusPill label={`${session.decisions.length} decisions`} tone="accent" />
            {session.decisions.length ? (
              session.decisions.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-border bg-[#faf9f7] p-4">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm text-[rgba(23,19,41,0.76)]">{item.body}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-border bg-white/80 p-4 text-sm text-[rgba(23,19,41,0.76)]">
                Decisions will appear here as the session progresses.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <StatusPill label={`${session.actionItems.length} actions`} tone="success" />
            {session.actionItems.length ? (
              session.actionItems.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-border bg-[#faf9f7] p-4">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm text-[rgba(23,19,41,0.76)]">
                    {item.owner} - {item.dueDate}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-border bg-white/80 p-4 text-sm text-[rgba(23,19,41,0.76)]">
                Action items will appear here when Common Ground detects owners and next steps.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <StatusPill label={`${session.risks.length} risks`} tone="warning" />
            {session.risks.length ? (
              session.risks.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-border bg-[#faf9f7] p-4">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm text-[rgba(23,19,41,0.76)]">{item.body}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-border bg-white/80 p-4 text-sm text-[rgba(23,19,41,0.76)]">
                Risks and blockers will appear here if Common Ground detects them.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <StatusPill label={`${session.followUps.length} follow-ups`} tone="default" />
            {session.followUps.length ? (
              session.followUps.map((item) => (
                <div key={item.id} className="rounded-[20px] border border-border bg-[#faf9f7] p-4">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm text-[rgba(23,19,41,0.76)]">{item.owner}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[20px] border border-dashed border-border bg-white/80 p-4 text-sm text-[rgba(23,19,41,0.76)]">
                Follow-ups will appear here when there is unresolved work to track.
              </div>
            )}
          </div>
        </div>
      ) : null}
      {!session.decisions.length && !session.actionItems.length && !session.risks.length ? (
        <div className="border-t border-border px-6 py-4 text-sm text-[rgba(23,19,41,0.76)]">
          <div className="inline-flex items-center gap-2">
            <ShieldAlert className="size-4 text-[rgba(23,19,41,0.72)]" />
            Common Ground needs a little more transcript evidence before it can surface recap items.
          </div>
        </div>
      ) : null}
    </Card>
  );
}
