"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateAllSuggestions } from "@/lib/suggestions";
import { prioritizeSuggestions } from "@/lib/engine/priority-engine";
import type { Suggestion, SuggestionContext } from "@/lib/engine/suggestion-engine";

/**
 * Fetches everything the suggestion engine needs for the given user,
 * builds a SuggestionContext, runs the full rule set, filters out anything
 * already dismissed, and exposes the final prioritized list plus a
 * dismiss() action. This is the only place in the app that touches
 * Supabase for suggestions — the engine and rules stay pure and untouched
 * by network concerns.
 */
export function useSuggestions(userId: string | undefined) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();

    const [tasksRes, habitsRes, habitLogsRes, routinesRes, reviewsRes, lifeAreasRes, profileRes, dismissedRes] =
      await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", userId),
        supabase.from("habits").select("*").eq("user_id", userId),
        supabase.from("habit_logs").select("*").eq("user_id", userId),
        supabase.from("routines").select("*").eq("user_id", userId),
        supabase.from("reviews").select("*").eq("user_id", userId),
        supabase.from("life_areas").select("*").eq("user_id", userId),
        supabase.from("profiles").select("current_streak,last_activity_date").eq("id", userId).single(),
        supabase.from("dismissed_suggestions").select("suggestion_key").eq("user_id", userId),
      ]);

    const context: SuggestionContext = {
      now: new Date(),
      tasks: tasksRes.data ?? [],
      habits: habitsRes.data ?? [],
      habitLogs: habitLogsRes.data ?? [],
      routines: routinesRes.data ?? [],
      reviews: reviewsRes.data ?? [],
      lifeAreas: lifeAreasRes.data ?? [],
      streak: {
        current: profileRes.data?.current_streak ?? 0,
        lastActivityDate: profileRes.data?.last_activity_date ?? null,
      },
    };

    const dismissedKeys = new Set((dismissedRes.data ?? []).map((d) => d.suggestion_key));
    const raw = generateAllSuggestions(context);
    setSuggestions(prioritizeSuggestions(raw, dismissedKeys));
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const dismiss = useCallback(
    async (key: string) => {
      if (!userId) return;
      const supabase = createClient();
      const { error } = await supabase
        .from("dismissed_suggestions")
        .insert({ user_id: userId, suggestion_key: key });
      // A duplicate dismiss (unique constraint) is harmless — the
      // suggestion is already gone from local state either way.
      if (!error || error.code === "23505") {
        setSuggestions((prev) => prev.filter((s) => s.key !== key));
      }
    },
    [userId]
  );

  return { suggestions, loading, dismiss, refresh };
}
