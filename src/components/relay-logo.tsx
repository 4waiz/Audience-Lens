import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function RelayLogo({
  href = "/",
  className,
  tone = "light",
  showTagline = true,
}: {
  href?: string;
  className?: string;
  tone?: "light" | "dark";
  showTagline?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src="/icon.svg"
        alt=""
        aria-hidden
        width={48}
        height={48}
        className="size-11 rounded-[16px] border border-[rgba(124,77,255,0.2)] bg-white object-contain shadow-[0_12px_28px_rgba(91,45,225,0.14)]"
        priority
      />
      <span className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-base font-semibold tracking-[-0.04em]",
            tone === "dark" ? "text-white" : "text-[var(--ink)]",
          )}
        >
          Common Ground
        </span>
        <span
          className={cn(
            "text-[13px]",
            showTagline ? "hidden sm:block" : "hidden",
            tone === "dark" ? "text-white/72" : "text-[rgba(23,19,41,0.74)]",
          )}
        >
          Speak once. Meet people where they are.
        </span>
      </span>
    </Link>
  );
}
