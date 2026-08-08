import { generateSuggestions } from "@/lib/engine/suggestion-engine";
import type { Suggestion, SuggestionContext, SuggestionRule } from "@/lib/engine/suggestion-engine";
import { taskRules } from "./task-rules";
import { habitRules } from "./habit-rules";
import { reviewRules } from "./review-rules";
import { routineRules } from "./routine-rules";
import { wellbeingRules } from "./wellbeing-rules";
import { seasonalRules } from "./seasonal-rules";

/**
 * The full registered rule set. Adding a new rule module never requires
 * touching lib/engine/suggestion-engine.ts — just add the rule(s) to a
 * (new or existing) file in this directory and append them here.
 */
export const rules: SuggestionRule[] = [
  ...taskRules,
  ...habitRules,
  ...reviewRules,
  ...routineRules,
  ...wellbeingRules,
  ...seasonalRules,
];

/** Convenience wrapper: runs the full registered rule set against a context. */
export function generateAllSuggestions(context: SuggestionContext): Suggestion[] {
  return generateSuggestions(context, rules);
}
