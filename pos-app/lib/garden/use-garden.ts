import { useEffect, useMemo, useRef, useState } from "react";
import { useGamification } from "@/components/gamification/gamification-context";
import { clampGrowthLevel, type AtmosphereState, type GrowthLevel } from "./types";

interface UseGardenInput {
  habitsDoneToday: number;
  habitsTotal: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  /** Already computed by the caller from existing overdue-task/unfinished-routine
   *  data (see app/dashboard/page.tsx) — no new query added here. */
  hasOverdue: boolean;
}

interface GardenState {
  growthLevel: GrowthLevel;
  atmosphere: AtmosphereState;
}

const CELEBRATION_DURATION_MS = 1600;
const NIGHT_START_HOUR = 20; // 8pm
const NIGHT_END_HOUR = 5; // 5am

/**
 * Converts existing application data into Garden state. No new queries, no
 * new data model — reads:
 *  - habitsDoneToday / habitsTotal, achievementsUnlocked / achievementsTotal,
 *    hasOverdue: passed in as props, already fetched by the Today/Dashboard
 *    screen (app/dashboard/page.tsx).
 *  - currentStreak: read directly from the existing GamificationProvider
 *    context (same pattern already used by components/today/today-progress.tsx).
 *
 * The weights below (0.4 / 0.35 / 0.25) and what's deliberately excluded
 * (tasks, goals) are a product decision, not an implementation detail —
 * see ./FORMULA.md for the full reasoning. Change the doc first.
 */
export function useGarden(input: UseGardenInput): GardenState {
  const { currentStreak } = useGamification();

  const growthLevel = useMemo(() => {
    const habitRatio = input.habitsTotal > 0 ? input.habitsDoneToday / input.habitsTotal : 0;
    const achievementRatio =
      input.achievementsTotal > 0 ? input.achievementsUnlocked / input.achievementsTotal : 0;
    // 30-day streak reaches full weight — a deliberate, documented choice,
    // not a value read from anywhere else in the app.
    const streakFactor = Math.min(currentStreak / 30, 1);
    const score = habitRatio * 0.4 + achievementRatio * 0.35 + streakFactor * 0.25;
    return clampGrowthLevel(score * 8);
  }, [input.habitsDoneToday, input.habitsTotal, input.achievementsUnlocked, input.achievementsTotal, currentStreak]);

  // Celebration fires specifically when growthLevel rises to a higher
  // stage — not on every habit completion, since not every completion
  // moves the stage (rounding). Purely a presentation trigger; the
  // formula above is unchanged.
  const prevLevelRef = useRef(growthLevel);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    if (growthLevel > prevLevelRef.current) {
      setCelebrating(true);
      const timer = setTimeout(() => setCelebrating(false), CELEBRATION_DURATION_MS);
      prevLevelRef.current = growthLevel;
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = growthLevel;
  }, [growthLevel]);

  return useMemo(() => {
    const hour = new Date().getHours();
    const isNight = hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;

    let atmosphere: AtmosphereState;
    if (celebrating) atmosphere = "celebration";
    else if (input.hasOverdue) atmosphere = "recovery"; // renders as the rain effect
    else if (isNight) atmosphere = "night";
    else atmosphere = "calm";

    return { growthLevel, atmosphere };
  }, [growthLevel, input.hasOverdue, celebrating]);
}
