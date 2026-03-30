import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneMap = {
  default: "default",
  accent: "accent",
  live: "live",
  success: "success",
  warning: "warning",
  danger: "danger",
} as const;

export function StatusPill({
  label,
  tone = "default",
  showDot = true,
}: {
  label: string;
  tone?: keyof typeof toneMap;
  showDot?: boolean;
}) {
  const dotClassName = {
    default: "bg-muted-foreground",
    accent: "bg-accent",
    live: "bg-live",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[tone];

  return (
    <Badge variant={toneMap[tone]}>
      {showDot ? <span className={cn("status-dot", dotClassName)} aria-hidden /> : null}
      {label}
    </Badge>
  );
}
