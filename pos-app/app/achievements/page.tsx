"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { AchievementGrid } from "./achievement-grid";
import { ReflectionCard } from "@/components/today/reflection-card";
import { levelProgress } from "@/lib/gamification";
import { useTranslation } from "@/lib/i18n/locale-context";
import { StatTile } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Sparkles, Flame, Trophy } from "lucide-react";
import type { Achievement } from "@/lib/types/database";

export default function AchievementsPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    (async () => {
      const [{ data: catalog }, { data: unlocked }, { data: profile }] = await Promise.all([
        supabase.from("achievements").select("*").order("sort_order"),
        supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
        supabase.from("profiles").select("xp,current_streak,longest_streak").eq("id", user.id).single(),
      ]);
      setAchievements(catalog ?? []);
      setUnlockedIds(new Set((unlocked ?? []).map((u) => u.achievement_id)));
      setXp(profile?.xp ?? 0);
      setStreak({ current: profile?.current_streak ?? 0, longest: profile?.longest_streak ?? 0 });
      setReady(true);
    })();
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  const { level, xpIntoLevel, xpForNextLevel, progressPct } = levelProgress(xp);

  return (
    <AppShell title={t("nav.achievements")} userId={user.id}>
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatTile icon={Sparkles} tone="primary" label={t("achievements.level")} value={level}>
            <ProgressBar percent={progressPct} resetKey={xp} />
            <p className="text-[10px] text-[var(--color-text-muted)]">{xpIntoLevel}/{xpForNextLevel} {t("gamification.xp")}</p>
          </StatTile>
          <StatTile icon={Flame} tone="warning" label={t("achievements.currentStreak")} value={streak.current}>
            <p className="text-[10px] text-[var(--color-text-muted)]">{t("achievements.best", { days: streak.longest })}</p>
          </StatTile>
          <StatTile icon={Trophy} tone="accent" label={t("achievements.totalXp")} value={xp}>
            <p className="text-[10px] text-[var(--color-text-muted)]">
              {t("achievements.badgesCount", { unlocked: unlockedIds.size, total: achievements.length })}
            </p>
          </StatTile>
        </div>

        <div className="mb-8">
          <ReflectionCard userId={user.id} xp={xp} longestStreak={streak.longest} />
        </div>

        <AchievementGrid achievements={achievements} unlockedIds={unlockedIds} />
      </div>
    </AppShell>
  );
}
