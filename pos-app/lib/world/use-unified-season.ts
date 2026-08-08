"use client";

import { useSeason } from "./use-season";
import { useWorldHistory } from "./use-world-history";
import { useWorldLegacy } from "./use-world-legacy";
import { getLifeSeasonSignals } from "./life-season";
import { getUnifiedSeason, type UnifiedSeasonSignals } from "./unified-season";
import { useGamification } from "@/components/gamification/gamification-context";

/**
 * Release 5B. Every hook called here already existed before this release
 * for an unrelated purpose:
 *  - useSeason (5A): Earth's own warmth/greenness.
 *  - useGamification (2B/4A, context, no new fetch): currentStreak.
 *  - useWorldHistory (4B): familiarityFactor, from garden_snapshots.
 *  - useWorldLegacy (4C): legacyTier, from user_achievements.
 * This hook performs no I/O of its own — it only combines outputs
 * that were already being computed, which is what "use only existing
 * signals, do not invent new backend logic" means in practice.
 */
export function useUnifiedSeason(userId: string): UnifiedSeasonSignals {
  const earth = useSeason();
  const { currentStreak } = useGamification();
  const familiarityFactor = useWorldHistory(userId);
  const legacyTier = useWorldLegacy(userId);

  const life = getLifeSeasonSignals({ currentStreak, familiarityFactor, legacyTier });
  return getUnifiedSeason(earth, life);
}
