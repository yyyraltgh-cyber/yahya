/**
 * Release 4C — World Legacy Architecture.
 *
 * History (4B) answers "how long has this world existed" — a smooth,
 * continuous curve built from every day recorded. Legacy answers "what
 * has this world actually been through" — and deliberately does NOT use
 * the same shape of curve. A meaningful moment is rare by definition
 * (Objective 1: "not every task, not every habit, not every login, only
 * foundational moments"), so legacy moves in discrete steps, crossed at
 * real thresholds, not accumulated smoothly like a running total. That
 * stepped character is what makes it feel like identity rather than
 * more of the same metric wearing a different name.
 *
 * Built entirely on user_achievements — already real, already
 * RLS-protected, already the app's existing definition of "a rare,
 * foundational moment" (achievements are not awarded for routine
 * activity; the existing achievement rules already encode what counts
 * as meaningful). No new table, no new criteria invented here.
 */
export type LegacyTier = 0 | 1 | 2 | 3 | 4;

// Every 4 unlocked achievements crosses one tier — a deliberately coarse
// threshold. A new user (0-3 unlocked) sits at tier 0 for a while, which
// is exactly Objective 3's "a new user should not notice it."
const ACHIEVEMENTS_PER_TIER = 4;
const MAX_TIER: LegacyTier = 4;

export function getLegacyTier(unlockedAchievementCount: number): LegacyTier {
  const tier = Math.floor(unlockedAchievementCount / ACHIEVEMENTS_PER_TIER);
  return Math.min(tier, MAX_TIER) as LegacyTier;
}
