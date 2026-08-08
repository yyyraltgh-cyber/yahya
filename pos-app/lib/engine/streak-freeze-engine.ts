/**
 * Pure business logic for streak freezes: whether to consume one to
 * protect a streak, and how the stored count changes on consumption or
 * grant. No React, no Supabase — lib/gamification.ts is the only caller,
 * and it owns all persistence.
 */

export const MAX_STREAK_FREEZES = 3;

/**
 * Achievement IDs that grant a streak freeze the first time they unlock.
 * A Set rather than a switch so adding a future milestone is a one-line
 * change here, with no changes needed anywhere else.
 */
const FREEZE_GRANTING_ACHIEVEMENTS: ReadonlySet<string> = new Set(["streak_7", "streak_30"]);

export function isFreezeGrantingAchievement(achievementId: string): boolean {
  return FREEZE_GRANTING_ACHIEVEMENTS.has(achievementId);
}

/**
 * Whether a streak freeze should be consumed to preserve an at-risk streak.
 *
 * `daysSinceLastActivity` is the whole-day gap between the user's last
 * recorded activity and today: 1 means "active yesterday" (no gap at all —
 * the normal extend case, freeze not needed), 2 means exactly one day was
 * missed (freeze-eligible), 3+ means two or more days were missed (too
 * large a gap — a freeze does not apply, matching the "gap == 1 day only"
 * rule).
 */
export function shouldConsumeFreeze(daysSinceLastActivity: number, freezesAvailable: number): boolean {
  const missedDays = daysSinceLastActivity - 1;
  return missedDays === 1 && freezesAvailable > 0;
}

/** Consumes one freeze. Never goes below zero. */
export function consumeFreeze(freezesAvailable: number): number {
  return Math.max(0, freezesAvailable - 1);
}

/** Grants one freeze. Never exceeds MAX_STREAK_FREEZES. */
export function grantFreeze(freezesAvailable: number): number {
  return Math.min(MAX_STREAK_FREEZES, freezesAvailable + 1);
}
