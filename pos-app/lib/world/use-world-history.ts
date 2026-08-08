"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Release 4B — Living History Architecture, Objective 3: "history must
 * never become statistics... experienced, not inspected." This hook is
 * the only place the count from garden_snapshots is ever read, and its
 * output is never rendered as a number anywhere — only ever fed into
 * WorldAmbient's intensity calculation. There is deliberately no screen,
 * modal, or component that shows "you have logged N days" — the number
 * exists for one paragraph of arithmetic and nothing else.
 *
 * A plain count of past snapshot rows, capped at ~6 months (180 days),
 * matching the release brief's own "eight months" example as the point
 * where the difference should already be fully felt, not still growing.
 * This is Objective 5's "familiarity through accumulated history, not
 * random variation" — deterministic, grows only through genuine
 * longevity, resets for nobody, inflated by nothing.
 */
const FAMILIARITY_CAP_DAYS = 180;

export function useWorldHistory(userId: string | undefined) {
  const [familiarityFactor, setFamiliarityFactor] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("garden_snapshots")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .then(({ count, error }) => {
        if (cancelled || error || count === null) return;
        setFamiliarityFactor(Math.min(count, FAMILIARITY_CAP_DAYS) / FAMILIARITY_CAP_DAYS);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return familiarityFactor;
}
