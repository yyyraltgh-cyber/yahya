"use client";

import { Flame, Trophy, Target, Sparkles } from "lucide-react";
import { StatTile } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGamification } from "@/components/gamification/gamification-context";
import { useDailyGoal } from "@/lib/use-daily-goal";
import { useTranslation } from "@/lib/i18n/locale-context";
import { levelProgress } from "@/lib/gamification";
import { fadeDelay } from "@/lib/utils";

/**
 * Sprint 4 (Executive Override) — the former TodayProgress component
 * rendered XP/streak/achievements as three sub-panels inside one bordered
 * Card, plus a goal footer below a divider. That's gone: each number is
 * now its own bento cell at the same visual level as everything else on
 * Home, not nested inside another container. Same hooks
 * (useGamification, useDailyGoal) and the same achievement counts already
 * fetched by the dashboard page — only the composition changed.
 */
export function TodayBento({
  achievementsUnlocked,
  achievementsTotal,
  userId,
}: {
  achievementsUnlocked: number;
  achievementsTotal: number;
  userId: string;
}) {
  const { t } = useTranslation();
  const { xp, currentStreak } = useGamification();
  const { targets } = useDailyGoal(userId);
  const { level, progressPct } = levelProgress(xp);

  return (
    <div className="animate-home-fade-up grid grid-cols-2 gap-3" style={fadeDelay(180)}>
      <StatTile
        icon={Flame}
        tone="warning"
        label={t("today.streakLabel")}
        value={currentStreak > 0 ? currentStreak : "—"}
      />

      <StatTile icon={Sparkles} tone="primary" label={t("today.xpLabel")} value={`Lv ${level}`}>
        <ProgressBar percent={progressPct} resetKey={xp} />
      </StatTile>

      <StatTile
        icon={Trophy}
        tone="accent"
        href="/achievements"
        label={t("today.achievementsLabel")}
        value={t("today.achievementsUnlocked", { unlocked: achievementsUnlocked, total: achievementsTotal })}
      />

      <StatTile
        icon={Target}
        tone="success"
        label={t("today.todaysGoal")}
        value={targets.tasksTarget + targets.habitsTarget + targets.routinesTarget}
      >
        <p className="text-subtitle">
          {t("today.goalSummary", {
            tasks: targets.tasksTarget,
            habits: targets.habitsTarget,
            routines: targets.routinesTarget,
          })}
        </p>
      </StatTile>
    </div>
  );
}
