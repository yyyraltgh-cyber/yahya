"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDirectionSignals, type DirectionSignals } from "@/lib/world/direction";

const NEUTRAL: DirectionSignals = { pull: 0, intentionality: 0 };
const WINDOW_DAYS = 14;

/**
 * Two queries, both against tables that already existed before this
 * release (garden_snapshots since 4B, daily_intentions since the
 * original Niyyah feature) — no new table, no new column, no new write
 * path. Run once per session, same discipline as every other world
 * hook (useWorldHistory, useWorldLegacy).
 */
export function useWorldDirection(userId: string | undefined): DirectionSignals {
  const [signals, setSignals] = useState<DirectionSignals>(NEUTRAL);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const supabase = createClient();

    const since = new Date();
    since.setDate(since.getDate() - WINDOW_DAYS);
    const sinceDate = since.toISOString().slice(0, 10);

    Promise.all([
      supabase
        .from("garden_snapshots")
        .select("snapshot_date, growth_level")
        .eq("user_id", userId)
        .gte("snapshot_date", sinceDate)
        .order("snapshot_date", { ascending: true }),
      supabase
        .from("daily_intentions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("intention_date", sinceDate),
    ]).then(([snapshotsRes, intentionsRes]) => {
      if (cancelled) return;
      const rows = snapshotsRes.data ?? [];
      const intentionCount = intentionsRes.count ?? 0;

      if (rows.length < 4) {
        // Not enough recorded history yet to derive a trend honestly —
        // stay neutral rather than guess from a couple of points.
        setSignals(NEUTRAL);
        return;
      }

      const mid = Math.floor(rows.length / 2);
      const priorAvg = average(rows.slice(0, mid).map((r) => r.growth_level));
      const recentAvg = average(rows.slice(mid).map((r) => r.growth_level));
      const trendSlope = (recentAvg - priorAvg) / 8; // normalized by the 0-8 growth scale

      const intentionality = Math.min(1, intentionCount / WINDOW_DAYS);

      setSignals(getDirectionSignals({ trendSlope, intentionality }));
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return signals;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
