"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "@/lib/utils";

export const ToggleGroup = ToggleGroupPrimitive.Root;

export function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full border border-transparent bg-white/78 px-4 py-2 text-sm font-medium text-[rgba(23,19,41,0.74)] transition hover:border-[rgba(23,19,41,0.1)] hover:bg-white hover:text-foreground data-[state=on]:border-[rgba(124,77,255,0.2)] data-[state=on]:bg-[rgba(124,77,255,0.12)] data-[state=on]:text-foreground data-[state=on]:shadow-[0_10px_24px_rgba(124,77,255,0.12)]",
        className,
      )}
      {...props}
    />
  );
}
