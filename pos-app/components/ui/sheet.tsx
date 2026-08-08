"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A bottom sheet: scrim + a panel that slides up from the bottom edge,
 * capped at a max height with internal scroll. Distinct from Dialog —
 * a Dialog interrupts (centered, small, decision-focused); a Sheet
 * extends the page upward (anchored to an edge, can hold a full section
 * of content). Use Dialog for a confirmation, Sheet for "more detail
 * about what's already on screen."
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="animate-scrim-in fixed inset-0 bg-black/40"
      style={{ zIndex: "var(--z-overlay)" } as CSSProperties}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="glass-surface animate-sheet-in focus-ring absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-[var(--radius-card)] border-t border-[var(--color-border)] shadow-[var(--elevation-card)]"
        style={{ zIndex: "var(--z-sheet)" } as CSSProperties}
      >
        <div className="flex justify-center pt-3">
          <span className="h-1 w-10 rounded-full bg-[var(--color-border)]" aria-hidden="true" />
        </div>
        {title && (
          <h2 id={titleId} className="px-5 pt-2 text-base font-semibold">
            {title}
          </h2>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
