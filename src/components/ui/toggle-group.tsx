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
        "inline-flex min-h-10 items-center justify-center rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition data-[state=on]:border-border data-[state=on]:bg-card data-[state=on]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
