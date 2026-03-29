"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock3 } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { SearchInput } from "@/components/search-input";
import { useSessions } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import { SessionListCard } from "@/features/sessions/session-list-card";
import type { SessionKind } from "@/lib/types";

const filterOptions: Array<{ label: string; value: SessionKind | "all" }> = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Upload", value: "upload" },
  { label: "Demo", value: "demo" },
];

export function HistoryPage() {
  const { hydrated, sessions } = useSessions();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<SessionKind | "all">("all");

  const filteredSessions = sessions.filter((session) => {
    const matchesFilter = filter === "all" ? true : session.kind === filter;
    const matchesQuery = query.trim()
      ? `${session.title} ${session.subtitle}`.toLowerCase().includes(query.toLowerCase())
      : true;

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow">History</p>
          <h2 className="section-title">Previous sessions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Search, filter, and reopen past live sessions, uploads, and demos.
          </p>
        </div>
        <SearchInput
          className="w-full max-w-md"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sessions"
          value={query}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            onClick={() => setFilter(option.value)}
            variant={filter === option.value ? "default" : "outline"}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {!hydrated ? null : filteredSessions.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredSessions.map((session) => (
            <SessionListCard key={session.id} session={session} />
          ))}
        </div>
      ) : (
        <EmptyState
          action={
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/app/live">Start live session</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app/demo">Try sample demo</Link>
              </Button>
            </div>
          }
          description={
            query.trim()
              ? "Try a broader search term or remove a filter."
              : "Start a session and it will appear here with a saved recap."
          }
          icon={<Clock3 className="size-5" />}
          title={query.trim() ? "No search results" : "No sessions found"}
        />
      )}
    </div>
  );
}
