"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { SearchInput } from "@/components/search-input";
import { StatusPill } from "@/components/status-pill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { TranscriptSegment } from "@/lib/types";
import { cn, formatTimestamp, getInitials } from "@/lib/utils";

function TranscriptSegmentCard({
  segment,
  selected,
  onSelect,
}: {
  segment: TranscriptSegment;
  selected: boolean;
  onSelect: () => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full rounded-[24px] border p-4 text-left transition focus-visible:outline-none",
        selected
          ? "border-accent/30 bg-[rgba(124,77,255,0.12)] shadow-panel"
          : "border-border bg-white hover:bg-[rgba(124,77,255,0.04)]",
      )}
      data-testid="transcript-segment"
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      onClick={onSelect}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(124,77,255,0.12)] text-xs font-semibold text-accent">
            {getInitials(segment.speaker)}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">{segment.speaker}</p>
            <p className="text-xs text-muted-foreground">{segment.speakerRole}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {formatTimestamp(segment.startMs)}
        </span>
      </div>
      <p className="text-sm leading-7 text-foreground">{segment.text}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {segment.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[rgba(23,19,41,0.08)] bg-[rgba(237,232,248,0.62)] px-2.5 py-1 text-[11px] font-medium text-[rgba(23,19,41,0.72)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

export function TranscriptStream({
  displayedSegments,
  selectedSegmentId,
  onSelectSegment,
  searchValue,
  onSearchChange,
  running,
}: {
  displayedSegments: TranscriptSegment[];
  selectedSegmentId?: string;
  onSelectSegment: (id: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  running: boolean;
}) {
  const filteredSegments = displayedSegments.filter((segment) => {
    if (!searchValue.trim()) {
      return true;
    }

    const query = searchValue.toLowerCase();

    return (
      segment.text.toLowerCase().includes(query) ||
      segment.speaker.toLowerCase().includes(query) ||
      segment.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <Card className="min-h-[580px]">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Live transcript</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep the original words visible while Common Ground clarifies meaning.
            </p>
          </div>
          <StatusPill label={running ? "Updating live" : "Replay ready"} tone={running ? "live" : "default"} />
        </div>
        <SearchInput
          aria-label="Search transcript"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search speakers, phrases, or tags"
          value={searchValue}
        />
      </CardHeader>
      <CardContent className="pb-4">
        <div aria-live="polite" className="sr-only">
          {displayedSegments.length} transcript segments available
        </div>
        {displayedSegments.length === 0 ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : filteredSegments.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-border bg-[rgba(237,232,248,0.28)] p-8 text-center">
            <p className="text-base font-medium text-foreground">No transcript matches</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different speaker name, topic, or keyword.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[440px] pr-3">
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {filteredSegments.map((segment) => (
                  <TranscriptSegmentCard
                    key={segment.id}
                    onSelect={() => onSelectSegment(segment.id)}
                    segment={segment}
                    selected={segment.id === selectedSegmentId}
                  />
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
