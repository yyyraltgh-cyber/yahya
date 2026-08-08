import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

/**
 * A real <input type="checkbox"> under the hood — same reasoning as
 * Checkbox: native keyboard/screen-reader behavior for free, only the
 * visual layer is custom. role="switch" (via the browser's native
 * mapping for a labeled checkbox styled as a toggle) plus aria-checked
 * mirrors give assistive tech the correct semantics of "on/off," not
 * "checked/unchecked."
 *
 * Micro-Interaction Audit fix: the visible label previously carried the
 * plain `focus-ring` utility, but that class's CSS matches
 * `:focus-visible` on the element it's applied to — and the actually
 * focusable element here is the input, hidden via `sr-only`. A `<label>`
 * is never itself a focus target, so the ring never fired: keyboard
 * users tabbing to this control saw no focus indicator at all. Fixed via
 * Tailwind's `peer-focus-visible:` variant on the track span (the one
 * covering the full switch shape via inset-0 — not the thumb), applying
 * the exact same box-shadow `.focus-ring:focus-visible` uses elsewhere
 * in the app, so the visual result is identical everywhere, not a new,
 * differently-tuned ring.
 */
export function Switch({
  checked,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-[var(--radius-full)]">
      <input type="checkbox" checked={checked} className="peer sr-only" {...props} />
      <span
        className={cn(
          "absolute inset-0 rounded-[var(--radius-full)] transition-colors duration-[var(--duration-fast)]",
          "bg-[var(--color-border)] peer-checked:bg-[var(--color-primary)]",
          "peer-focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]",
          className
        )}
        aria-hidden="true"
      />
      <span
        className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-[var(--duration-fast)] peer-checked:translate-x-5 rtl:peer-checked:-translate-x-5"
        aria-hidden="true"
      />
    </label>
  );
}
