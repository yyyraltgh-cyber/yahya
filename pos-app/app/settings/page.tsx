"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { SettingsPanel } from "./settings-panel";
import { QuickLinksCard } from "@/components/settings/quick-links";

type Theme = "system" | "light" | "dark";

export default function SettingsPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);
  const [fullName, setFullName] = useState("");
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name ?? "");
          setTheme((data.theme as Theme) ?? "system");
        }
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.settings")} userId={user.id}>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <SettingsPanel userId={user.id} email={user.email ?? ""} initialName={fullName} initialTheme={theme} />

        <div>
          <p className="text-stat-label mb-3">{t("settings.quickAccessGroup")}</p>
          <QuickLinksCard />
        </div>
      </div>
    </AppShell>
  );
}
