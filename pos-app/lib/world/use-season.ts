"use client";

import { useEffect, useState } from "react";
import { getSeasonSignals, type SeasonSignals } from "./seasons";

const NEUTRAL: SeasonSignals = { warmth: 0, greenness: 0, label: "spring" };

// Season signals move over weeks, not seconds — an hourly recheck is
// more than enough, and far cheaper than a timer tied to any shorter
// interval.
const RECHECK_MS = 60 * 60 * 1000;

export function useSeason(): SeasonSignals {
  const [signals, setSignals] = useState<SeasonSignals>(NEUTRAL);

  useEffect(() => {
    setSignals(getSeasonSignals());
    const id = setInterval(() => setSignals(getSeasonSignals()), RECHECK_MS);
    return () => clearInterval(id);
  }, []);

  return signals;
}
