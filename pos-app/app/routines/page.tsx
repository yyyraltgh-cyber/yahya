"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { RoutineList } from "./routine-list";
import type { Routine } from "@/lib/types/database";

export default function RoutinesPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("routines")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at")
      .then(({ data }) => {
        setRoutines(data ?? []);
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.routines")} userId={user.id}>
      <RoutineList initialRoutines={routines} userId={user.id} />
    </AppShell>
  );
}
