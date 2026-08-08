import type { SeasonSignals } from "./seasons";
import type { LifeSeasonSignals } from "./life-season";

/**
 * Release 5B — the literal "Earth + Life → Unified World" formula.
 * Earth (5A) is never recomputed or altered here — this takes its
 * finished warmth/greenness values and adds a small, capped bend on top,
 * derived from Life Season. The caps (±0.15 on warmth, +0.12 on
 * greenness) are what make Objective 4 ("Earth Season remains dominant")
 * true by construction: Life alone can never push warmth or greenness
 * further than a fraction of Earth's own possible range.
 */
export interface UnifiedSeasonSignals extends SeasonSignals {
  earthLabel: SeasonSignals["label"];
  lifeLabel: LifeSeasonSignals["label"];
}

const WARMTH_BEND_CAP = 0.15;
const GREENNESS_BEND_CAP = 0.12;

export function getUnifiedSeason(earth: SeasonSignals, life: LifeSeasonSignals): UnifiedSeasonSignals {
  // High momentum (an active current stretch) warms the world a little,
  // regardless of what Earth is doing — low momentum cools it. Centered
  // at momentum = 0.5 so an average, ordinary stretch contributes ~0.
  const warmthBend = (life.momentum - 0.5) * 2 * WARMTH_BEND_CAP;

  // Greenness (freshness) only rises when someone is BOTH rooted (a real
  // track record) AND currently active — a person actually in a growth
  // phase of their own, not merely present. Never subtracts from Earth's
  // own spring signal, only ever adds.
  const greennessBend = life.rootedness * life.momentum * GREENNESS_BEND_CAP;

  return {
    warmth: Math.max(-1, Math.min(1, earth.warmth + warmthBend)),
    greenness: Math.max(0, Math.min(1, earth.greenness + greennessBend)),
    label: earth.label,
    earthLabel: earth.label,
    lifeLabel: life.label,
  };
}
