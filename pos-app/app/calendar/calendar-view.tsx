"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/locale-context";
import type { CalendarEvent } from "@/lib/types/database";

function monthMatrix(year: number, month: number): Date[][] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(year, month, 1 - startOffset);
  const weeks: Date[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

/**
 * Experience Expansion Phase — Screen 4.
 *
 * Purpose: per the brief, "today" becomes the visual anchor, not just
 * one more numbered cell in a grid. Before this pass there were really
 * only two visual states (selected vs not) — today only got a thin ring
 * that disappeared the moment any other day was clicked, since selected
 * defaults to today on load and immediately overrides its own marker.
 *
 * What changed is entirely presentational — no calendar math, no query,
 * no hook, no business logic touched:
 *  - Today now carries a soft, persistent fill (bg-primary at 10%
 *    opacity) plus its existing ring, independent of whether it's
 *    selected. Selected keeps the strongest treatment (solid fill).
 *    Regular days stay plain. Three genuinely distinct tiers instead of
 *    two, using only the same color-mix/opacity technique already used
 *    throughout this exact file (the event-count dot, the muted
 *    out-of-month cells).
 *  - The selected day's panel is now a real Card instead of a bare div,
 *    and its heading uses the app's primary heading scale
 *    (.text-page-title) instead of the same .text-section-title the
 *    month navigation uses — the day is the point of focus now, not an
 *    appendage below the grid, and the two headings no longer compete
 *    at the same visual weight.
 *  - The grid gets a touch more breathing room (gap-2, was gap-1.5) —
 *    part of softening the dense, traditional-office-calendar feel.
 *  - Events for the selected day are sorted by start time (a derived,
 *    client-side sort of the same `selectedEvents` array — the fetch
 *    and `events` state are untouched) and show only the time, not the
 *    full date — the date is already stated once, in the panel's own
 *    heading; repeating it per event was redundant.
 */
export function CalendarView({
  initialEvents,
  userId,
}: {
  initialEvents: CalendarEvent[];
  userId: string;
}) {
  const supabase = createClient();
  const { t, locale } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [ref, setRef] = useState(new Date());
  const [selected, setSelected] = useState<string>(new Date().toISOString().slice(0, 10));

  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");

  const year = ref.getFullYear();
  const month = ref.getMonth();
  const weeks = useMemo(() => monthMatrix(year, month), [year, month]);
  const weekdayLabels = [
    t("calendar.mon"), t("calendar.tue"), t("calendar.wed"),
    t("calendar.thu"), t("calendar.fri"), t("calendar.sat"), t("calendar.sun"),
  ];
  const intlLocale = locale === "ar" ? "ar" : "en";

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const ev of events) {
      const key = ev.starts_at.slice(0, 10);
      (map[key] ||= []).push(ev);
    }
    return map;
  }, [events]);

  // Same array eventsByDay already produced — sorted for display only,
  // so events within a day read in chronological order. `events` state
  // itself, and the query that seeded it, are unchanged.
  const selectedEvents = useMemo(
    () => [...(eventsByDay[selected] ?? [])].sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
    [eventsByDay, selected]
  );
  // Same computation useState already used to seed `selected` — not a
  // new value, just kept available to compare each rendered day against.
  const todayKey = new Date().toISOString().slice(0, 10);

  async function addEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !startsAt) return;
    const { data, error } = await supabase
      .from("events")
      .insert({ user_id: userId, title: title.trim(), starts_at: new Date(startsAt).toISOString() })
      .select()
      .single();
    if (!error && data) {
      setEvents([...events, data]);
      setTitle("");
      setStartsAt("");
    }
  }

  async function deleteEvent(id: string) {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) setEvents(events.filter((ev) => ev.id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="secondary" onClick={() => setRef(new Date(year, month - 1, 1))}>‹</Button>
        <h2 className="text-section-title !mb-0">
          {ref.toLocaleDateString(intlLocale, { month: "long", year: "numeric" })}
        </h2>
        <Button variant="secondary" onClick={() => setRef(new Date(year, month + 1, 1))}>›</Button>
      </div>

      <div className="grid grid-cols-7 text-center text-stat-label">
        {weekdayLabels.map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weeks.flat().map((day) => {
          const key = day.toISOString().slice(0, 10);
          const inMonth = day.getMonth() === month;
          const isSelected = key === selected;
          const isToday = key === todayKey;
          const count = (eventsByDay[key] ?? []).length;
          const fullDate = day.toLocaleDateString(locale === "ar" ? "ar" : "en", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-label={t(isSelected ? "calendar.dayLabelSelected" : "calendar.dayLabel", {
                date: fullDate,
                count,
              })}
              aria-current={isSelected ? "date" : undefined}
              className={[
                "aspect-square rounded-[var(--radius-md)] p-1 text-sm transition-colors duration-[var(--duration-fast)]",
                !inMonth && "text-[var(--color-text-muted)] opacity-40",
                isSelected
                  ? "bg-[var(--color-primary)] text-white"
                  : isToday
                    ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/50 font-semibold hover:bg-[var(--color-primary)]/15"
                    : "hover:bg-[var(--color-surface-hover)]",
              ].filter(Boolean).join(" ")}
            >
              <div aria-hidden="true">{day.getDate()}</div>
              {count > 0 && (
                <div aria-hidden="true" className={isSelected ? "text-white" : "text-[var(--color-primary)]"}>
                  •{count > 1 ? count : ""}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Card className="mt-8">
        <h3 className="text-page-title !mb-0">
          {new Date(selected).toLocaleDateString(intlLocale, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </h3>
        <form onSubmit={addEvent} className="mb-6 mt-4 flex flex-col gap-2 sm:flex-row">
          <Input placeholder={t("calendar.eventTitlePlaceholder")} value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          <Button type="submit">{t("common.add")}</Button>
        </form>
        <div className="flex flex-col gap-2">
          {selectedEvents.length === 0 && <EmptyState message={t("calendar.empty")} />}
          {selectedEvents.map((ev) => (
            <Card key={ev.id} className="flex items-center justify-between p-3">
              <div>
                <div className="font-medium">{ev.title}</div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  {new Date(ev.starts_at).toLocaleTimeString(intlLocale, { hour: "numeric", minute: "2-digit" })}
                </div>
              </div>
              <Button variant="ghost-danger" size="sm" onClick={() => setPendingDeleteId(ev.id)}>{t("common.delete")}</Button>
            </Card>
          ))}
        </div>
      </Card>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) deleteEvent(pendingDeleteId);
        }}
      />
    </div>
  );
}
