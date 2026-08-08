"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { applyDirection } from "./apply-direction";
import {
  DEFAULT_LOCALE,
  directionForLocale,
  translate,
  type Locale,
  type TranslationKey,
} from "./translate";

const STORAGE_KEY = "pos-locale";

interface LocaleContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Reads the locale persisted by the no-flash init script (see
 * apply-direction usage in theme-script.tsx) so the first client render
 * matches what was already painted, avoiding a flicker.
 */
function readInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "ar" || stored === "en" ? stored : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

/**
 * Provides the current locale and a `t()` translator to the component
 * tree. Wrap the app root with this once; access it anywhere via
 * useTranslation(). Persists the choice to localStorage; syncing the
 * choice to the user's `profiles.locale` row happens where the language
 * switcher UI is added (not part of this infrastructure step).
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  useEffect(() => {
    applyDirection(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode) - locale still applies for this session.
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: directionForLocale(locale),
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
    }),
    [locale, setLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/** Access the current locale, direction, and translator from any client component. */
export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within LocaleProvider");
  return ctx;
}
