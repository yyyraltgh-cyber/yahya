import type { SuggestionContext, SuggestionRule } from "@/lib/engine/suggestion-engine";
import { todayISO } from "@/lib/utils";

/**
 * Suggests catching up when the user has overdue tasks. Priority scales
 * with how many are overdue (capped) so a pile-up feels more urgent than a
 * single slip. Fires only when at least one task is overdue.
 *
 * Note: `tasks.due_date` is currently never set by any UI in the app, so
 * this rule is dormant (never fires) until a due-date field is added to
 * task creation in a later step. The logic is correct against the schema
 * as-is and will activate automatically once that UI exists.
 */
const overdueTasksRule: SuggestionRule = (ctx: SuggestionContext) => {
  const today = todayISO();
  const overdue = ctx.tasks.filter(
    (t) => t.status !== "done" && t.due_date !== null && t.due_date < today
  );
  if (overdue.length === 0) return [];

  return [
    {
      key: "overdue_tasks",
      category: "task",
      priority: Math.min(50 + overdue.length * 5, 90),
      titleKey: "suggestions.overdueTasks.title",
      titleVars: { count: overdue.length },
      descriptionKey: "suggestions.overdueTasks.description",
      action: { type: "navigate", href: "/tasks" },
    },
  ];
};

/**
 * Suggests reviewing a specific life area when overdue tasks cluster there
 * (>= 3), rather than repeating the generic "you have overdue tasks"
 * signal. Deliberately area-agnostic (no hardcoded area names like "Work")
 * so it works for whatever life areas the user has actually created.
 */
const AREA_OVERLOAD_THRESHOLD = 3;

const areaOverloadRule: SuggestionRule = (ctx: SuggestionContext) => {
  const today = todayISO();
  const overdueByArea = new Map<string, number>();

  for (const t of ctx.tasks) {
    if (t.status === "done" || t.due_date === null || t.due_date >= today) continue;
    if (!t.area_id) continue;
    overdueByArea.set(t.area_id, (overdueByArea.get(t.area_id) ?? 0) + 1);
  }

  const suggestions = [];
  for (const [areaId, count] of overdueByArea) {
    if (count < AREA_OVERLOAD_THRESHOLD) continue;
    suggestions.push({
      key: `area_overload_${areaId}`,
      category: "task" as const,
      priority: Math.min(55 + count * 5, 95),
      titleKey: "suggestions.areaOverload.title" as const,
      titleVars: { count },
      descriptionKey: "suggestions.areaOverload.description" as const,
      action: { type: "navigate" as const, href: "/tasks" },
    });
  }
  return suggestions;
};

export const taskRules: SuggestionRule[] = [overdueTasksRule, areaOverloadRule];
