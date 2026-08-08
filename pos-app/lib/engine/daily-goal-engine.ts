/**
 * Pure conversion from a user's chosen ambition level into concrete daily
 * targets. No React, no Supabase, no UI — this file only knows about
 * numbers. lib/use-daily-goal.ts is the (thin) bridge that connects this
 * to the user's stored `profiles.daily_goal_level`.
 */

export type DailyGoalLevel = "light" | "medium" | "ambitious";

export interface DailyGoalTargets {
  tasksTarget: number;
  habitsTarget: number;
  routinesTarget: number;
}

/**
 * Fixed lookup table rather than a formula: the targets are a product
 * decision (what "light" vs "ambitious" *means*), not a derived
 * calculation, so they should be easy to find and tune in one place.
 */
const DAILY_GOAL_TARGETS: Readonly<Record<DailyGoalLevel, DailyGoalTargets>> = {
  light: { tasksTarget: 1, habitsTarget: 1, routinesTarget: 0 },
  medium: { tasksTarget: 3, habitsTarget: 3, routinesTarget: 1 },
  ambitious: { tasksTarget: 5, habitsTarget: 5, routinesTarget: 2 },
};

/** All supported levels, in ascending order of ambition. */
export const DAILY_GOAL_LEVELS: readonly DailyGoalLevel[] = ["light", "medium", "ambitious"];

export function isDailyGoalLevel(value: unknown): value is DailyGoalLevel {
  return value === "light" || value === "medium" || value === "ambitious";
}

/** Converts a level into its concrete daily targets. Deterministic, pure. */
export function computeDailyGoalTargets(level: DailyGoalLevel): DailyGoalTargets {
  return DAILY_GOAL_TARGETS[level];
}
