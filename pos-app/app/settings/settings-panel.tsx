"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DailyGoalSelector } from "@/components/settings/daily-goal-selector";
import { SupportPartnerSection } from "@/components/settings/support-partner";
import { useToast } from "@/components/ui/toast-context";
import { useTranslation } from "@/lib/i18n/locale-context";

type Theme = "system" | "light" | "dark";

/**
 * Experience Expansion Phase — Screen 8. Every field, button, and action
 * below is unchanged — saveProfile/exportData/importData/applyTheme are
 * byte-for-byte what they were before this pass.
 *
 * Sections were already reasonably organized before this screen (Profile
 * Card, a "world" group for Daily Goal + Support Partner, a Backup &
 * Data block, Quick Access in page.tsx) — that structure wasn't
 * rebuilt. What changed is relative visual weight:
 *  - Profile's heading is promoted to .text-page-title (the same
 *    "this is the point of focus" treatment Calendar's selected-day
 *    panel and Reviews' active session already established) — Settings'
 *    primary purpose, from a user's own perspective, is almost always
 *    adjusting their profile, not backing up data.
 *  - Backup & Data — the most rarely-used action on this screen — loses
 *    its bordered-box treatment, which previously gave it the same
 *    visual weight as the Profile Card sitting above it. Same content,
 *    same buttons, same workflow; it now reads as a quiet, secondary
 *    block instead of a second equally-important panel, the same
 *    demotion technique already used for Knowledge Base's editor
 *    (Screen 6).
 *  - Profile's own fields gained a touch more breathing room (gap-3 →
 *    gap-4).
 */
export function SettingsPanel({
  userId,
  email,
  initialName,
  initialTheme,
}: {
  userId: string;
  email: string;
  initialName: string;
  initialTheme: Theme;
}) {
  const supabase = createClient();
  const { t } = useTranslation();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialName);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [busy, setBusy] = useState(false);

  function applyTheme(next: Theme) {
    const root = document.documentElement;
    const dark = next === "dark" || (next === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("light", !dark);
    try {
      localStorage.setItem("pos-theme", next);
    } catch {
      // localStorage unavailable (private mode) - theme still applies for this session.
    }
  }

  async function saveProfile() {
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name.trim() || null, theme })
      .eq("id", userId);
    applyTheme(theme);
    toast.show(error ? error.message : t("settings.saved"), error ? "danger" : "success");
    setBusy(false);
  }

  function exportData() {
    // Route streams a downloadable JSON attachment.
    window.location.href = "/api/export";
  }

  async function importData(file: File) {
    setBusy(true);
    try {
      const text = await file.text();
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: text,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.show(json.error ?? t("settings.importFailed"), "danger");
      } else {
        const total = Object.values(json.imported ?? {}).reduce((a: number, b) => a + (b as number), 0);
        toast.show(t("settings.importedRecords", { count: total }), "success");
      }
    } catch (e) {
      toast.show(e instanceof Error ? e.message : t("settings.importFailed"), "danger");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Card>
        <h2 className="text-page-title">{t("settings.profile")}</h2>
        <div className="flex flex-col gap-4">
          <label className="text-sm text-[var(--color-text-muted)]">
            {t("settings.displayName")}
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("settings.namePlaceholder")} />
          </label>
          <label className="text-sm text-[var(--color-text-muted)]">
            {t("settings.theme")}
            <div className="mt-1">
              <Select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
                <option value="system">{t("settings.themeSystem")}</option>
                <option value="light">{t("settings.themeLight")}</option>
                <option value="dark">{t("settings.themeDark")}</option>
              </Select>
            </div>
          </label>
          <div className="flex items-center gap-3">
            <Button onClick={saveProfile} loading={busy}>{t("settings.saveProfile")}</Button>
          </div>

          <div className="mt-1 flex flex-col gap-1 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-text-muted)]">
            <div className="flex justify-between">
              <span>{t("settings.email")}</span>
              <span>{email}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("settings.userId")}</span>
              <span className="font-mono">{userId}</span>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <p className="text-stat-label mb-3">{t("settings.worldGroup")}</p>
        <div className="flex flex-col gap-4">
          <DailyGoalSelector userId={userId} />
          <SupportPartnerSection userId={userId} />
        </div>
      </div>

      <div className="mt-2">
        <h2 className="text-stat-label mb-3">{t("settings.backupAndData")}</h2>
        <p className="text-subtitle mb-4">{t("settings.backupDescription")}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={exportData}>{t("settings.exportBackup")}</Button>
          <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()} loading={busy}>
            {t("settings.importBackup")}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </>
  );
}
