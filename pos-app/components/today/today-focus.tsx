"use client";

import Link from "next/link";
import { AlertTriangle, ListChecks, Repeat, Lightbulb, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/lib/i18n/locale-context";
import { fadeDelay } from "@/lib/utils";
import type { Task, Habit, Routine } from "@/lib/types/database";
import type { Suggestion } from "@/lib/engine/suggestion-engine";

/**
 * Sprint 4 (Executive Override) — previously each category (overdue
 * tasks, pending habits, unfinished routines) was its own bordered card
 * stacked with gaps, and suggestions were a visually separate group below
 * a divider. That's gone: this is now one flat, divided list — a single
 * Card containing rows — the "inbox" pattern (Things 3, Linear), not a
 * pile of mini-cards. Same data, same navigation targets, same dismiss
 * behavior; only the composition changed.
 *
 * Display + navigation only — deliberately not interactive for the
 * priority rows. Checking off a task/habit or advancing a routine step
 * already has a canonical, tested implementation (with XP awarding +
 * achievement checks) in TaskList / HabitList / RoutineList.
 */
export function TodayFocus({
  overdueTasks,
  pendingHabits,
  unfinishedRoutines,
  suggestions,
  onDismissSuggestion,
}: {
  overdueTasks: Task[];
  pendingHabits: Habit[];
  unfinishedRoutines: Routine[];
  suggestions: Suggestion[];
  onDismissSuggestion: (key: string) => void;
}) {
  const { t } = useTranslation();
  const hasAnything =
    overdueTasks.length > 0 || pendingHabits.length > 0 || unfinishedRoutines.length > 0 || suggestions.length > 0;

  const rows: {
    key: string;
    href: string;
    icon: typeof AlertTriangle;
    tone: "danger" | "primary" | "default";
    label: string;
    count: number;
  }[] = [
    ...(overdueTasks.length > 0
      ? [{ key: "overdue", href: "/tasks", icon: AlertTriangle, tone: "danger" as const, label: t("today.overdueTasksHeading"), count: overdueTasks.length }]
      : []),
    ...(pendingHabits.length > 0
      ? [{ key: "habits", href: "/habits", icon: Repeat, tone: "primary" as const, label: t("today.habitsTodayHeading"), count: pendingHabits.length }]
      : []),
    ...(unfinishedRoutines.length > 0
      ? [{ key: "routines", href: "/routines", icon: ListChecks, tone: "default" as const, label: t("today.unfinishedRoutinesHeading"), count: unfinishedRoutines.length }]
      : []),
  ];

  const toneClasses = {
    danger: "bg-[var(--color-danger)]/15 text-[var(--color-danger)]",
    primary: "bg-[var(--color-primary)]/12 text-[var(--color-primary)]",
    default: "bg-[var(--color-accent)]/15 text-[var(--color-accent)]",
  };

  if (!hasAnything) {
    return (
      <div className="animate-home-fade-up" style={fadeDelay(120)}>
        <EmptyState message={t("today.allCaughtUp")} />
      </div>
    );
  }

  return (
    <Card
      className="animate-home-fade-up divide-y divide-[var(--color-border)]"
      style={{ ...fadeDelay(120), padding: 0 }}
    >
      {rows.map((row) => (
        <Link
          key={row.key}
          href={row.href}
          className="focus-ring flex items-center gap-3 p-4 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)]"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClasses[row.tone]}`}>
            <row.icon size={16} aria-hidden="true" />
          </div>
          <span className="flex-1 text-sm font-medium">{row.label}</span>
          <Badge tone={row.tone}>{row.count}</Badge>
          <ChevronRight size={16} className="text-[var(--color-text-muted)] rtl:rotate-180" aria-hidden="true" />
        </Link>
      ))}

      {suggestions.map((s) => (
        <div key={s.key} className="flex items-start gap-3 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
            <Lightbulb size={16} aria-hidden="true" />
          </div>
          <Link href={s.action.href} className="focus-ring min-w-0 flex-1 rounded-[var(--radius-sm)]">
            <p className="text-sm font-medium">{t(s.titleKey, s.titleVars)}</p>
            <p className="text-xs text-[var(--color-text-muted)]">{t(s.descriptionKey, s.descriptionVars)}</p>
          </Link>
          <button
            type="button"
            onClick={() => onDismissSuggestion(s.key)}
            aria-label={t("today.dismiss")}
            className="focus-ring -m-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ))}
    </Card>
  );
}
