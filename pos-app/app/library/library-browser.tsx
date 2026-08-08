"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { uid } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { TranslationKey } from "@/lib/i18n/translate";
import { allHabits } from "@/lib/content/habits";
import {
  morningRoutines,
  eveningRoutines,
  weeklyRoutines,
  monthlyRoutines,
} from "@/lib/content/routines";
import { allProjects } from "@/lib/content/projects";
import type { Category, Difficulty } from "@/lib/content/types";
import type { RoutineStep as DbRoutineStep } from "@/lib/types/database";

type Tab = "habits" | "routines" | "journeys";
type TimedRoutineGroup = { timeOfDay: "morning" | "evening" | "anytime"; routines: typeof morningRoutines };

const CATEGORY_KEY: Record<Category, TranslationKey> = {
  spiritual: "library.categorySpiritual",
  work: "library.categoryWork",
  health: "library.categoryHealth",
  learning: "library.categoryLearning",
  social: "library.categorySocial",
};

const DIFFICULTY_KEY: Record<Difficulty, TranslationKey> = {
  beginner: "library.difficultyBeginner",
  intermediate: "library.difficultyIntermediate",
  advanced: "library.difficultyAdvanced",
  expert: "library.difficultyExpert",
};

const DIFFICULTY_TONE: Record<Difficulty, "default" | "primary" | "warning" | "danger"> = {
  beginner: "default",
  intermediate: "primary",
  advanced: "warning",
  expert: "danger",
};

const TAB_KEY: Record<Tab, TranslationKey> = {
  habits: "library.tabHabits",
  routines: "library.tabRoutines",
  journeys: "library.tabJourneys",
};

// Routine groups are tagged with a display/insert time_of_day, since
// RoutineTemplate itself carries no such field (only individual steps have
// optional free-text `time` strings).
const ROUTINE_GROUPS: TimedRoutineGroup[] = [
  { timeOfDay: "morning", routines: morningRoutines },
  { timeOfDay: "evening", routines: eveningRoutines },
  { timeOfDay: "anytime", routines: weeklyRoutines },
  { timeOfDay: "anytime", routines: monthlyRoutines },
];

