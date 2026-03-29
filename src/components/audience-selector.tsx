"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AUDIENCE_OPTIONS } from "@/lib/constants";
import type { AudienceMode } from "@/lib/types";

export function AudienceSelector({
  value,
  onValueChange,
}: {
  value: AudienceMode;
  onValueChange: (value: AudienceMode) => void;
}) {
  return (
    <ToggleGroup
      aria-label="Audience mode"
      className="flex flex-wrap gap-2"
      onValueChange={(nextValue) => {
        if (nextValue) {
          onValueChange(nextValue as AudienceMode);
        }
      }}
      type="single"
      value={value}
    >
      {AUDIENCE_OPTIONS.map((audience) => (
        <ToggleGroupItem key={audience.id} value={audience.id}>
          {audience.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
