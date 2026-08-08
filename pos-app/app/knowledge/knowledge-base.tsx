"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { useGamification } from "@/components/gamification/gamification-context";
import { useTranslation } from "@/lib/i18n/locale-context";
import { checkCountAchievement } from "@/lib/gamification";
import type { KbArticle } from "@/lib/types/database";

/**
 * Experience Expansion Phase — Screen 6. Every bar rendered here still
 * comes from the exact same source data this component already had —
 * no new query, no new hook, no changed calculation.
 *
 * Purpose: reading and keeping personal knowledge. Before this pass the
 * create/edit form's own bordered box visually competed with the
 * reading Cards below it for the same "boxed content" attention, and
 * article bodies rendered at the same small text size as UI chrome —
 * reading wasn't visually prioritized over editing, despite reading
 * being what this screen is for most of the time.
 *
 * What changed is entirely presentational — save/reset/startEdit/remove
 * below are unchanged:
 *  - The create/edit area lost its bordered-box treatment (no more
 *    competing "box" language against the article Cards below it) and
 *    gained more breathing room — a taller Textarea (4 rows → 6) and a
 *    full-size submit button instead of size="sm", so writing a new
 *    article feels like an intentional space, not a cramped form row.
 *  - Article bodies grow from text-sm to the base reading size, with
 *    their measure constrained to max-w-prose (a standard Tailwind
 *    utility, not a new component) — a genuine, comfortable reading
 *    line length instead of stretching full width.
 *  - More vertical separation between the editing zone and the article
 *    list (mb-8 → mb-10) reinforces that they're two different modes,
 *    not one continuous block.
 */
export function KnowledgeBase({
  initialArticles,
  userId,
}: {
  initialArticles: KbArticle[];
  userId: string;
}) {
  const supabase = createClient();
  const { celebrate } = useGamification();
  const { t } = useTranslation();
  const [articles, setArticles] = useState<KbArticle[]>(initialArticles);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [articles, query]);

  function parseTags(s: string) {
    return s.split(",").map((t) => t.trim()).filter(Boolean);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = parseTags(tagsInput);

    if (editingId) {
      const { data, error } = await supabase
        .from("kb_articles")
        .update({ title: title.trim(), body, tags })
        .eq("id", editingId)
        .select()
        .single();
      if (!error && data) {
        setArticles(articles.map((a) => (a.id === editingId ? data : a)));
        reset();
      }
    } else {
      const { data, error } = await supabase
        .from("kb_articles")
        .insert({ user_id: userId, title: title.trim(), body, tags })
        .select()
        .single();
      if (!error && data) {
        setArticles([data, ...articles]);
        reset();

        const ach = await checkCountAchievement(supabase, userId, "knowledge_5", articles.length + 1, 5);
        if (ach) {
          celebrate(
            { newXp: 0, oldLevel: 0, newLevel: 0, leveledUp: false, newStreak: 0, streakExtended: false, unlockedAchievements: [ach] },
            0,
            ""
          );
        }
      }
    }
  }

  function reset() {
    setEditingId(null);
    setTitle("");
    setBody("");
    setTagsInput("");
  }

  function startEdit(a: KbArticle) {
    setEditingId(a.id);
    setTitle(a.title);
    setBody(a.body);
    setTagsInput(a.tags.join(", "));
  }

  async function remove(id: string) {
    const { error } = await supabase.from("kb_articles").delete().eq("id", id);
    if (!error) {
      setArticles(articles.filter((a) => a.id !== id));
      if (editingId === id) reset();
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Input
        placeholder={t("knowledge.searchPlaceholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-8"
      />

      <div className="mb-10">
        <h2 className="text-stat-label mb-3">{t("knowledge.newArticleHeading")}</h2>
        <form onSubmit={save} className="flex flex-col gap-3">
          <Input placeholder={t("knowledge.titlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder={t("knowledge.bodyPlaceholder")} rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
          <Input placeholder={t("knowledge.tagsPlaceholder")} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
          <div className="flex gap-2">
            <Button type="submit">{editingId ? t("common.save") : t("knowledge.addButton")}</Button>
            {editingId && <Button type="button" variant="ghost" onClick={reset}>{t("common.cancel")}</Button>}
          </div>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 && <EmptyState message={query ? t("knowledge.emptyWithQuery") : t("knowledge.emptyNoQuery")} />}
        {filtered.map((a) => (
          <Card
            key={a.id}
            className={a.id === editingId ? "border-[var(--color-primary)]/50" : undefined}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-section-title !mb-0">{a.title}</h3>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="sm" onClick={() => startEdit(a)}>{t("common.edit")}</Button>
                <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(a.id)}>{t("common.delete")}</Button>
              </div>
            </div>
            {a.body && <p className="max-w-prose whitespace-pre-wrap leading-relaxed">{a.body}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {a.tags.map((t) => <Chip key={t}>{t}</Chip>)}
              <span className="ms-auto text-xs text-[var(--color-text-muted)]">{formatDate(a.updated_at)}</span>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) remove(pendingDeleteId);
        }}
      />
    </div>
  );
}
