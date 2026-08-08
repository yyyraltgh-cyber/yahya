"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthGuard } from "@/lib/use-auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { useTranslation } from "@/lib/i18n/locale-context";
import { ReviewList } from "./review-list";
import type { Review } from "@/lib/types/database";

export default function ReviewsPage() {
  const { user, loading } = useAuthGuard();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("reviews")
      .select("*")
      .eq("user_id", user.id)
      .order("period_start", { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? []);
        setReady(true);
      });
  }, [user]);

  if (loading || !user || !ready) return <LoadingScreen />;

  return (
    <AppShell title={t("nav.reviews")} userId={user.id}>
      <ReviewList initialReviews={reviews} userId={user.id} />
    </AppShell>
  );
}
