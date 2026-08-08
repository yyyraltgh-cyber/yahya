"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/locale-context";

const SUGGESTED_AREA_KEYS = ["health", "work", "relationships", "finance", "learning", "hobbies"] as const;
type SuggestedAreaKey = (typeof SUGGESTED_AREA_KEYS)[number];

const AREA_LABEL_KEY = {
  health: "onboarding.suggestedAreas.health",
  work: "onboarding.suggestedAreas.work",
  relationships: "onboarding.suggestedAreas.relationships",
  finance: "onboarding.suggestedAreas.finance",
  learning: "onboarding.suggestedAreas.learning",
  hobbies: "onboarding.suggestedAreas.hobbies",
} as const;

export function OnboardingFlow({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<SuggestedAreaKey[]>(["health", "work"]);
  const [saving, setSaving] = useState(false);

  function toggleArea(a: SuggestedAreaKey) {
    setSelectedAreas((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));
  }

  async function finish() {
    setSaving(true);
    const palette = ["#6366f1", "#22c55e", "#eab308", "#ef4444", "#06b6d4", "#a855f7"];

    await supabase
      .from("profiles")
      .update({ full_name: name.trim() || null, onboarded: true })
      .eq("id", userId);

    if (selectedAreas.length > 0) {
      await supabase.from("life_areas").insert(
        selectedAreas.map((key, i) => ({
          user_id: userId,
          name: t(AREA_LABEL_KEY[key]),
          color: palette[i % palette.length],
        }))
      );
    }

    await supabase.from("notifications").insert({
      user_id: userId,
      title: t("onboarding.welcomeNotifTitle"),
      body: t("onboarding.welcomeNotifBody"),
      kind: "system",
    });

    router.push("/dashboard");
    router.refresh();
  }

  const total = 3;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <div className="mb-4 flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i < step ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold">{t("onboarding.welcomeHeading")}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{t("onboarding.welcomeBody")}</p>
            <Button onClick={() => setStep(2)} className="self-end">{t("onboarding.getStarted")}</Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold">{t("onboarding.nameHeading")}</h1>
            <Input placeholder={t("settings.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>{t("common.back")}</Button>
              <Button onClick={() => setStep(3)}>{t("common.next")}</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold">{t("onboarding.areasHeading")}</h1>
            <p className="text-sm text-[var(--color-text-muted)]">{t("onboarding.areasBody")}</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_AREA_KEYS.map((a) => (
                <button key={a} type="button" onClick={() => toggleArea(a)}>
                  <Badge tone={selectedAreas.includes(a) ? "primary" : "default"}>{t(AREA_LABEL_KEY[a])}</Badge>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(2)}>{t("common.back")}</Button>
              <Button onClick={finish} disabled={saving}>
                {saving ? t("onboarding.settingUp") : t("common.finish")}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
