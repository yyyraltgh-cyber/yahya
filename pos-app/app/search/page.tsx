"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { GlobalSearch, type SearchEntryType } from "./global-search";

type Entry = { type: SearchEntryType; href: string; title: string; snippet: string };

export default function SearchPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [index, setIndex] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    (async () => {
      const [tasks, notes, kb, events, areas] = await Promise.all([
        supabase.from("tasks").select("id,title,description").eq("user_id", user.id),
        supabase.from("notes").select("id,title,content").eq("user_id", user.id),
        supabase.from("kb_articles").select("id,title,body,tags").eq("user_id", user.id),
        supabase.from("events").select("id,title,starts_at").eq("user_id", user.id),
        supabase.from("life_areas").select("id,name,description").eq("user_id", user.id),
      ]);
      const idx: Entry[] = [
        ...(tasks.data ?? []).map((t) => ({ type: "task" as const, href: "/tasks", title: t.title, snippet: t.description ?? "" })),
        ...(notes.data ?? []).map((n) => ({ type: "note" as const, href: "/notes", title: n.title, snippet: n.content })),
        ...(kb.data ?? []).map((a) => ({ type: "knowledge" as const, href: "/knowledge", title: a.title, snippet: `${a.body} ${a.tags.join(" ")}` })),
        ...(events.data ?? []).map((e) => ({ type: "event" as const, href: "/calendar", title: e.title, snippet: e.starts_at })),
        ...(areas.data ?? []).map((a) => ({ type: "area" as const, href: "/areas", title: a.name, snippet: a.description ?? "" })),
      ];
      setIndex(idx);
      setReady(true);
    })();
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.search")} userId={user.id}>
      <GlobalSearch index={index} />
    </AppShell>
  );
}
