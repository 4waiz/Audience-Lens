import Link from "next/link";
import { RadioTower } from "lucide-react";

import { cn } from "@/lib/utils";

export function RelayLogo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <span className="flex size-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-panel">
        <RadioTower className="size-5" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold tracking-[0.18em] text-foreground">
          RELAY
        </span>
        <span className="text-xs text-muted-foreground">Audience adaptation</span>
      </span>
    </Link>
  );
}
