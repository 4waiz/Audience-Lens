"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export function WaveformIndicator({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("flex items-center gap-1", className)} aria-hidden>
      {[0, 1, 2, 3].map((index) => (
        <motion.span
          key={index}
          animate={
            active && !prefersReducedMotion
              ? { scaleY: [0.45, 1, 0.55, 0.8] }
              : { scaleY: 0.45 }
          }
          className="block h-4 w-1 origin-center rounded-full bg-live"
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: active ? Number.POSITIVE_INFINITY : 0,
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  );
}
