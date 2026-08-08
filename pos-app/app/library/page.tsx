"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { LibraryBrowser } from "./library-browser";

export default function LibraryPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [startedJourneyIds, setStartedJourneyIds] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("user_journeys")
      .select("project_id,started_at")
      .eq("user_id", user.id)
      .then(({ data }) => {
        const map: Record<string, string> = {};
        for (const row of data ?? []) map[row.project_id] = row.started_at;
        setStartedJourneyIds(map);
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.library")} userId={user.id}>
      <LibraryBrowser userId={user.id} startedJourneyIds={startedJourneyIds} />
    </AppShell>
  );
}
