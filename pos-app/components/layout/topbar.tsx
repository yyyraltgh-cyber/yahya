"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useGamification } from "@/components/gamification/gamification-context";
import { XpBar } from "@/components/gamification/xp-bar";
import { StreakBadge } from "@/components/gamification/streak-badge";
import { StreakFreezeBadge } from "@/components/gamification/streak-freeze-badge";
import { useTranslation } from "@/lib/i18n/locale-context";

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [unread, setUnread] = useState(0);
  const { xp, currentStreak, streakFreezesAvailable } = useGamification();
  const { t } = useTranslation();

  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      if (active) setUnread(count ?? 0);
    })();
    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4 sm:px-6">
      <h1 className="text-page-title min-w-0 truncate">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/achievements"
          aria-label={t("nav.achievements")}
          className="focus-ring flex items-center gap-2 rounded-[var(--radius-md)] p-1"
        >
          <XpBar xp={xp} />
          <StreakBadge streak={currentStreak} />
          <StreakFreezeBadge count={streakFreezesAvailable} />
        </Link>

        <span className="h-6 w-px bg-[var(--color-border)]" aria-hidden="true" />

        <Link
          href="/notifications"
          className="focus-ring relative rounded-[var(--radius-md)] p-2 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-surface-hover)]"
          aria-label={t("nav.notifications")}
        >
          <Bell size={18} aria-hidden="true" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[9px] font-bold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Link>
        <Button variant="ghost" onClick={handleSignOut}>{t("nav.signOut")}</Button>
      </div>
    </header>
  );
}
