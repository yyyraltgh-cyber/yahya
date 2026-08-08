"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { useSuggestions } from "@/lib/use-suggestions";
import { useTranslation } from "@/lib/i18n/locale-context";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { GardenStage } from "@/components/today/garden-stage";
import { NiyyahCard } from "@/components/today/niyyah-card";
import { TodayFocus } from "@/components/today/today-focus";
import { TodayBento } from "@/components/today/today-bento";
import { QuickActions } from "@/components/today/quick-actions";
import { HomeSkeleton } from "@/components/today/home-skeleton";
import { todayISO } from "@/lib/utils";
import type { Task, Habit, Routine, CalendarEvent } from "@/lib/types/database";

interface TodayData {
  name: string | null;
  overdueTasks: Task[];
  pendingHabits: Habit[];
  habitsDoneToday: number;
  habitsTotal: number;
  unfinishedRoutines: Routine[];
  upcomingEvents: CalendarEvent[];
  achievementsUnlocked: number;
  achievementsTotal: number;
}

/**
 * EXECUTIVE EXPERIENCE CONTRACT 001 — Garden OS.
 *
 * Home is no longer a page of stacked sections. It's one immersive
 * screen (GardenStage — the Garden, full presence, nothing competing)
 * plus everything else the app already did (Focus, Progress, Niyyah,
 * Quick Actions, Events), now living in a single deliberately-hidden
 * layer the user reveals on demand via the stage's peek bar. Nothing
 * about *what* data is fetched, which hooks run, or how any individual
 * piece works has changed — only when and how it becomes visible.
 */
export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<TodayData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  // Business logic already exists in lib/use-suggestions.ts and the engine
  // it wraps — this page only renders what the hook returns.
  const { suggestions, dismiss } = useSuggestions(user?.id);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    (async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded,full_name")
        .eq("id", user.id)
        .single();

      if (profile && profile.onboarded === false) {
        router.replace("/onboarding");
        return;
      }

      const today = todayISO();

      const [tasksRes, habitsRes, habitLogsRes, routinesRes, eventsRes, achievementsRes, unlockedRes] =
        await Promise.all([
          supabase.from("tasks").select("*").eq("user_id", user.id).neq("status", "done"),
          supabase.from("habits").select("*").eq("user_id", user.id),
          supabase.from("habit_logs").select("habit_id").eq("user_id", user.id).eq("logged_on", today),
          supabase.from("routines").select("*").eq("user_id", user.id),
          supabase
            .from("events")
            .select("*")
            .eq("user_id", user.id)
            .gte("starts_at", new Date().toISOString())
            .order("starts_at")
            .limit(5),
          supabase.from("achievements").select("*", { count: "exact", head: true }),
          supabase.from("user_achievements").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        ]);

      const tasks = tasksRes.data ?? [];
      const habits = habitsRes.data ?? [];
      const loggedHabitIds = new Set((habitLogsRes.data ?? []).map((l) => l.habit_id));
      const routines = routinesRes.data ?? [];

      // Same "overdue" condition already codified in
      // lib/suggestions/task-rules.ts (status !== done, due_date set and in
      // the past) — reused here for the list view, not reinvented.
      const overdueTasks = tasks.filter((t) => t.due_date !== null && t.due_date < today);

      // Broader than the Suggestion Engine's routine rule on purpose: this
      // panel lists anything not fully done today (including untouched
      // routines), while the engine's nudge specifically targets routines
      // the user already started but didn't finish. Two different
      // consumers, two intentionally different (both simple) criteria.
      const unfinishedRoutines = routines.filter(
        (r) => r.steps.length > 0 && r.steps.some((s) => !s.done)
      );

      setData({
        name: profile?.full_name ?? null,
        overdueTasks,
        pendingHabits: habits.filter((h) => !loggedHabitIds.has(h.id)),
        habitsDoneToday: loggedHabitIds.size,
        habitsTotal: habits.length,
        unfinishedRoutines,
        upcomingEvents: eventsRes.data ?? [],
        achievementsUnlocked: unlockedRes.count ?? 0,
        achievementsTotal: achievementsRes.count ?? 0,
      });
      setReady(true);
    })();
  }, [user, router]);

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      // Let the reveal render first, then bring it into view — the
      // stage stays put, the user's attention follows what they asked
      // to see rather than the page jumping under them.
      requestAnimationFrame(() => {
        revealRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  // Pre-auth loading keeps the full-screen spinner (no shell to show yet).
  if (loading || !user) return <LoadingScreen />;

  // Once authenticated, show the real shell immediately with a skeleton
  // in place of content — sidebar/topbar don't disappear and reappear.
  if (!ready || !data) {
    return (
      <AppShell title={t("nav.dashboard")} userId={user.id}>
        <HomeSkeleton />
      </AppShell>
    );
  }

  return (
    <AppShell title={t("nav.dashboard")} userId={user.id}>
      <div className="mx-auto flex max-w-4xl flex-col">
        <GardenStage
          userId={user.id}
          name={data.name}
          habitsDoneToday={data.habitsDoneToday}
          habitsTotalToday={data.habitsTotal}
          achievementsUnlocked={data.achievementsUnlocked}
          achievementsTotal={data.achievementsTotal}
          overdueCount={data.overdueTasks.length}
          pendingHabitsCount={data.pendingHabits.length}
          unfinishedRoutinesCount={data.unfinishedRoutines.length}
          expanded={expanded}
          onToggle={handleToggle}
        />

        {expanded && (
          <div ref={revealRef} className="flex scroll-mt-6 flex-col gap-6 pt-6">
            <TodayFocus
              overdueTasks={data.overdueTasks}
              pendingHabits={data.pendingHabits}
              unfinishedRoutines={data.unfinishedRoutines}
              suggestions={suggestions}
              onDismissSuggestion={dismiss}
            />

            <TodayBento
              userId={user.id}
              achievementsUnlocked={data.achievementsUnlocked}
              achievementsTotal={data.achievementsTotal}
            />

            <NiyyahCard userId={user.id} />

            <QuickActions />

            <div>
              <h3 className="text-section-title flex items-center gap-2">
                <CalendarClock size={16} className="text-[var(--color-primary)]" aria-hidden="true" />
                {t("today.upcomingEvents")}
              </h3>
              {data.upcomingEvents.length === 0 ? (
                <EmptyState
                  message={
                    <>
                      {t("today.noUpcomingEvents")}{" "}
                      <Link href="/calendar" className="text-[var(--color-primary)] hover:underline">
                        {t("today.addOne")}
                      </Link>
                    </>
                  }
                  icon={CalendarClock}
                />
              ) : (
                <Card className="divide-y divide-[var(--color-border)]" style={{ padding: 0 }}>
                  {data.upcomingEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between p-4">
                      <span className="text-sm">{ev.title}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {new Date(ev.starts_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
