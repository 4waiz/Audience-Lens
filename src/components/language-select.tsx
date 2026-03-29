"use client";

import { ChevronDown } from "lucide-react";

import type { LanguageOption } from "@/lib/types";

export function LanguageSelect<TCode extends string>({
  value,
  onValueChange,
  options,
  placeholder,
}: {
  value: TCode;
  onValueChange: (value: TCode) => void;
  options: LanguageOption<TCode>[];
  placeholder: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <select
        className="h-11 w-full appearance-none rounded-2xl border border-border bg-card px-4 pr-10 text-sm text-foreground focus-visible:outline-none"
        onChange={(event) => onValueChange(event.target.value as TCode)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </label>
  );
}
