import type { SuggestionContext, SuggestionRule, Suggestion } from "@/lib/engine/suggestion-engine";
import { todayISO } from "@/lib/utils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const OVERDUE_TASKS_CALM_THRESHOLD = 3;
const RECENT_STREAK_LOSS_WINDOW_DAYS = 2;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);
}

/**
 * A single supportive, non-achievement suggestion — the opposite of every
 * other rule in this engine, which point at something to *do*. This one
 * points at a moment to *pause* first: a short dhikr/breathing habit
 * already in the content library (spiritual_istighfar), not a new
 * mechanic. Triggers on either (a) a pile-up of overdue tasks, mirroring
 * but deliberately separate from task-rules.ts's own overdue nudge, or
 * (b) a streak that broke very recently (current === 0, but the user was
 * active within the last two days) — distinct from habit-rules.ts's
 * streakAtRiskRule, which only fires while a streak is still alive.
 * Deliberately lower priority than direct task/streak nudges so it never
 * crowds them out — it supplements, never replaces, the actionable list.
 *
 * Note: like task-rules.ts's overdueTasksRule, the overdue-count trigger
 * is currently dormant — no UI sets `tasks.due_date` yet — so in practice
 * this rule only fires via the streak-loss condition until that UI exists.
 */
const calmingMomentRule: SuggestionRule = (ctx: SuggestionContext) => {
  const overdueCount = ctx.tasks.filter(
    (t) => t.status !== "done" && t.due_date && t.due_date < todayISO()
  ).length;

  const streakJustLost =
    ctx.streak.current === 0 &&
    !!ctx.streak.lastActivityDate &&
    daysBetween(ctx.now, new Date(ctx.streak.lastActivityDate)) <= RECENT_STREAK_LOSS_WINDOW_DAYS &&
    daysBetween(ctx.now, new Date(ctx.streak.lastActivityDate)) >= 1;

  if (overdueCount < OVERDUE_TASKS_CALM_THRESHOLD && !streakJustLost) return [];

  const suggestions: Suggestion[] = [
    {
      key: `calming_moment_${todayISO()}`,
      category: "wellbeing",
      priority: 20,
      titleKey: "suggestions.calmingMoment.title",
      descriptionKey: "suggestions.calmingMoment.description",
      action: { type: "navigate", href: "/library" },
    },
  ];
  return suggestions;
};

export const wellbeingRules: SuggestionRule[] = [calmingMomentRule];
