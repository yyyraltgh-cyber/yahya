import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

/**
 * Deliberately still a real <input type="checkbox"> — native keyboard
 * behavior (Space to toggle), native screen-reader semantics, and native
 * form participation, all for free. Only the visual layer changes:
 * accent-color for a themed check mark, a larger drawn box, and a padded
 * hit area (44px) around a visually smaller (20px) box, so the tap target
 * meets a comfortable minimum without the checkbox looking oversized next
 * to list text — the same problem the habit-toggle circle in
 * habit-list.tsx already solves with its own padding, applied here to
 * the other list screen (tasks) that was using a bare, tiny native box.
 */
export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <span className="-m-2.5 inline-flex h-11 w-11 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        className={cn(
          "checkbox-input focus-ring h-5 w-5 rounded-[var(--radius-sm)] border-2 border-[var(--color-border)]",
          "accent-[var(--color-primary)] transition-colors duration-[var(--duration-fast)]",
          className
        )}
        {...props}
      />
    </span>
  );
}
