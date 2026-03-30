"use client";

import { cn } from "@/lib/utils";

export function ScrollArea({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("overflow-auto pr-1", className)} {...props}>
      {children}
    </div>
  );
}
