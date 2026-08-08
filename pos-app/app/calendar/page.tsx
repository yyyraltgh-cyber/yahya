"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { CalendarView } from "./calendar-view";
import type { CalendarEvent } from "@/lib/types/database";

export default function CalendarPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("starts_at")
      .then(({ data }) => {
        setEvents(data ?? []);
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.calendar")} userId={user.id}>
      <CalendarView initialEvents={events} userId={user.id} />
    </AppShell>
  );
}