export function LibraryBrowser({
  userId,
  startedJourneyIds,
}: {
  userId: string;
  startedJourneyIds: Record<string, string>;
}) {
  const supabase = createClient();
  const { t, locale } = useTranslation();
  const [tab, setTab] = useState<Tab>("habits");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");
  const [addedHabitIds, setAddedHabitIds] = useState<Set<string>>(new Set());
  const [addedRoutineIds, setAddedRoutineIds] = useState<Set<string>>(new Set());
  const [journeys, setJourneys] = useState(startedJourneyIds);

  const filteredHabits = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allHabits.filter(
      (h) =>
        (category === "all" || h.category === category) &&
        (!q || h.title_ar.includes(q) || h.title_en.toLowerCase().includes(q))
    );
  }, [category, query]);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProjects.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!q || p.title_ar.includes(q) || p.title_en.toLowerCase().includes(q))
    );
  }, [category, query]);

  async function addHabit(h: (typeof allHabits)[number]) {
    const { error } = await supabase.from("habits").insert({
      user_id: userId,
      name: h.title_ar,
      cadence: h.frequency === "daily" ? "daily" : "weekly",
      target_count: 1,
    });
    if (!error) setAddedHabitIds((prev) => new Set(prev).add(h.id));
  }

  async function addRoutine(r: (typeof morningRoutines)[number], timeOfDay: "morning" | "evening" | "anytime") {
    const steps: DbRoutineStep[] = r.steps.map((s) => ({
      id: uid(),
      label: s.action_ar,
      done: false,
    }));
    const { error } = await supabase.from("routines").insert({
      user_id: userId,
      name: r.title_ar,
      time_of_day: timeOfDay,
      steps,
    });
    if (!error) setAddedRoutineIds((prev) => new Set(prev).add(r.id));
  }

  async function startJourney(projectId: string) {
    const { data, error } = await supabase
      .from("user_journeys")
      .insert({ user_id: userId, project_id: projectId })
      .select()
      .single();
    if (!error && data) setJourneys((prev) => ({ ...prev, [projectId]: data.started_at }));
  }

  const categories: (Category | "all")[] = ["all", "spiritual", "work", "health", "learning", "social"];

  return (
    <div className="mx-auto max-w-4xl">
      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-[var(--color-border)]">
        {(["habits", "routines", "journeys"] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              tab === tabKey
                ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            {t(TAB_KEY[tabKey])}
          </button>
        ))}
      </div>

      <Input
        placeholder={t("library.searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-3"
      />

      {tab !== "routines" && (
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)}>
              <Badge tone={category === c ? "primary" : "default"}>
                {c === "all" ? t("library.allCategories") : t(CATEGORY_KEY[c])}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {/* Habits tab */}
      {tab === "habits" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredHabits.length === 0 && <EmptyState message={t("library.noResults")} />}
          {filteredHabits.map((h) => {
            const added = addedHabitIds.has(h.id);
            return (
              <Card key={h.id} className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{h.icon}</span>
                    <h3 className="font-medium">{locale === "ar" ? h.title_ar : h.title_en}</h3>
                  </div>
                  <Badge tone={DIFFICULTY_TONE[h.difficulty]}>{t(DIFFICULTY_KEY[h.difficulty])}</Badge>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {locale === "ar" ? h.description_ar : h.description_en}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>{t("library.xpValue", { xp: h.xpReward })}</span>
                    {h.minLevel > 1 && <span>· {t("library.minLevelNote", { level: h.minLevel })}</span>}
                  </div>
                  <Button variant={added ? "secondary" : "primary"} disabled={added} onClick={() => addHabit(h)}>
                    {added ? t("library.addedHabit") : t("library.addHabit")}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Routines tab */}
      {tab === "routines" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROUTINE_GROUPS.flatMap((group) =>
            group.routines.map((r) => {
              const added = addedRoutineIds.has(r.id);
              return (
                <Card key={r.id} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{r.icon}</span>
                      <h3 className="font-medium">{locale === "ar" ? r.title_ar : r.title_en}</h3>
                    </div>
                    <Badge tone={DIFFICULTY_TONE[r.difficulty]}>{t(DIFFICULTY_KEY[r.difficulty])}</Badge>
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {locale === "ar" ? r.description_ar : r.description_en}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {t("library.routineDuration", { minutes: r.totalMinutes })} · {t("library.xpValue", { xp: r.xpReward })}
                    </span>
                    <Button
                      variant={added ? "secondary" : "primary"}
                      disabled={added}
                      onClick={() => addRoutine(r, group.timeOfDay)}
                    >
                      {added ? t("library.addedRoutine") : t("library.addRoutine")}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Journeys tab */}
      {tab === "journeys" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredProjects.length === 0 && <EmptyState message={t("library.noResults")} />}
          {filteredProjects.map((p) => {
            const startedAt = journeys[p.id];
            const daysSince = startedAt
              ? Math.min(p.durationDays, Math.floor((Date.now() - new Date(startedAt).getTime()) / 86400000) + 1)
              : 0;
            return (
              <Card key={p.id} className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{p.icon}</span>
                    <h3 className="font-medium">{locale === "ar" ? p.title_ar : p.title_en}</h3>
                  </div>
                  <Badge tone={DIFFICULTY_TONE[p.difficulty]}>{t(DIFFICULTY_KEY[p.difficulty])}</Badge>
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {locale === "ar" ? p.description_ar : p.description_en}
                </p>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {t("library.journeyDailyCommitment", { minutes: p.dailyCommitmentMinutes })}
                </span>

                {startedAt ? (
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)]"
                        style={{ width: `${(daysSince / p.durationDays) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[var(--color-primary)]">
                      {t("library.journeyDay", { current: daysSince, total: p.durationDays })}
                    </span>
                  </div>
                ) : (
                  <Button onClick={() => startJourney(p.id)} className="self-start">
                    {t("library.startJourney")}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
