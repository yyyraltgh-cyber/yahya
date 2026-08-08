import type { SuggestionContext, SuggestionRule, Suggestion } from "@/lib/engine/suggestion-engine";
import { todayISO } from "@/lib/utils";

const MORNING_HOUR_CUTOFF = 12;
const MIN_HISTORY_FOR_MORNING_PATTERN = 3;
const MORNING_PATTERN_RATIO = 0.7;

/**
 * If a habit has a clear historical pattern of being logged in the morning
 * (>= 70% of past check-ins before noon, based on >= 3 data points), and
 * it's currently morning and the habit isn't logged yet today, nudge the
 * user to do it now — leaning on their own established rhythm rather than
 * an arbitrary reminder time.
 */
const morningHabitRule: SuggestionRule = (ctx: SuggestionContext) => {
  if (ctx.now.getHours() >= MORNING_HOUR_CUTOFF) return [];
  const today = todayISO();

  const suggestions: Suggestion[] = [];
  for (const habit of ctx.habits) {
    const loggedToday = ctx.habitLogs.some((l) => l.habit_id === habit.id && l.logged_on === today);
    if (loggedToday) continue;

    const history = ctx.habitLogs.filter((l) => l.habit_id === habit.id && l.logged_on !== today);
    if (history.length < MIN_HISTORY_FOR_MORNING_PATTERN) continue;

    const morningCount = history.filter((l) => new Date(l.created_at).getHours() < MORNING_HOUR_CUTOFF).length;
    const ratio = morningCount / history.length;
    if (ratio < MORNING_PATTERN_RATIO) continue;

    suggestions.push({
      key: `morning_habit_${habit.id}`,
      category: "habit",
      priority: 40,
      titleKey: "suggestions.morningHabit.title",
      titleVars: { habitName: habit.name },
      descriptionKey: "suggestions.morningHabit.description",
      action: { type: "navigate", href: "/habits" },
    });
  }
  return suggestions;
};

const INACTIVE_DAYS_THRESHOLD = 5;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/**
 * Flags habits that have gone quiet: no check-in in the last 5+ days,
 * while the habit itself is old enough (5+ days since creation) that this
 * isn't just a brand-new habit that hasn't had its first chance yet.
 */
const inactiveHabitRule: SuggestionRule = (ctx: SuggestionContext) => {
  const suggestions: Suggestion[] = [];

  for (const habit of ctx.habits) {
    const habitAgeDays = daysBetween(ctx.now, new Date(habit.created_at));
    if (habitAgeDays < INACTIVE_DAYS_THRESHOLD) continue;

    const logsForHabit = ctx.habitLogs.filter((l) => l.habit_id === habit.id);
    const mostRecent = logsForHabit.reduce<string | null>((latest, l) => {
      if (!latest || l.logged_on > latest) return l.logged_on;
      return latest;
    }, null);

    const daysSinceLastLog = mostRecent
      ? daysBetween(ctx.now, new Date(mostRecent))
      : habitAgeDays;

    if (daysSinceLastLog < INACTIVE_DAYS_THRESHOLD) continue;

    suggestions.push({
      key: `inactive_habit_${habit.id}`,
      category: "habit",
      priority: 30,
      titleKey: "suggestions.inactiveHabit.title",
      titleVars: { habitName: habit.name },
      descriptionKey: "suggestions.inactiveHabit.description",
      descriptionVars: { days: daysSinceLastLog },
      action: { type: "navigate", href: "/habits" },
    });
  }
  return suggestions;
};

const STREAK_RISK_HOUR_THRESHOLD = 18;

/**
 * Warns when an active streak (account-wide, tracked on the profile) has
 * not been extended yet today and it's getting late. Placed alongside the
 * habit rules — rather than in its own file — because in this app streaks
 * are driven almost entirely by daily habit/task/routine activity, so a
 * "log a habit" nudge is the most direct fix. Reads profile streak fields
 * only; does not modify lib/gamification.ts or streak state itself.
 */
const streakAtRiskRule: SuggestionRule = (ctx: SuggestionContext) => {
  if (ctx.streak.current <= 0) return [];
  if (ctx.now.getHours() < STREAK_RISK_HOUR_THRESHOLD) return [];
  if (ctx.streak.lastActivityDate === todayISO()) return [];

  return [
    {
      key: "streak_at_risk",
      category: "streak",
      priority: 85,
      titleKey: "suggestions.streakAtRisk.title",
      titleVars: { streak: ctx.streak.current },
      descriptionKey: "suggestions.streakAtRisk.description",
      action: { type: "navigate", href: "/habits" },
    },
  ];
};

export const habitRules: SuggestionRule[] = [morningHabitRule, inactiveHabitRule, streakAtRiskRule];
