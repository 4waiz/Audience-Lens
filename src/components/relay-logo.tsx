import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

export function RelayLogo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-4", className)}>
      <Image
        src="/icon.svg"
        alt=""
        aria-hidden
        width={60}
        height={60}
        className="size-14 rounded-[20px] border border-[rgba(124,77,255,0.22)] bg-white object-contain shadow-[0_14px_34px_rgba(91,45,225,0.16)]"
        priority
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-lg font-semibold tracking-[-0.04em] text-[var(--ink)]">
          Common Ground
        </span>
        <span className="text-[13px] text-[rgba(23,19,41,0.74)]">
          Speak once. Meet people where they are.
        </span>
      </span>
    </Link>
  );
}
