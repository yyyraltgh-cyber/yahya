"use client";

import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/locale-context";
import { useGarden } from "@/lib/garden/use-garden";
import { GardenScene } from "@/components/garden/garden-scene";
import { HistoryRecorder } from "@/components/garden/history-recorder";

/**
 * Executive Experience Contract 001 — Garden OS.
 *
 * This replaces TodayHeader entirely, not visually but conceptually: the
 * Garden is not a hero banner sitting above a page of sections. It IS the
 * first screen. Nothing else — no task list, no stats, no quick actions —
 * is visible until the user deliberately asks for it via the peek bar at
 * the bottom. Emotion (calm, growth, ownership) arrives before any
 * information does, by construction: there is nothing else on screen to
 * compete with it.
 *
 * The peek bar is the ONLY operational information present by default,
 * and it's a single short phrase derived from the same data every prior
 * sprint already had (overdue/pending counts) — never a paragraph, never
 * a card. Tapping it (or the chevron) reveals the full Focus/Progress/
 * Quick-Actions layer, which is rendered by the parent page, not here —
 * this component only owns the immersive stage and the toggle affordance.
 */
export function GardenStage({
  userId,
  name,
  habitsDoneToday,
  habitsTotalToday,
  achievementsUnlocked = 0,
  achievementsTotal = 0,
  overdueCount,
  pendingHabitsCount,
  unfinishedRoutinesCount,
  expanded,
  onToggle,
}: {
  userId: string;
  name: string | null;
  habitsDoneToday: number;
  habitsTotalToday: number;
  achievementsUnlocked?: number;
  achievementsTotal?: number;
  overdueCount: number;
  pendingHabitsCount: number;
  unfinishedRoutinesCount: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const garden = useGarden({
    habitsDoneToday,
    habitsTotal: habitsTotalToday,
    achievementsUnlocked,
    achievementsTotal,
    hasOverdue: overdueCount > 0,
  });

  const peekLine =
    overdueCount > 0
      ? t("today.focusPeekOverdue", { count: overdueCount })
      : pendingHabitsCount > 0
        ? t("today.focusPeekHabits", { count: pendingHabitsCount })
        : unfinishedRoutinesCount > 0
          ? t("today.focusPeekRoutines")
          : t("today.focusPeekClear");

  return (
    <div
      className="hero-band animate-home-fade-up -mx-6 -mt-6 flex flex-col items-center"
      style={{ minHeight: "calc(100dvh - 11rem)" }}
    >
      <HistoryRecorder
        userId={userId}
        growthLevel={garden.growthLevel}
        atmosphere={garden.atmosphere}
        habitsDoneToday={habitsDoneToday}
        habitsTotal={habitsTotalToday}
        achievementsUnlocked={achievementsUnlocked}
        achievementsTotal={achievementsTotal}
        hasOverdue={overdueCount > 0}
      />

      <div className="flex flex-col items-center gap-1 px-6 pt-10 text-center sm:pt-14">
        <h2 className="font-display text-2xl font-semibold leading-tight sm:text-3xl">
          {name ? t("today.greetingWithName", { name }) : t("today.greetingGeneric")}
        </h2>
        <p className="text-subtitle max-w-xs">{t("today.heroTagline")}</p>
      </div>

      <div className="flex flex-1 items-center justify-center py-4">
        <GardenScene growthLevel={garden.growthLevel} atmosphere={garden.atmosphere} />
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-label={`${peekLine} — ${expanded ? t("today.focusCollapse") : t("today.focusExpand")}`}
        className="focus-ring flex w-full flex-col items-center gap-2 pb-6 pt-2 text-center transition-opacity hover:opacity-80"
      >
        <span className="h-1 w-10 rounded-full bg-[var(--color-border)]" aria-hidden="true" />
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
          {peekLine}
          <ChevronDown
            size={14}
            className={`transition-transform duration-[var(--duration-base)] ${expanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>
    </div>
  );
}
