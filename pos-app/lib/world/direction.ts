import type { UnifiedSeasonSignals } from "./unified-season";

/**
 * Release 5C — World Direction.
 *
 * Not prediction, not AI, not planning — the brief is explicit that this
 * is "the quiet influence of the user's current long-term intention,"
 * and the only two existing signals in the app that actually speak to
 * intention (not just history) are:
 *
 *  - trendSlope: is this account's own growth trajectory (garden_
 *    snapshots, Release 4B) currently rising or falling, comparing the
 *    last ~7 recorded days against the ~7 before that. This is the
 *    closest thing to "who the user is becoming" the app has: not a
 *    snapshot of where they are, but the direction they're already
 *    moving from where they were.
 *  - intentionality: how often, over the same recent window, the person
 *    has actually written something in the existing Niyyah/daily-
 *    intention feature (daily_intentions, already built, already used
 *    by NiyyahCard — nothing new persisted here). This is used as a
 *    weight, not a signal on its own — someone who never articulates an
 *    intention shouldn't get a strong directional bias just because
 *    their Garden happened to trend up or down for unrelated reasons.
 *
 * Direction is applied AFTER Earth+Life (unified-season.ts, untouched)
 * and is deliberately the smallest cap of any layer in the system —
 * Objective 3 calls it "the weakest influence," and the numbers below
 * are what make that literally true, not just described that way.
 */
export interface DirectionSignals {
  pull: number; // -1..1, the trend itself
  intentionality: number; // 0..1, how much weight the trend should carry
}

export function getDirectionSignals(input: { trendSlope: number; intentionality: number }): DirectionSignals {
  return {
    pull: Math.max(-1, Math.min(1, input.trendSlope)),
    intentionality: Math.max(0, Math.min(1, input.intentionality)),
  };
}

const PULL_WARMTH_CAP = 0.06; // smaller than Legacy's 0.10 max, smaller than Life's 0.15

export function applyDirection(
  season: UnifiedSeasonSignals,
  direction: DirectionSignals
): UnifiedSeasonSignals {
  const bend = direction.pull * direction.intentionality * PULL_WARMTH_CAP;
  return {
    ...season,
    warmth: Math.max(-1, Math.min(1, season.warmth + bend)),
  };
}
