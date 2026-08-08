import type { AmbientPeriod } from "./ambient-clock";
import type { UnifiedSeasonSignals } from "./unified-season";

/**
 * Release 5D — Living Light Engine.
 *
 * Deliberately derived FROM the already-composed world signal, not from
 * Earth/Life/Direction separately. `season.warmth` already IS Earth
 * gently bent by Life, further gently bent by Direction (see
 * unified-season.ts and direction.ts, both untouched by this release) —
 * so a light model built from `season` automatically inherits all three
 * influences in the same proportion the World Engine already decided,
 * without this file re-weighting any of them itself. That's what
 * Objective 3 ("the existing World Engine remains dominant") means in
 * practice: Light has no opinion of its own about Earth vs Life vs
 * Direction — it only has an opinion about how to turn "warmth" and
 * "greenness" into light.
 *
 * Five properties, matching Objective 2's list exactly, no more:
 *  - direction: a 2D lean (-1..1 each axis), not a literal 3D vector —
 *    "suggest, don't simulate."
 *  - strength: 0-1, overall light intensity.
 *  - temperature: -1 (cool) .. 1 (warm), inherited directly from
 *    season.warmth.
 *  - ambientSoftness / shadowSoftness: 0-1, how diffuse fill light and
 *    contact shadows should read — related but independent, since real
 *    light doesn't soften both the same way.
 */
export interface LightModel {
  direction: { x: number; y: number };
  strength: number;
  temperature: number;
  ambientSoftness: number;
  shadowSoftness: number;
}

export function computeLight(period: AmbientPeriod, season: UnifiedSeasonSignals): LightModel {
  const isDay = period === "day";

  const strength = isDay ? 0.9 : 0.4;
  const temperature = season.warmth;

  // A warm-leaning world tilts the light slightly toward the warm side
  // of the composition; a cool one tilts the other way. Vertical
  // component: high overhead by day (a sun), lower and dimmer at night
  // (a moon) — never literal, just enough to inform gradient positions.
  const direction = { x: temperature * 0.3, y: isDay ? -0.9 : -0.5 };

  const ambientSoftness = isDay ? 0.3 + season.greenness * 0.2 : 0.6;
  const shadowSoftness = 1 - strength * 0.5;

  return { direction, strength, temperature, ambientSoftness, shadowSoftness };
}
