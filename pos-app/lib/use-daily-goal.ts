"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  computeDailyGoalTargets,
  isDailyGoalLevel,
  type DailyGoalLevel,
  type DailyGoalTargets,
} from "@/lib/engine/daily-goal-engine";

const DEFAULT_LEVEL: DailyGoalLevel = "medium";

/**
 * Reads the user's stored daily_goal_level and exposes it alongside its
 * computed targets (via the pure daily-goal engine). Read-only: writing a
 * new level is the responsibility of the Settings selector, which owns its
 * own save flow (optimistic update + error recovery). Call refresh() after
 * a save elsewhere if this hook's consumer needs to pick up the change
 * without a full remount.
 */
export function useDailyGoal(userId: string | undefined) {
  const [level, setLevel] = useState<DailyGoalLevel>(DEFAULT_LEVEL);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("daily_goal_level")
      .eq("id", userId)
      .single();
    setLevel(isDailyGoalLevel(data?.daily_goal_level) ? data.daily_goal_level : DEFAULT_LEVEL);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const targets: DailyGoalTargets = computeDailyGoalTargets(level);

  return { level, targets, loading, refresh };
}
