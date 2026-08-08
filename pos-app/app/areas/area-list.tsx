"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { awardXp, XP_REWARDS, checkCountAchievement } from "@/lib/gamification";
import type { LifeArea } from "@/lib/types/database";

const PALETTE = ["#6366f1", "#22c55e", "#eab308", "#ef4444", "#06b6d4", "#a855f7", "#f97316"];

export function AreaList({
  initialAreas,
  userId,
}: {
  initialAreas: LifeArea[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate, refreshStats } = useGamification();
  const { t } = useTranslation();
  const [areas, setAreas] = useState<LifeArea[]>(initialAreas);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PALETTE[0]);

  async function addArea(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const { data, error } = await supabase
      .from("life_areas")
      .insert({ user_id: userId, name: name.trim(), description, color })
      .select()
      .single();
    if (!error && data) {
      setAreas([...areas, data]);
      setName("");
      setDescription("");
      setColor(PALETTE[0]);

      const reason = t("areas.createdReason");
      const result = await awardXp(supabase, userId, XP_REWARDS.area_create, reason, "area", data.id);
      if (result) celebrate(result, XP_REWARDS.area_create, reason);

      const firstAch = await checkCountAchievement(supabase, userId, "area_creator", areas.length + 1, 1);
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

  async function deleteArea(id: string) {
    const { error } = await supabase.from("life_areas").delete().eq("id", id);
    if (!error) setAreas(areas.filter((a) => a.id !== id));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={addArea} className="mb-6 flex flex-col gap-2">
        <Input placeholder={t("areas.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea placeholder={t("areas.descriptionPlaceholder")} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="flex items-center gap-2">
          {PALETTE.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`${t("areas.selectColor")} ${c}`}
              className="h-6 w-6 rounded-full border-2"
              style={{ backgroundColor: c, borderColor: color === c ? "#fff" : "transparent" }}
            />
          ))}
          <Button type="submit" className="ml-auto">{t("areas.addButton")}</Button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {areas.length === 0 && <EmptyState message={t("areas.empty")} />}
        {areas.map((area) => (
          <Card key={area.id} className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: area.color }} />
              <div>
                <h3 className="font-medium">{area.name}</h3>
                {area.description && (
                  <p className="text-sm text-[var(--color-text-muted)]">{area.description}</p>
                )}
              </div>
            </div>
            <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(area.id)}>{t("common.delete")}</Button>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteArea(pendingDeleteId);
        }}
      />
    </div>
  );
}
