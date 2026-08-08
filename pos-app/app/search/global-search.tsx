"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslation } from "@/lib/i18n/locale-context";

export type SearchEntryType = "task" | "note" | "knowledge" | "event" | "area";
type Entry = { type: SearchEntryType; href: string; title: string; snippet: string };

const TYPE_KEY = {
  task: "search.types.task",
  note: "search.types.note",
  knowledge: "search.types.knowledge",
  event: "search.types.event",
  area: "search.types.area",
} as const;

const TYPE_ORDER: SearchEntryType[] = ["task", "note", "knowledge", "event", "area"];

export function GlobalSearch({ index }: { index: Entry[] }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((e) => `${e.title} ${e.snippet}`.toLowerCase().includes(q))
      .slice(0, 50);
  }, [index, query]);

  // Presentational grouping only, by the same `type` field every entry
  // already carries — no new filtering, no new ranking, same 50-result
  // cap as before. A fixed section order (rather than whatever order
  // results happen to arrive in) so the layout is stable across searches.
  const grouped = useMemo(() => {
    const map = new Map<SearchEntryType, Entry[]>();
    for (const r of results) {
      const list = map.get(r.type) ?? [];
      list.push(r);
      map.set(r.type, list);
    }
    return TYPE_ORDER.map((type) => ({ type, items: map.get(type) ?? [] })).filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div className="mx-auto max-w-2xl">
      <Input
        autoFocus
        placeholder={t("search.placeholder")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-8"
      />

      {query.trim() === "" ? (
        <EmptyState message={t("search.prompt")} />
      ) : results.length === 0 ? (
        <EmptyState message={t("search.noResults")} />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ type, items }) => (
            <div key={type}>
              <p className="text-stat-label mb-2">{t(TYPE_KEY[type])}</p>
              <div className="flex flex-col gap-2">
                {items.map((r, i) => (
                  <Link key={`${type}-${i}`} href={r.href}>
                    <Card className="p-3 transition-colors hover:bg-[var(--color-surface-hover)]">
                      <span className="font-medium">{r.title}</span>
                      {r.snippet && (
                        <p className="mt-1 line-clamp-1 text-sm text-[var(--color-text-muted)]">{r.snippet}</p>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
