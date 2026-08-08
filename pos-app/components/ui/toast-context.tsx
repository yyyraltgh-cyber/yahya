"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type ToastTone = "default" | "success" | "danger";

interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const DISMISS_AFTER_MS = 3200;

const toneClasses: Record<ToastTone, string> = {
  default: "border-[var(--color-border)]",
  success: "border-[var(--color-success)]",
  danger: "border-[var(--color-danger)]",
};

/**
 * Mounted once, high in the tree (AppShell), so any screen can call
 * useToast().show(...) — this is what closes the "Settings saves
 * silently" gap and every other save action that currently has no
 * feedback at all.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  // AppShell (and this provider along with it) unmounts on every page
  // navigation in this app — a toast's auto-dismiss timer can easily
  // still be pending when that happens. Guards the setState below
  // against firing after unmount; doesn't change dismiss timing for the
  // normal case at all.
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const show = useCallback((message: string, tone: ToastTone = "default") => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      if (mountedRef.current) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    }, DISMISS_AFTER_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 flex flex-col items-center gap-2 px-4 sm:bottom-6"
        style={{ zIndex: "var(--z-toast)" } as CSSProperties}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`animate-toast-in glass-surface pointer-events-auto rounded-[var(--radius-md)] border px-4 py-2.5 text-sm shadow-[var(--elevation-card)] ${toneClasses[toast.tone]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
