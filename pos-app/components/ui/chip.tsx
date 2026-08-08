import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * A content pill — a habit name, a tag, a filter value. Distinct from
 * Badge, which exists for status/counts (a number, a state word) rather
 * than a piece of content a user typed or chose. Two things in the app
 * were already reaching for this exact shape by hand (TodayFocus's
 * pending-habit pills, Knowledge Base's tag list) before this existed.
 */
export function Chip({
  active = false,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { active?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-full)] px-3 py-1 text-sm transition-colors duration-[var(--duration-fast)]",
        active
          ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
          : "bg-[var(--color-surface-hover)] text-[var(--color-text)]",
        className
      )}
      {...props}
    />
  );
}
