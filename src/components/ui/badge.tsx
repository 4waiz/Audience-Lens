import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase",
  {
    variants: {
      variant: {
        default: "border-border bg-[#f4efff] text-foreground",
        accent: "border-accent/18 bg-accent/12 text-accent",
        live: "border-live/18 bg-live/12 text-live",
        success: "border-success/18 bg-success/10 text-success",
        warning: "border-warning/18 bg-warning/10 text-warning",
        danger: "border-danger/18 bg-danger/10 text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
