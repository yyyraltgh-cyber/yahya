import type { SuggestionContext, SuggestionRule } from "@/lib/engine/suggestion-engine";
import { isRamadan } from "@/lib/hijri";

/**
 * Fires once per day throughout Ramadan (re-fires daily since its key
 * includes the date, so dismissing one day doesn't silently hide it for
 * the rest of the month). Purely a suggestion — never auto-changes
 * profiles.daily_goal_level or anything else; the user decides whether to
 * act on it, consistent with every other rule in this engine.
 */
const ramadanAwarenessRule: SuggestionRule = (ctx: SuggestionContext) => {
  if (!isRamadan(ctx.now)) return [];
  const dateKey = ctx.now.toISOString().slice(0, 10);

  return [
    {
      key: `ramadan_awareness_${dateKey}`,
      category: "wellbeing" as const,
      priority: 15,
      titleKey: "suggestions.ramadanAwareness.title",
      descriptionKey: "suggestions.ramadanAwareness.description",
      action: { type: "navigate" as const, href: "/settings" },
    },
  ];
};

export const seasonalRules: SuggestionRule[] = [ramadanAwarenessRule];
