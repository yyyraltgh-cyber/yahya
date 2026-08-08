"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { AreaList } from "./area-list";
import type { LifeArea } from "@/lib/types/database";

export default function AreasPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [areas, setAreas] = useState<LifeArea[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("life_areas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at")
      .then(({ data }) => {
        setAreas(data ?? []);
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.areas")} userId={user.id}>
      <AreaList initialAreas={areas} userId={user.id} />
    </AppShell>
  );
}
