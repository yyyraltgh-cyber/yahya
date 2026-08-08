"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { cn, formatDate, todayISO } from "@/lib/utils";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { awardXp, XP_REWARDS, checkCountAchievement } from "@/lib/gamification";
import type { Database } from "@/lib/types/database";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

/**
 * Experience Expansion Phase — Screen 1 of N.
 *
 * Purpose: capture and complete concrete, day-to-day commitments. Per
 * the Product Transformation Matrix, this was one of the clearest DNA
 * failures in the app — a flat list with no distinction between "needs
 * attention now" and "later," and due dates that existed in the data
 * but were never shown.
 *
 * What changed here is entirely presentational grouping/sorting of data
 * already fetched by this exact component — no new query, no new
 * mutation, no change to addTask/toggleTask/deleteTask below. Overdue
 * tasks get the same visual language Home's Focus list already uses
 * (danger-tone icon circle, same translation key: today.overdueTasksHeading)
 * for consistency across the two places overdue tasks appear, rather
 * than inventing a second visual grammar for the same concept.
 *
 * World Engine integration: deliberately none added beyond what this
 * screen already inherits automatically (WorldAmbient's "focus" location
 * tint, WorldSurface's grounding, the Checkbox completion pulse). Per
 * the discipline already established for Weather/Rhythm/Wind — "do not
 * force every consumer" — a screen this transactional doesn't need its
 * own bespoke World touch; forcing one in would be decoration, not
 * integration. See the self-review for the explicit reasoning.
 */
export function TaskList({
  initialTasks,
  userId,
}: {
  initialTasks: Task[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate, refreshStats } = useGamification();
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({ user_id: userId, title: title.trim() })
      .select()
      .single();

    if (!error && data) {
      setTasks([data, ...tasks]);
      setTitle("");
    }
  }

  async function toggleTask(task: Task) {
    const nextStatus = task.status === "done" ? "todo" : "done";
    const { error } = await supabase
      .from("tasks")
      .update({ status: nextStatus })
      .eq("id", task.id);

    if (!error) {
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));

      // Award XP only when marking a task as done (not when un-checking it).
      if (nextStatus === "done") {
        const reason = t("tasks.completedReason");
        const result = await awardXp(supabase, userId, XP_REWARDS.task_complete, reason, "task", task.id);
        if (result) celebrate(result, XP_REWARDS.task_complete, reason);

        const doneCount = tasks.filter((t) => t.status === "done").length + 1;
        const firstAch = await checkCountAchievement(supabase, userId, "first_task", doneCount, 1);
        const tenAch = await checkCountAchievement(supabase, userId, "tasks_10", doneCount, 10);
        const fiftyAch = await checkCountAchievement(supabase, userId, "tasks_50", doneCount, 50);
        for (const ach of [firstAch, tenAch, fiftyAch]) {
          if (ach) celebrate({ newXp: 0, oldLevel: 0, newLevel: 0, leveledUp: false, newStreak: 0, streakExtended: false, unlockedAchievements: [ach] }, 0, "");
        }
        refreshStats();
      }
    }
  }

  async function deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (!error) setTasks(tasks.filter((t) => t.id !== id));
  }

  // Presentational grouping only — same "overdue" condition already
  // codified in lib/suggestions/task-rules.ts and reused verbatim by
  // Home's dashboard/page.tsx (status !== done, due_date set and in the
  // past). Not a new rule; the third place this exact condition is
  // written, always the same way.
  const today = todayISO();
  const overdueTasks = tasks.filter((t) => t.status !== "done" && t.due_date !== null && t.due_date < today);
  const otherTasks = tasks
    .filter((t) => !overdueTasks.includes(t))
    .sort((a, b) => {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return a.due_date.localeCompare(b.due_date);
    });

  const taskRow = (task: Task) => (
    <Card key={task.id} className="flex items-center justify-between p-3">
      <label className="flex flex-1 items-center gap-3 cursor-pointer">
        <Checkbox
          checked={task.status === "done"}
          onChange={() => toggleTask(task)}
          aria-label={task.title}
        />
        <span className="flex flex-col">
          <span className={cn(task.status === "done" && "line-through text-[var(--color-text-muted)]")}>
            {task.title}
          </span>
          {task.due_date && task.status !== "done" && (
            <span className="text-xs text-[var(--color-text-muted)]">{formatDate(task.due_date)}</span>
          )}
        </span>
      </label>
      <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(task.id)}>
        {t("common.delete")}
      </Button>
    </Card>
  );

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={addTask} className="mb-6 flex gap-2">
        <Input
          placeholder={t("tasks.addPlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit">{t("common.add")}</Button>
      </form>

      {tasks.length === 0 ? (
        <EmptyState message={t("tasks.empty")} />
      ) : (
        <div className="flex flex-col gap-6">
          {overdueTasks.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-danger)]/15 text-[var(--color-danger)]">
                  <AlertTriangle size={14} aria-hidden="true" />
                </span>
                <h2 className="text-sm font-semibold text-[var(--color-danger)]">
                  {t("today.overdueTasksHeading")}
                </h2>
                <Badge tone="danger" className="ms-auto">
                  {overdueTasks.length}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">{overdueTasks.map(taskRow)}</div>
            </div>
          )}

          {otherTasks.length > 0 && (
            <div>
              {overdueTasks.length > 0 && (
                <h2 className="text-section-title">{t("tasks.otherTasksSection")}</h2>
              )}
              <div className="flex flex-col gap-2">{otherTasks.map(taskRow)}</div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteTask(pendingDeleteId);
        }}
      />
    </div>
  );
}
