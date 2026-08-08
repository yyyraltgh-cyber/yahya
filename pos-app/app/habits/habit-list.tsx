"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { awardXp, XP_REWARDS, checkCountAchievement } from "@/lib/gamification";
import type { Database } from "@/lib/types/database";

type Habit = Database["public"]["Tables"]["habits"]["Row"];

// Purely presentational threshold — a habit kept for at least this many
// days gets a quiet visual acknowledgment (see ESTABLISHED_RING_CLASS
// below). Not a streak, not a count shown anywhere, just a ring color.
const ESTABLISHED_AFTER_DAYS = 3;

/**
 * Experience Expansion Phase — Screen 2.
 *
 * Purpose: the most direct, most frequent evidence of consistency in the
 * whole product — per the Product Transformation Matrix, the single
 * highest-leverage screen for expressing "something real is growing"
 * outside the Garden itself, and previously the clearest failure of
 * that: every habit, one day old or two hundred, rendered identically.
 *
 * What changed is entirely presentational, using only data this
 * component already receives:
 *  - habit.created_at (already part of every fetched row — zero new
 *    query) distinguishes a just-added habit from an established one,
 *    expressed as a quiet ring-color shift toward var(--color-primary)
 *    — the exact color that already means "growth" everywhere else in
 *    this app (the Garden itself, the "growth" Location Family). No
 *    number, no badge, no streak count is shown anywhere — Garden
 *    Philosophy (Constitution §6) is explicit that growth is "never a
 *    game score," and a visible day-count here would be exactly that.
 *  - habits not yet done today are grouped above habits already tended,
 *    the same "what needs attention surfaces first" principle Home's
 *    Focus list and the Tasks screen (Screen 1) already established —
 *    a pure client-side reorder of the same `logged` Set this component
 *    already tracked.
 *
 * addHabit/toggleToday/deleteHabit below are unchanged from before this
 * screen's redesign — same queries, same mutations, same hooks.
 *
 * World Engine: not touched. Habits already inherits the shared
 * environment (WorldAmbient's "growth" location tint — the same family
 * this screen's own visual language now echoes in the ring color — plus
 * WorldSurface grounding and the completion pulse) automatically through
 * the layout. No new World consumption was added here, on the same
 * "don't force every consumer" discipline already applied to Screen 1.
 */
export function HabitList({
  initialHabits,
  loggedHabitIds,
  userId,
}: {
  initialHabits: Habit[];
  loggedHabitIds: string[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate, refreshStats } = useGamification();
  const { t } = useTranslation();
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [logged, setLogged] = useState<Set<string>>(new Set(loggedHabitIds));
  const [name, setName] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function addHabit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const { data, error } = await supabase
      .from("habits")
      .insert({ user_id: userId, name: name.trim() })
      .select()
      .single();

    if (!error && data) {
      setHabits([...habits, data]);
      setName("");
    }
  }

  async function toggleToday(habit: Habit) {
    const isLogged = logged.has(habit.id);
    const next = new Set(logged);

    if (isLogged) {
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habit.id)
        .eq("logged_on", today);
      next.delete(habit.id);
    } else {
      await supabase.from("habit_logs").insert({
        habit_id: habit.id,
        user_id: userId,
        logged_on: today,
      });
      next.add(habit.id);

      const reason = t("habits.loggedReason");
      const result = await awardXp(supabase, userId, XP_REWARDS.habit_log, reason, "habit", habit.id);
      if (result) celebrate(result, XP_REWARDS.habit_log, reason);

      const firstAch = await checkCountAchievement(supabase, userId, "first_habit", next.size, 1);
      if (firstAch) {
        celebrate(
          { newXp: 0, oldLevel: 0, newLevel: 0, leveledUp: false, newStreak: 0, streakExtended: false, unlockedAchievements: [firstAch] },
          0,
          ""
        );
      }
      refreshStats();
    }
    setLogged(next);
  }

  async function deleteHabit(id: string) {
    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (!error) setHabits(habits.filter((h) => h.id !== id));
  }

  const isEstablished = (habit: Habit) => {
    const days = (Date.now() - new Date(habit.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return days >= ESTABLISHED_AFTER_DAYS;
  };

  const pendingHabits = habits.filter((h) => !logged.has(h.id));
  const doneHabits = habits.filter((h) => logged.has(h.id));

  const habitRow = (habit: Habit) => {
    const done = logged.has(habit.id);
    return (
      <Card key={habit.id} className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleToday(habit)}
            className="focus-ring -m-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            aria-label={done ? t("habits.markIncomplete") : t("habits.markComplete")}
          >
            <span
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-colors duration-[var(--duration-fast)]",
                done
                  ? "animate-checkbox-complete border-[var(--color-success)] bg-[var(--color-success)]"
                  : isEstablished(habit)
                    ? "border-[var(--color-primary)]/40"
                    : "border-[var(--color-border)]"
              )}
            />
          </button>
          <span className={cn(done && "text-[var(--color-text-muted)]")}>{habit.name}</span>
        </div>
        <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(habit.id)}>
          {t("common.delete")}
        </Button>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={addHabit} className="mb-6 flex gap-2">
        <Input
          placeholder={t("habits.placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit">{t("common.add")}</Button>
      </form>

      {habits.length === 0 ? (
        <EmptyState message={t("habits.empty")} />
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">{pendingHabits.map(habitRow)}</div>

          {doneHabits.length > 0 && (
            <div>
              <p className="text-stat-label mb-2">{t("habits.doneTodaySection")}</p>
              <div className="flex flex-col gap-2">{doneHabits.map(habitRow)}</div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteHabit(pendingDeleteId);
        }}
      />
    </div>
  );
}
