"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { HabitList } from "./habit-list";
import { todayISO } from "@/lib/utils";
import type { Habit } from "@/lib/types/database";

export default function HabitsPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loggedIds, setLoggedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const today = todayISO();
    (async () => {
      const [{ data: h }, { data: logs }] = await Promise.all([
        supabase.from("habits").select("*").eq("user_id", user.id).order("created_at"),
        supabase.from("habit_logs").select("*").eq("user_id", user.id).eq("logged_on", today),
      ]);
      setHabits(h ?? []);
      setLoggedIds((logs ?? []).map((l) => l.habit_id));
      setReady(true);
    })();
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.habits")} userId={user.id}>
      <HabitList initialHabits={habits} loggedHabitIds={loggedIds} userId={user.id} />
    </AppShell>
  );
}
