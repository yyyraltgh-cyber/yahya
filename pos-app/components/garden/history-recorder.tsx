"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AtmosphereState, GrowthLevel } from "@/lib/garden/types";

/**
 * Release 4B — Living History Architecture. This is the first application
 * code to ever write to garden_snapshots (schema prepared in Release 2A,
 * left deliberately unused until now — "prepare proper foundations, do
 * not fake persistence" was that release's own instruction, honored by
 * waiting).
 *
 * One row per user per day (the table's own unique(user_id, snapshot_date)
 * constraint makes this call idempotent — mounting Home five times today
 * writes the same row, not five). This is the "only meaningful moments,
 * not every interaction" rule from Objective 1: a day's outcome is a
 * meaningful unit; a single checkbox toggle is not, and nothing in this
 * component listens for one.
 *
 * Every value recorded is already computed by useGarden() and already
 * passed into GardenStage as props — no new business logic, purely a
 * side-channel write of an existing computation's output.
 */
export function HistoryRecorder({
  userId,
  growthLevel,
  atmosphere,
  habitsDoneToday,
  habitsTotal,
  achievementsUnlocked,
  achievementsTotal,
  hasOverdue,
}: {
  userId: string;
  growthLevel: GrowthLevel;
  atmosphere: AtmosphereState;
  habitsDoneToday: number;
  habitsTotal: number;
  achievementsUnlocked: number;
  achievementsTotal: number;
  hasOverdue: boolean;
}) {
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("garden_snapshots")
      .upsert(
        {
          user_id: userId,
          snapshot_date: new Date().toISOString().slice(0, 10),
          growth_level: growthLevel,
          atmosphere,
          contributing_factors: {
            habitsDoneToday,
            habitsTotal,
            achievementsUnlocked,
            achievementsTotal,
            hasOverdue,
          },
        },
        { onConflict: "user_id,snapshot_date" }
      )
      .then(({ error }) => {
        // Never surfaced to the user — a missed history snapshot is not
        // worth a toast or an error state; today's Garden itself is
        // completely unaffected either way. Logged for developers only.
        if (error) console.error("garden_snapshots upsert failed:", error.message);
      });
    // Deliberately once per mount (once per Home visit), not on every
    // growthLevel change within a session — matching "meaningful moments,
    // not every interaction."
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return null;
}
