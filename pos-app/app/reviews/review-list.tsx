"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatDate, todayISO, weekStartISO } from "@/lib/utils";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { awardXp, XP_REWARDS, checkCountAchievement } from "@/lib/gamification";
import type { Review } from "@/lib/types/database";

const KINDS = ["daily", "weekly", "monthly"] as const;

const KIND_KEY = {
  daily: "reviews.kinds.daily",
  weekly: "reviews.kinds.weekly",
  monthly: "reviews.kinds.monthly",
} as const;

/**
 * Experience Expansion Phase — Screen 5.
 *
 * Purpose: reflection — per the World Map, framed as "the Sanctuary,"
 * deliberately the quietest, dimmest room of the warm family. Before
 * this pass the active session and its own history read at nearly the
 * same visual weight, the reflection fields were cramped (2 rows for
 * open-ended writing), and the kind/rating controls sat at the top like
 * a form header rather than quiet metadata around the actual writing.
 *
 * What changed is entirely presentational — addReview/deleteReview/
 * periodStartFor below are unchanged:
 *  - The active session's heading is promoted to .text-page-title (the
 *    same "this is the point of focus" treatment Calendar's selected-day
 *    panel — Screen 4 — already established), and the Card itself gets
 *    a quiet accent-toned top border using existing tokens directly
 *    (border-t-2 border-[var(--color-accent)]/30) — no World Engine
 *    involved, just the same color the app already uses for warm,
 *    reflective surfaces.
 *  - Reflection Textareas grow from 2 rows to 3 — more room to actually
 *    write, not just note.
 *  - The kind/rating row shrinks in visual weight (smaller text, muted
 *    color, tighter to its own row) so it reads as metadata around the
 *    writing rather than a form header above it — the same instinct
 *    behind reducing "the administrative feeling," without changing
 *    what either control does or how they're wired.
 *  - Past reviews now group by kind (daily/weekly/monthly), the exact
 *    same KIND_KEY-driven pattern already used for Routines' time-of-day
 *    grouping (Screen 3) — pure client-side grouping of the same
 *    `reviews` array, no new query.
 */
export function ReviewList({
  initialReviews,
  userId,
}: {
  initialReviews: Review[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate, refreshStats } = useGamification();
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("weekly");
  const [wentWell, setWentWell] = useState("");
  const [toImprove, setToImprove] = useState("");
  const [rating, setRating] = useState(3);
  const [error, setError] = useState<string | null>(null);

  function periodStartFor(k: (typeof KINDS)[number]) {
    if (k === "daily") return todayISO();
    if (k === "weekly") return weekStartISO();
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  }

  async function addReview(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const period_start = periodStartFor(kind);
    const { data, error } = await supabase
      .from("reviews")
      .insert({ user_id: userId, kind, period_start, went_well: wentWell, to_improve: toImprove, rating })
      .select()
      .single();
    if (error) {
      setError(
        error.code === "23505"
          ? t("reviews.duplicateError", { kind: t(KIND_KEY[kind]) })
          : error.message
      );
      return;
    }
    if (data) {
      setReviews([data, ...reviews]);
      setWentWell("");
      setToImprove("");
      setRating(3);

      const reason = t("reviews.submittedReason");
      const result = await awardXp(supabase, userId, XP_REWARDS.review_submit, reason, "review", data.id);
      if (result) celebrate(result, XP_REWARDS.review_submit, reason);

      const firstAch = await checkCountAchievement(supabase, userId, "first_review", reviews.length + 1, 1);
      if (firstAch) {
        celebrate(
          { newXp: 0, oldLevel: 0, newLevel: 0, leveledUp: false, newStreak: 0, streakExtended: false, unlockedAchievements: [firstAch] },
          0,
          ""
        );
      }
      refreshStats();
    }
  }

  async function deleteReview(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) setReviews(reviews.filter((r) => r.id !== id));
  }

  const hasContent = wentWell.trim().length > 0 || toImprove.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="mb-6 border-t-2 border-[var(--color-accent)]/30">
        <h2 className="text-page-title">{t("reviews.sessionHeading")}</h2>
        <form onSubmit={addReview} className="flex flex-col gap-5">
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <Select value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])}>
              {KINDS.map((k) => <option key={k} value={k}>{t(KIND_KEY[k])}</option>)}
            </Select>
            <label className="flex items-center gap-2 text-sm">
              {t("reviews.ratingLabel")}
              <Select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-subtitle">{t("reviews.wentWellPlaceholder")}</label>
            <Textarea rows={3} value={wentWell} onChange={(e) => setWentWell(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-subtitle">{t("reviews.toImprovePlaceholder")}</label>
            <Textarea rows={3} value={toImprove} onChange={(e) => setToImprove(e.target.value)} />
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <Button type="submit" variant={hasContent ? "primary" : "secondary"} className="self-start">
            {t("reviews.saveButton")}
          </Button>
        </form>
      </Card>

      {reviews.length > 0 && <h3 className="text-stat-label mb-2">{t("reviews.historyHeading")}</h3>}
      <div className="flex flex-col gap-6">
        {reviews.length === 0 && <EmptyState message={t("reviews.empty")} />}
        {KINDS.map((k) => {
          const inKind = reviews.filter((r) => r.kind === k);
          if (inKind.length === 0) return null;
          return (
            <div key={k}>
              {reviews.length > 0 && new Set(reviews.map((r) => r.kind)).size > 1 && (
                <p className="text-stat-label mb-2">{t(KIND_KEY[k])}</p>
              )}
              <div className="flex flex-col gap-3">
                {inKind.map((r) => (
                  <Card key={r.id}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--color-text-muted)]">{formatDate(r.period_start)}</span>
                        {r.rating && <Badge tone="success">{r.rating}/5</Badge>}
                      </div>
                      <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(r.id)}>{t("common.delete")}</Button>
                    </div>
                    {r.went_well && <p className="text-sm"><span className="text-[var(--color-success)]">+ </span>{r.went_well}</p>}
                    {r.to_improve && <p className="text-sm"><span className="text-[var(--color-warning)]">→ </span>{r.to_improve}</p>}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteReview(pendingDeleteId);
        }}
      />
    </div>
  );
}
