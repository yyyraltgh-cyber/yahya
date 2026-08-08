"use client";

import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translate";
import type { Achievement } from "@/lib/types/database";

const ICON_MAP: Record<string, string> = {
  "check-circle": "✅",
  repeat: "🔁",
  "list-checks": "📋",
  "book-open": "📖",
  flame: "🔥",
  star: "⭐",
  layers: "🗂️",
};

/**
 * Achievement titles/descriptions are seeded rows in the `achievements`
 * table (migration 0003) — data, not code, and the database schema is out
 * of scope for this step. This maps each known achievement id to its
 * translation keys so the catalog can display localized text without any
 * DB change. Unmapped ids (e.g. a future achievement added to the table
 * without a matching translation) fall back to the raw DB value.
 */
const CATALOG_KEY: Record<string, { title: TranslationKey; description: TranslationKey }> = {
  first_task: { title: "achievementsCatalog.firstTask.title", description: "achievementsCatalog.firstTask.description" },
  first_habit: { title: "achievementsCatalog.firstHabit.title", description: "achievementsCatalog.firstHabit.description" },
  first_routine: { title: "achievementsCatalog.firstRoutine.title", description: "achievementsCatalog.firstRoutine.description" },
  first_review: { title: "achievementsCatalog.firstReview.title", description: "achievementsCatalog.firstReview.description" },
  streak_3: { title: "achievementsCatalog.streak3.title", description: "achievementsCatalog.streak3.description" },
  streak_7: { title: "achievementsCatalog.streak7.title", description: "achievementsCatalog.streak7.description" },
  streak_30: { title: "achievementsCatalog.streak30.title", description: "achievementsCatalog.streak30.description" },
  tasks_10: { title: "achievementsCatalog.tasks10.title", description: "achievementsCatalog.tasks10.description" },
  tasks_50: { title: "achievementsCatalog.tasks50.title", description: "achievementsCatalog.tasks50.description" },
  level_5: { title: "achievementsCatalog.level5.title", description: "achievementsCatalog.level5.description" },
  level_10: { title: "achievementsCatalog.level10.title", description: "achievementsCatalog.level10.description" },
  area_creator: { title: "achievementsCatalog.areaCreator.title", description: "achievementsCatalog.areaCreator.description" },
  knowledge_5: { title: "achievementsCatalog.knowledge5.title", description: "achievementsCatalog.knowledge5.description" },
};

/**
 * Experience Expansion Phase — Screen 7. Every id, unlock status, and XP
 * value shown here comes from the exact same `achievements`/`unlockedIds`
 * data this component already received — no new logic, no changed
 * unlock criteria, nothing about which achievements exist or how they're
 * earned was touched.
 *
 * Unlocked/locked separation already existed before this pass — nothing
 * changed there. What changed is how an unlocked achievement is
 * *presented*: the icon moves from a bare, floating emoji into the same
 * quiet circular-badge treatment StatTile already uses elsewhere in this
 * app (Home, this exact page's own top stat row) instead of looking like
 * a separate, louder "trophy case" visual language. The XP-reward pill —
 * the single most reward-shop-like element on this screen, styled like a
 * slot-machine payout — becomes plain muted text carrying the same
 * information without the badge treatment. Grid spacing widened slightly
 * (gap-3 → gap-4) to match the calmer density.
 */
export function AchievementGrid({
  achievements,
  unlockedIds,
}: {
  achievements: Achievement[];
  unlockedIds: Set<string>;
}) {
  const { t } = useTranslation();

  // Presentational grouping only — same `unlockedIds` set the grid
  // already received, no new logic, no change to which ids are unlocked
  // or why. Achieved items keep the catalog's own sort_order among
  // themselves; so do the ones still ahead.
  const unlocked = achievements.filter((a) => unlockedIds.has(a.id));
  const locked = achievements.filter((a) => !unlockedIds.has(a.id));

  const tile = (a: Achievement, isUnlocked: boolean) => {
    const keys = CATALOG_KEY[a.id];
    const title = keys ? t(keys.title) : a.title;
    const description = keys ? t(keys.description) : a.description;
    return (
      <Card
        key={a.id}
        className={
          isUnlocked
            ? "flex flex-col items-center gap-1 border-[var(--color-primary)]/30 text-center"
            : "flex flex-col items-center gap-1 text-center opacity-40 grayscale"
        }
      >
        <span
          className={
            isUnlocked
              ? "flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)]/12 text-xl"
              : "flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-xl"
          }
        >
          {ICON_MAP[a.icon] ?? "🏆"}
        </span>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
        {isUnlocked && a.xp_reward > 0 && (
          <span className="mt-1 text-[10px] text-[var(--color-text-muted)]">
            +{a.xp_reward} {t("gamification.xp")}
          </span>
        )}
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {unlocked.length > 0 && (
        <div>
          <p className="text-stat-label mb-3">{t("achievements.unlockedSection")}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{unlocked.map((a) => tile(a, true))}</div>
        </div>
      )}
      {locked.length > 0 && (
        <div>
          <p className="text-stat-label mb-3">{t("achievements.lockedSection")}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{locked.map((a) => tile(a, false))}</div>
        </div>
      )}
    </div>
  );
}
