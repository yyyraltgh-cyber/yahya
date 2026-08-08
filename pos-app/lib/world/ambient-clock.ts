/**
 * Release 2 — World Integration. Deliberately duplicates the exact
 * NIGHT_START_HOUR/NIGHT_END_HOUR thresholds from lib/garden/use-garden.ts
 * rather than importing/refactoring that hook — useGarden is approved,
 * working business logic and Release 2 explicitly does not touch it. This
 * is a tiny, independent, pure function so the rest of the app can share
 * the same day/night rhythm the Garden already uses, without the Garden's
 * own hook taking on a new responsibility it wasn't built for.
 */
export type AmbientPeriod = "day" | "night";

const NIGHT_START_HOUR = 20; // 8pm — matches useGarden exactly
const NIGHT_END_HOUR = 5; // 5am — matches useGarden exactly

export function getAmbientPeriod(hour: number = new Date().getHours()): AmbientPeriod {
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR ? "night" : "day";
}
