import type { SuggestionContext, SuggestionRule, Suggestion } from "@/lib/engine/suggestion-engine";
import type { Routine } from "@/lib/types/database";

/**
 * Whether it still makes sense to nudge the user about a routine tagged
 * for a given time of day, given the current hour. Avoids, e.g., pushing a
 * "morning routine" suggestion at 11pm — by then it reads as noise, not a
 * helpful nudge. "anytime" routines are always relevant.
 */
function isTimeRelevant(timeOfDay: Routine["time_of_day"], hour: number): boolean {
  switch (timeOfDay) {
    case "morning":
      return hour < 14;
    case "afternoon":
      return hour >= 11 && hour < 19;
    case "evening":
      return hour >= 16;
    case "anytime":
    default:
      return true;
  }
}

/**
 * Suggests finishing a routine the user has already started (some steps
 * done, not all) rather than one they haven't touched at all — "you're
 * partway there" is a stronger nudge than "you haven't started".
 */
const unfinishedRoutineRule: SuggestionRule = (ctx: SuggestionContext) => {
  const hour = ctx.now.getHours();
  const suggestions: Suggestion[] = [];

  for (const routine of ctx.routines) {
    if (routine.steps.length === 0) continue;
    if (!isTimeRelevant(routine.time_of_day, hour)) continue;

    const doneCount = routine.steps.filter((s) => s.done).length;
    const isPartial = doneCount > 0 && doneCount < routine.steps.length;
    if (!isPartial) continue;

    const remaining = routine.steps.length - doneCount;
    suggestions.push({
      key: `unfinished_routine_${routine.id}`,
      category: "routine",
      priority: 35,
      titleKey: "suggestions.unfinishedRoutine.title",
      titleVars: { routineName: routine.name },
      descriptionKey: "suggestions.unfinishedRoutine.description",
      descriptionVars: { remaining },
      action: { type: "navigate", href: "/routines" },
    });
  }
  return suggestions;
};

export const routineRules: SuggestionRule[] = [unfinishedRoutineRule];
