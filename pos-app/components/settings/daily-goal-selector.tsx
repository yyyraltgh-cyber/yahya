"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-context";
import { useDailyGoal } from "@/lib/use-daily-goal";
import { DAILY_GOAL_LEVELS, type DailyGoalLevel } from "@/lib/engine/daily-goal-engine";
import { Card } from "@/components/ui/card";

const LEVEL_LABEL_KEY: Record<DailyGoalLevel, "settings.dailyGoalLight" | "settings.dailyGoalMedium" | "settings.dailyGoalAmbitious"> = {
  light: "settings.dailyGoalLight",
  medium: "settings.dailyGoalMedium",
  ambitious: "settings.dailyGoalAmbitious",
};

/**
 * Saves the chosen level immediately on click — no separate "Save" button.
 * Optimistic: the UI reflects the new selection instantly, before the
 * network call resolves. On failure, it reverts to the last confirmed
 * level and shows an inline error so the user isn't left thinking a
 * change stuck when it didn't.
 */
export function DailyGoalSelector({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const { level, loading, refresh } = useDailyGoal(userId);
  const [optimisticLevel, setOptimisticLevel] = useState<DailyGoalLevel | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const displayedLevel = optimisticLevel ?? level;

  async function selectLevel(next: DailyGoalLevel) {
    if (next === displayedLevel || saving) return;

    const previous = displayedLevel;
    setOptimisticLevel(next);
    setError(false);
    setSaving(true);

    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("profiles")
      .update({ daily_goal_level: next })
      .eq("id", userId);

    setSaving(false);

    if (saveError) {
      // Revert the optimistic change and surface the failure.
      setOptimisticLevel(previous);
      setError(true);
      return;
    }

    // Confirmed: re-sync from the source of truth and drop the optimistic override.
    await refresh();
    setOptimisticLevel(null);
  }

  return (
    <Card>
      <h2 className="text-section-title">{t("settings.dailyGoal")}</h2>
      <p className="text-subtitle mb-3">{t("settings.dailyGoalDescription")}</p>

      <div className="flex flex-wrap gap-2">
        {DAILY_GOAL_LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            disabled={loading || saving}
            onClick={() => selectLevel(lvl)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
              displayedLevel === lvl
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-[var(--color-border)]"
            }`}
          >
            {t(LEVEL_LABEL_KEY[lvl])}
          </button>
        ))}
      </div>

      {saving && <p className="mt-2 text-xs text-[var(--color-text-muted)]">{t("common.loading")}</p>}
      {!saving && error && (
        <p className="mt-2 text-xs text-[var(--color-danger)]">{t("settings.dailyGoalSaveFailed")}</p>
      )}
    </Card>
  );
}
