import type { Suggestion } from "./suggestion-engine";

const DEFAULT_MAX_RESULTS = 6;

/**
 * Takes the raw, unfiltered output of generateSuggestions() and turns it
 * into what the UI should actually show:
 *   1. Drop anything the user already dismissed.
 *   2. Sort by priority, descending (ties broken by `key` for a stable,
 *      deterministic order — never relies on array insertion order alone).
 *   3. Cap to `maxResults` so the user is never shown an overwhelming list.
 *
 * Kept separate from suggestion-engine.ts so "which rules fired" and "what
 * we actually surface" can evolve independently — e.g. future work like
 * per-category caps or A/B-testable ranking only ever touches this file.
 */
export function prioritizeSuggestions(
  suggestions: Suggestion[],
  dismissedKeys: ReadonlySet<string>,
  maxResults: number = DEFAULT_MAX_RESULTS
): Suggestion[] {
  return suggestions
    .filter((s) => !dismissedKeys.has(s.key))
    .sort((a, b) => b.priority - a.priority || a.key.localeCompare(b.key))
    .slice(0, maxResults);
}
