"use client";

import { useTranslation } from "@/lib/i18n/locale-context";

/**
 * Shows the number of streak freezes the user currently has available.
 * Renders nothing when the count is zero, matching StreakBadge's
 * "hide when there's nothing to show" convention.
 */
export function StreakFreezeBadge({ count }: { count: number }) {
  const { t } = useTranslation();
  if (count <= 0) return null;

  return (
    <div
      title={t("gamification.streakFreezesAvailable", { count })}
      className="flex items-center gap-1 rounded-full bg-[var(--color-primary)]/15 px-2 py-1 text-xs font-semibold text-[var(--color-primary)]"
    >
      <span>🧊</span>
      {count}
    </div>
  );
}
