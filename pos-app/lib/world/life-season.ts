/**
 * Release 5B — Life Seasons.
 *
 * Not calendar-based, and not built from anything new: every input here
 * is a value some earlier release already computed for a different
 * purpose (currentStreak from GamificationProvider, familiarityFactor
 * from useWorldHistory/garden_snapshots, legacyTier from
 * useWorldLegacy/user_achievements). This file only combines them —
 * zero new Supabase queries, zero new tables, zero new business logic.
 *
 * Two continuous axes, the same discipline Earth Seasons (5A) used
 * instead of four hand-tuned discrete states:
 *
 *  - rootedness (0-1): how much of a track record this account has —
 *    a blend of long-run history (familiarity) and rare foundational
 *    moments (legacy). Moves slowly by construction, since both of its
 *    inputs already move slowly.
 *  - momentum (0-1): how active the CURRENT stretch is — built from
 *    currentStreak, which can only change by one day at a time and
 *    therefore already can't react to a single good or bad day
 *    (Objective 2 is satisfied by the shape of the underlying data,
 *    not by extra smoothing bolted on here).
 *
 * `label` (Renewal / Growth / Stability / Recovery / Reflection) exists
 * only as an internal reference point for future readers of this code —
 * exactly like Earth Season's own `label` — never rendered, never
 * branched on by any visual component.
 */
export type LifeSeasonLabel = "renewal" | "growth" | "stability" | "recovery" | "reflection";

export interface LifeSeasonSignals {
  rootedness: number; // 0-1
  momentum: number; // 0-1
  label: LifeSeasonLabel;
}

function labelFor(rootedness: number, momentum: number): LifeSeasonLabel {
  if (rootedness < 0.25) return "renewal"; // little track record yet, regardless of momentum
  if (momentum >= 0.6) return rootedness >= 0.6 ? "stability" : "growth";
  if (rootedness >= 0.6) return momentum < 0.25 ? "recovery" : "reflection";
  return "reflection";
}

export function getLifeSeasonSignals(input: {
  currentStreak: number;
  familiarityFactor: number; // already 0-1, from useWorldHistory
  legacyTier: number; // already 0-4, from useWorldLegacy
}): LifeSeasonSignals {
  const rootedness = Math.min(1, input.familiarityFactor * 0.6 + (input.legacyTier / 4) * 0.4);
  const momentum = Math.min(1, input.currentStreak / 30);

  return { rootedness, momentum, label: labelFor(rootedness, momentum) };
}
