import type { TranslationKey } from "@/lib/i18n/translate";
import type {
  Task,
  Habit,
  HabitLog,
  Routine,
  Review,
  LifeArea,
} from "@/lib/types/database";

/** Broad grouping used for icon/color choices and future filtering in the UI. */
export type SuggestionCategory = "task" | "habit" | "routine" | "review" | "streak" | "wellbeing";

/**
 * Where a suggestion's "act on it" button should take the user. Kept as
 * plain navigation for Phase 1 — richer actions (e.g. "log this habit
 * inline") can extend this union later without touching existing rules.
 */
export interface SuggestionAction {
  type: "navigate";
  href: string;
}

/**
 * A single generated suggestion. Rules never produce translated strings —
 * only translation keys + interpolation variables — so the engine stays
 * decoupled from the i18n runtime and remains a pure, hook-free module.
 */
export interface Suggestion {
  /** Stable, unique identifier for this suggestion instance (also the row
   * key in `dismissed_suggestions.suggestion_key`). Must be deterministic:
   * the same underlying condition always produces the same key. */
  key: string;
  category: SuggestionCategory;
  /** Higher = more urgent. Used by the priority engine for ordering. */
  priority: number;
  titleKey: TranslationKey;
  titleVars?: Record<string, string | number>;
  descriptionKey: TranslationKey;
  descriptionVars?: Record<string, string | number>;
  action: SuggestionAction;
}

/**
 * Everything a rule might need, pre-fetched by the caller (the
 * use-suggestions hook). Rules only read this — they never fetch data
 * themselves, which is what keeps them pure and unit-testable.
 */
export interface SuggestionContext {
  /** Current time, injected rather than read via `new Date()` inside rules,
   * so every rule is deterministic and testable with a fixed clock. */
  now: Date;
  tasks: Task[];
  habits: Habit[];
  habitLogs: HabitLog[];
  routines: Routine[];
  reviews: Review[];
  lifeAreas: LifeArea[];
  streak: {
    current: number;
    lastActivityDate: string | null;
  };
}

/** A rule is a pure function: context in, zero or more suggestions out. */
export type SuggestionRule = (context: SuggestionContext) => Suggestion[];

/**
 * Runs the given rules against the context and returns the flattened,
 * unfiltered, unsorted list of raw suggestions. Deliberately does NOT
 * dedupe dismissed suggestions or sort by priority — that is the priority
 * engine's job (see priority-engine.ts) — so this function's only
 * responsibility is "run whatever rules it's handed".
 *
 * Rules are passed in rather than imported here, by design: it keeps this
 * module fully decoupled from lib/suggestions/ (no circular dependency),
 * and makes the function trivially testable with a hand-picked rule subset.
 * The full, registered rule set lives in lib/suggestions/index.ts, which
 * depends on this file — never the other way around.
 */
export function generateSuggestions(
  context: SuggestionContext,
  rules: SuggestionRule[]
): Suggestion[] {
  return rules.flatMap((rule) => rule(context));
}
