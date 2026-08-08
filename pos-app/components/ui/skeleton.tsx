import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * A single skeleton placeholder block. Composable — build layouts (rows,
 * circles, cards) by combining instances rather than adding shape props.
 * Uses the .animate-skeleton-shimmer utility (globals.css), which already
 * respects prefers-reduced-motion.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-skeleton-shimmer rounded-[var(--radius-sm)]", className)}
      {...props}
    />
  );
}
