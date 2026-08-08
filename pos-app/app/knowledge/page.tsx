"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { KnowledgeBase } from "./knowledge-base";
import type { KbArticle } from "@/lib/types/database";

export default function KnowledgePage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("kb_articles")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        setArticles(data ?? []);
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.knowledge")} userId={user.id}>
      <KnowledgeBase initialArticles={articles} userId={user.id} />
    </AppShell>
  );
}
