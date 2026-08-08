"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "./button";
import { useTranslation } from "@/lib/i18n/locale-context";

/**
 * Generic modal shell. Not portaled (React.createPortal) — deliberately
 * simple: `position: fixed` escapes normal document flow on its own for
 * every real call site in this app, and adding a portal is complexity
 * this component doesn't need yet. Escape and click-on-scrim both close;
 * click on the panel itself never bubbles to the scrim.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const titleId = useId();
  const descId = useId();
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
      className="animate-scrim-in fixed inset-0 flex items-center justify-center bg-black/40 p-6"
      style={{ zIndex: "var(--z-dialog)" } as CSSProperties}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="glass-surface animate-dialog-in focus-ring w-full max-w-sm rounded-[var(--radius-card)] border border-[var(--color-border)] p-5 shadow-[var(--elevation-card)]"
      >
        <h2 id={titleId} className="text-base font-semibold">
          {title}
        </h2>
        {description && (
          <p id={descId} className="text-subtitle mt-1">
            {description}
          </p>
        )}
        {children && <div className="mt-3">{children}</div>}
        {footer && <div className="mt-5 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * The concrete, immediately-useful case: a destructive-action
 * confirmation. Closes the "one accidental tap permanently deletes"
 * gap flagged across Tasks/Habits/Routines/Notes/Reviews/Calendar.
 */
export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title ?? t("common.deleteConfirmTitle")}
      description={description ?? t("common.deleteConfirmBody")}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
          >
            {t("common.delete")}
          </Button>
        </>
      }
    />
  );
}
