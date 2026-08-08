import type { SuggestionContext, SuggestionRule } from "@/lib/engine/suggestion-engine";
import { todayISO } from "@/lib/utils";

const EVENING_HOUR_THRESHOLD = 19;

/**
 * Nudges the user toward a daily review once it's evening and they haven't
 * logged one for today yet. Only checks `kind === "daily"` reviews — weekly
 * and monthly reviews have their own natural cadence and aren't part of
 * this daily nudge.
 */
const missingDailyReviewRule: SuggestionRule = (ctx: SuggestionContext) => {
  if (ctx.now.getHours() < EVENING_HOUR_THRESHOLD) return [];

  const today = todayISO();
  const hasDailyReviewToday = ctx.reviews.some(
    (r) => r.kind === "daily" && r.period_start === today
  );
  if (hasDailyReviewToday) return [];

  return [
    {
      key: `missing_daily_review_${today}`,
      category: "review",
      priority: 25,
      titleKey: "suggestions.missingDailyReview.title",
      descriptionKey: "suggestions.missingDailyReview.description",
      action: { type: "navigate", href: "/reviews" },
    },
  ];
};

export const reviewRules: SuggestionRule[] = [missingDailyReviewRule];
