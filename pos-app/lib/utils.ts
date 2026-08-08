import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";

/** Merge conditional class names into a single string. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Inline style carrying the --delay custom property consumed by
 * .animate-home-fade-up (globals.css) — lets Home-screen sections stagger
 * their one-time entrance without a JS animation library.
 */
export function fadeDelay(ms: number): CSSProperties {
  return { "--delay": `${ms}ms` } as CSSProperties;
}

/** Format an ISO date string as a short, human-readable date. */
export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Format an ISO datetime as date + time. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Today as YYYY-MM-DD (local). */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Monday of the current week as YYYY-MM-DD. */
export function weekStartISO(d = new Date()): string {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  date.setDate(date.getDate() - day);
  return date.toISOString().slice(0, 10);
}

/** Generate a short unique id (for client-side list keys / routine steps). */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
