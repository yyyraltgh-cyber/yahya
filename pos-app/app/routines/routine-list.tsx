"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { cn, uid } from "@/lib/utils";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { awardXp, XP_REWARDS, checkCountAchievement } from "@/lib/gamification";
import type { Routine, RoutineStep } from "@/lib/types/database";

const TIMES = ["morning", "afternoon", "evening", "anytime"] as const;

const TIME_OF_DAY_KEY = {
  morning: "routines.timeOfDay.morning",
  afternoon: "routines.timeOfDay.afternoon",
  evening: "routines.timeOfDay.evening",
  anytime: "routines.timeOfDay.anytime",
} as const;

/**
 * Experience Expansion Phase — Screen 3.
 *
 * Purpose: structured, ceremonial sequences — per the World Map (Release
 * 3A), the one screen in the app framed as "the Hearth," the warmest,
 * most ritual-adjacent room in the house. Before this pass it looked
 * like the least ceremonial screen in the app: a flat list, bare
 * "3/5" text for progress, no distinction between morning and evening
 * rituals despite time_of_day already being real, stored data.
 *
 * What changed is entirely presentational, reusing data and components
 * that already existed:
 *  - Routines now group by time_of_day (morning → afternoon → evening →
 *    anytime), the exact order TIMES already defines. Pure client-side
 *    grouping of the same array this component already held — no new
 *    query. timeOfDayLabel() was already computed here; the section
 *    headers below are that same function, not new strings.
 *  - "{done}/{total}" text is replaced with the existing ProgressBar
 *    component (already built for Achievements/TodayBento, unused here
 *    until now) — reusing the Design System instead of a bespoke text
 *    fraction.
 *  - A fully-completed routine's card quietly recedes (reduced opacity),
 *    the same "already tended" visual language Habits (Screen 2) uses
 *    for done-today items — one consistent way the app says "this is
 *    resting," not three different ones per screen.
 *
 * addRoutine/toggleStep/resetRoutine/deleteRoutine below are unchanged.
 * No World Engine consumption was added — Routines already inherits the
 * shared "warm" location tint through the layout; forcing a second,
 * bespoke touch here would repeat Tasks/Habits' own reasoning for
 * declining to.
 */
export function RoutineList({
  initialRoutines,
  userId,
}: {
  initialRoutines: Routine[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate, refreshStats } = useGamification();
  const { t } = useTranslation();
  const [routines, setRoutines] = useState<Routine[]>(initialRoutines);
  const [name, setName] = useState("");
  const [time, setTime] = useState<(typeof TIMES)[number]>("morning");
  const [stepInput, setStepInput] = useState("");
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function addStepDraft() {
    if (!stepInput.trim()) return;
    setSteps([...steps, { id: uid(), label: stepInput.trim(), done: false }]);
    setStepInput("");
  }

  async function addRoutine(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || steps.length === 0) return;
    const { data, error } = await supabase
      .from("routines")
      .insert({ user_id: userId, name: name.trim(), time_of_day: time, steps })
      .select()
      .single();
    if (!error && data) {
      setRoutines([...routines, data]);
      setName("");
      setSteps([]);
      setTime("morning");
    }
  }

  async function toggleStep(routine: Routine, stepId: string) {
    const nextSteps = routine.steps.map((s) =>
      s.id === stepId ? { ...s, done: !s.done } : s
    );
    const { error } = await supabase
      .from("routines")
      .update({ steps: nextSteps })
      .eq("id", routine.id);
    if (!error) {
      setRoutines(routines.map((r) => (r.id === routine.id ? { ...r, steps: nextSteps } : r)));

      // Award XP once, the moment every step in the routine becomes done.
      const wasComplete = routine.steps.every((s) => s.done);
      const nowComplete = nextSteps.every((s) => s.done);
      if (nowComplete && !wasComplete) {
        const reason = t("routines.finishedReason");
        const result = await awardXp(supabase, userId, XP_REWARDS.routine_complete, reason, "routine", routine.id);
        if (result) celebrate(result, XP_REWARDS.routine_complete, reason);

        const firstAch = await checkCountAchievement(supabase, userId, "first_routine", 1, 1);
        if (firstAch) {
          celebrate(
            { newXp: 0, oldLevel: 0, newLevel: 0, leveledUp: false, newStreak: 0, streakExtended: false, unlockedAchievements: [firstAch] },
            0,
            ""
          );
        }
        refreshStats();
      }
    }
  }

  async function resetRoutine(routine: Routine) {
    const nextSteps = routine.steps.map((s) => ({ ...s, done: false }));
    const { error } = await supabase.from("routines").update({ steps: nextSteps }).eq("id", routine.id);
    if (!error) setRoutines(routines.map((r) => (r.id === routine.id ? { ...r, steps: nextSteps } : r)));
  }

  async function deleteRoutine(id: string) {
    const { error } = await supabase.from("routines").delete().eq("id", id);
    if (!error) setRoutines(routines.filter((r) => r.id !== id));
  }

  const timeOfDayLabel = (v: (typeof TIMES)[number]) => t(TIME_OF_DAY_KEY[v]);

  const routineCard = (routine: Routine) => {
    const done = routine.steps.filter((s) => s.done).length;
    const total = routine.steps.length;
    const complete = total > 0 && done === total;
    return (
      <Card key={routine.id} className={cn(complete && "opacity-70")}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{routine.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => resetRoutine(routine)}>{t("routines.resetButton")}</Button>
            <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(routine.id)}>{t("common.delete")}</Button>
          </div>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <ProgressBar percent={total > 0 ? (done / total) * 100 : 0} className="flex-1" />
          <span className="shrink-0 text-xs text-[var(--color-text-muted)]">{done}/{total}</span>
        </div>
        <ul className="flex flex-col gap-1">
          {routine.steps.map((s) => (
            <li key={s.id}>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <Checkbox checked={!!s.done} onChange={() => toggleStep(routine, s.id)} aria-label={s.label} />
                <span className={s.done ? "line-through text-[var(--color-text-muted)]" : ""}>{s.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={addRoutine} className="mb-6 flex flex-col gap-2">
        <div className="flex gap-2">
          <Input placeholder={t("routines.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
          <Select value={time} onChange={(e) => setTime(e.target.value as (typeof TIMES)[number])}>
            {TIMES.map((tOpt) => (
              <option key={tOpt} value={tOpt}>{timeOfDayLabel(tOpt)}</option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder={t("routines.stepPlaceholder")}
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addStepDraft();
              }
            }}
          />
          <Button type="button" variant="secondary" onClick={addStepDraft}>+</Button>
        </div>
        {steps.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {steps.map((s) => (
              <Badge key={s.id} tone="primary">{s.label}</Badge>
            ))}
          </div>
        )}
        <Button type="submit" className="self-start" disabled={!name.trim() || steps.length === 0}>
          {t("routines.createButton")}
        </Button>
      </form>

      {routines.length === 0 ? (
        <EmptyState message={t("routines.empty")} />
      ) : (
        <div className="flex flex-col gap-6">
          {TIMES.map((slot) => {
            const inSlot = routines.filter((r) => r.time_of_day === slot);
            if (inSlot.length === 0) return null;
            return (
              <div key={slot}>
                <p className="text-stat-label mb-2">{timeOfDayLabel(slot)}</p>
                <div className="flex flex-col gap-3">{inSlot.map(routineCard)}</div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteRoutine(pendingDeleteId);
        }}
      />
    </div>
  );
}
