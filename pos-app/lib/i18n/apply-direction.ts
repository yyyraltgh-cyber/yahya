import { directionForLocale, type Locale } from "./translate";

/**
 * Applies `dir` and `lang` to <html> for the given locale. Client-only
 * (guards for a missing `document`, e.g. during any future SSR usage).
 * Shared by the no-flash init script logic and the runtime LocaleProvider,
 * so both paths stay in sync.
 */
export function applyDirection(locale: Locale): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dir = directionForLocale(locale);
  root.lang = locale;
}
