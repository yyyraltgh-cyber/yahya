import { en, type Dictionary } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";

export type Locale = "ar" | "en";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, ar };

export const DEFAULT_LOCALE: Locale = "ar";

/** Dot-notation key into the dictionary tree, e.g. "common.save". */
type DotPath<T, Prefix extends string = ""> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotPath<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type TranslationKey = DotPath<Dictionary>;

function getNested(dict: Dictionary, path: string): string | undefined {
  const parts = path.split(".");
  let node: unknown = dict;
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof node === "string" ? node : undefined;
}

/**
 * Translation service abstraction: looks up `key` in the dictionary for
 * `locale`, with `{placeholder}` interpolation from `vars`. Falls back to
 * the English string, then to the raw key, so a missing translation never
 * crashes the UI — it just surfaces visibly for a follow-up fix.
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const raw =
    getNested(DICTIONARIES[locale], key) ?? getNested(DICTIONARIES[DEFAULT_LOCALE], key) ?? getNested(en, key) ?? key;

  if (!vars) return raw;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
    raw
  );
}

/** Locales that read right-to-left. Extend here if more RTL locales are added. */
const RTL_LOCALES: ReadonlySet<Locale> = new Set(["ar"]);

export function directionForLocale(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
