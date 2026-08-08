"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { StatTile } from "@/components/ui/stat-tile";
import { CheckCircle2, ListChecks, FileText, Star } from "lucide-react";
import { useTranslation } from "@/lib/i18n/locale-context";
import { StatsCharts } from "./stats-charts";

export default function StatisticsPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState({
    completionRate: 0,
    doneTasks: 0,
    totalTasks: 0,
    notes: 0,
    avgRating: "—",
    eventCount: 0,
    habitSeries: [] as { date: string; count: number }[],
  });

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const sinceISO = since.toISOString().slice(0, 10);

      const [tasks, habitLogs, events, reviews, notes] = await Promise.all([
        supabase.from("tasks").select("status,created_at").eq("user_id", user.id),
        supabase.from("habit_logs").select("logged_on").eq("user_id", user.id).gte("logged_on", sinceISO),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reviews").select("rating").eq("user_id", user.id).not("rating", "is", null),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      const taskRows = tasks.data ?? [];
      const totalTasks = taskRows.length;
      const doneTasks = taskRows.filter((t) => t.status === "done").length;
      const completionRate = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

      const perDay: Record<string, number> = {};
      for (const l of habitLogs.data ?? []) perDay[l.logged_on] = (perDay[l.logged_on] ?? 0) + 1;
      const habitSeries = Object.entries(perDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date: date.slice(5), count }));

      const ratings = (reviews.data ?? []).map((r) => r.rating as number);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";

      setStats({
        completionRate,
        doneTasks,
        totalTasks,
        notes: notes.count ?? 0,
        avgRating,
        eventCount: events.count ?? 0,
        habitSeries,
      });
      setReady(true);
    })();
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.statistics")} userId={user.id}>
      <div className="mx-auto max-w-4xl">
        <StatsCharts habitSeries={stats.habitSeries} completionRate={stats.completionRate} eventCount={stats.eventCount} />

        <div className="mt-8">
          <p className="text-stat-label mb-3">{t("statistics.quickGlance")}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              icon={CheckCircle2}
              tone="primary"
              label={t("statistics.taskCompletion")}
              value={`${stats.completionRate}%`}
            />
            <StatTile
              icon={ListChecks}
              tone="success"
              label={t("statistics.tasksDone")}
              value={`${stats.doneTasks}/${stats.totalTasks}`}
            />
            <StatTile icon={Star} tone="warning" label={t("statistics.avgReview")} value={stats.avgRating} />
            <StatTile icon={FileText} tone="accent" label={t("statistics.notesLabel")} value={stats.notes} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
