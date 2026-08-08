"use client";

import { useEffect, useState } from "react";
import { Sparkle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/locale-context";
import { todayISO, fadeDelay } from "@/lib/utils";

/**
 * A once-a-day intention prompt ("بم تنوي اليوم؟"), deliberately separate
 * from tasks/habits and from any XP/streak mechanic — this is the opposite
 * of achievement-tracking, not another thing to "complete." Self-contained:
 * fetches and saves its own state, independent of the dashboard's data load.
 */
export function NiyyahCard({ userId }: { userId: string }) {
  const supabase = createClient();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const today = todayISO();
    supabase
      .from("daily_intentions")
      .select("text")
      .eq("user_id", userId)
      .eq("intention_date", today)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setText(data.text);
          setSaved(true);
        }
        setLoaded(true);
      });
  }, [userId]);

  async function save() {
    if (!text.trim()) return;
    const { error } = await supabase
      .from("daily_intentions")
      .upsert(
        { user_id: userId, intention_date: todayISO(), text: text.trim() },
        { onConflict: "user_id,intention_date" }
      );
    if (!error) setSaved(true);
  }

  if (!loaded) return null;

  return (
    <Card style={fadeDelay(210)} className="animate-home-fade-up">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
          <Sparkle size={14} aria-hidden="true" />
        </div>
        <h3 className="font-medium">{t("today.niyyahPrompt")}</h3>
      </div>
      {saved ? (
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">{text}</p>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("today.niyyahPlaceholder")}
            rows={2}
            className="sm:flex-1"
          />
          <Button onClick={save} className="self-start sm:self-end">
            {t("common.save")}
          </Button>
        </div>
      )}
    </Card>
  );
}
