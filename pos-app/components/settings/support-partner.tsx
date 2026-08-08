"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { SupportPartner } from "@/lib/types/database";

/**
 * A single, optional, non-competitive accountability partner. Deliberately
 * NOT a leaderboard or party system (Habitica's HP-loss-on-miss mechanic
 * was explicitly flagged as harmful in the research this feature is based
 * on) — each side only ever sees whether the other was active *today*
 * (yes/no), never streaks, tasks, habits, or any other detail. RLS
 * enforces this at the database level (see migration 0006): each row only
 * exposes its own status column to both parties, nothing else.
 */
export function SupportPartnerSection({ userId }: { userId: string }) {
  const supabase = createClient();
  const { t } = useTranslation();
  const [partnerId, setPartnerId] = useState("");
  const [pairing, setPairing] = useState<SupportPartner | null>(null);
  const [partnerActiveToday, setPartnerActiveToday] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("support_partners")
        .select("*")
        .or(`user_id.eq.${userId},partner_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setPairing(data ?? null);
      setLoading(false);
    })();
  }, [userId]);

  useEffect(() => {
    if (!pairing || pairing.status !== "accepted") return;
    const otherId = pairing.user_id === userId ? pairing.partner_id : pairing.user_id;
    // Direct xp_events access is blocked by RLS for anyone but the row's
    // owner — this narrow RPC (see migration 0006) returns only a boolean
    // after verifying an accepted pairing, never raw event rows.
    supabase.rpc("partner_active_today", { target_user_id: otherId }).then(({ data }) => {
      setPartnerActiveToday(data ?? null);
    });
  }, [pairing, userId]);

  async function invite() {
    setError(null);
    if (!partnerId.trim()) return;
    const { data, error } = await supabase
      .from("support_partners")
      .insert({ user_id: userId, partner_id: partnerId.trim() })
      .select()
      .single();
    if (error) {
      setError(error.message);
      return;
    }
    setPairing(data);
    setPartnerId("");
  }

  async function respond(status: "accepted" | "declined") {
    if (!pairing) return;
    const { data, error } = await supabase
      .from("support_partners")
      .update({ status })
      .eq("id", pairing.id)
      .select()
      .single();
    if (!error && data) setPairing(data);
  }

  if (loading) return null;

  const isInvitee = pairing?.partner_id === userId && pairing.status === "pending";

  return (
    <Card>
      <h2 className="text-section-title">{t("settings.supportPartner")}</h2>
      <p className="text-subtitle mb-4">{t("settings.supportPartnerDescription")}</p>

      {!pairing && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder={t("settings.supportPartnerIdPlaceholder")}
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          />
          <Button onClick={invite}>{t("settings.supportPartnerInvite")}</Button>
        </div>
      )}

      {pairing && isInvitee && (
        <div className="flex items-center gap-2">
          <Badge tone="primary">{t("settings.supportPartnerPendingInvite")}</Badge>
          <Button onClick={() => respond("accepted")}>{t("common.confirm")}</Button>
          <Button variant="secondary" onClick={() => respond("declined")}>{t("common.cancel")}</Button>
        </div>
      )}

      {pairing && !isInvitee && pairing.status === "pending" && (
        <Badge>{t("settings.supportPartnerAwaitingResponse")}</Badge>
      )}

      {pairing && pairing.status === "accepted" && (
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${partnerActiveToday ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"}`}
          />
          <span className="text-sm text-[var(--color-text-muted)]">
            {partnerActiveToday ? t("settings.supportPartnerActiveToday") : t("settings.supportPartnerQuietToday")}
          </span>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>}
    </Card>
  );
}
