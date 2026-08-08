"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/locale-context";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MIN_DAYS_TO_SHOW = 100;

/**
 * A self-contained, self-fetching reflective message shown once a user has
 * been active for 100+ days — deliberately framed as a message, not a
 * stats dashboard, to reinforce identity/meaning (per the research
 * discussed: SDT competence/relatedness) rather than raw numbers alone.
 * Renders nothing before day 100 or while loading, so it never disrupts
 * the achievements page for newer users.
 */
export function ReflectionCard({ userId, xp, longestStreak }: { userId: string; xp: number; longestStreak: number }) {
  const supabase = createClient();
  const { t } = useTranslation();
  const [daysSince, setDaysSince] = useState<number | null>(null);
  const [journeysStarted, setJourneysStarted] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const createdAt = userData.user?.created_at;
      if (createdAt) {
        setDaysSince(Math.floor((Date.now() - new Date(createdAt).getTime()) / MS_PER_DAY));
      }
      const { count } = await supabase
        .from("user_journeys")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId);
      setJourneysStarted(count ?? 0);
    })();
  }, [userId]);

  if (daysSince === null || daysSince < MIN_DAYS_TO_SHOW) return null;

  return (
    <Card className="flex flex-col gap-2 border-[var(--color-primary)]/30">
      <h3 className="text-section-title">{t("today.reflectionTitle")}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
        {t("today.reflectionBody", { days: daysSince, xp, streak: longestStreak, journeys: journeysStarted })}
      </p>
    </Card>
  );
}
