"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getLegacyTier, type LegacyTier } from "@/lib/world/legacy";

/**
 * Same discipline as useWorldHistory (4B): a count-only query, run once
 * per session, whose output is never rendered as a number anywhere in
 * the product. No new table — user_achievements already exists and
 * already represents "rare, foundational moments," so this is a read of
 * existing architecture, not new persistence (Objective 4 asks to
 * "prepare" foundations "where necessary" — here, none was necessary,
 * because one already existed and this release simply uses it).
 */
export function useWorldLegacy(userId: string | undefined) {
  const [legacyTier, setLegacyTier] = useState<LegacyTier>(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("user_achievements")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .then(({ count, error }) => {
        if (cancelled || error || count === null) return;
        setLegacyTier(getLegacyTier(count));
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return legacyTier;
}
