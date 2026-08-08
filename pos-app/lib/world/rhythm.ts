import type { AmbientPeriod } from "./ambient-clock";
import type { UnifiedSeasonSignals } from "./unified-season";
import type { LightModel } from "./light";
import type { WeatherModel } from "./weather";

/**
 * Release 5F — Rhythm Engine.
 *
 * "The application should no longer ask 'how long should this animation
 * be?' Instead it should ask 'what is the world's rhythm?'" This file
 * is that second question, and only that question — it answers with
 * numbers, never with a CSS duration, an easing curve, or a triggered
 * transition. No existing animation in the codebase was touched to
 * produce this file, on purpose: the brief for this release explicitly
 * forbids it ("Do NOT add animations. Do NOT change animation curves.
 * Do NOT redesign motion. Do NOT increase movement"), unlike Weather's
 * release, which did wire a couple of real consumers. Rhythm ships as a
 * pure, complete, currently-unconsumed foundation — intentionally, not
 * as an oversight.
 *
 * Every input is something Light and Weather (5D, 5E) already computed
 * from the World Engine (5A-5C) — no new signal, no new query. Direction
 * is not a separate input here, exactly as it isn't for Light or
 * Weather: it's already folded into `season.warmth` by the time it
 * reaches this function (unified-season.ts + direction.ts, both
 * untouched), so reading `season` already carries it.
 *
 * Four fields, not the full list of eight the brief offered as options —
 * "the implementation may choose different names," and four is enough
 * to describe a believable pace without inventing values nothing
 * derives cleanly from what already exists:
 *
 *  - tempo (0-1): how quickly the world seems to move. Inherits
 *    light.strength almost directly — a bright, high-strength world
 *    (daytime, clear conditions) has a faster tempo than a dim one.
 *  - stillness (0-1): not simply 1-tempo — humid, low-wind conditions
 *    add their own stillness on top of a slow tempo, so a calm, humid
 *    night reads stiller than a merely-dim one.
 *  - breathingRate: a multiplier around 1.0 (typically 0.85-1.15) a
 *    future consumer could apply to an EXISTING animation's own base
 *    duration (e.g. the Garden's breathing pulse) — this file never
 *    applies it to anything itself.
 *  - settlingFactor (0-1): how gently a future consumer's transitions
 *    should settle — higher favors long, slow arrivals; lower favors
 *    quicker ones. Rises with humidity, falls with wind activity.
 */
export interface RhythmModel {
  tempo: number;
  stillness: number;
  breathingRate: number;
  settlingFactor: number;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function computeRhythm(
  _period: AmbientPeriod,
  _season: UnifiedSeasonSignals,
  light: LightModel,
  weather: WeatherModel
): RhythmModel {
  const tempo = clamp01(0.25 + light.strength * 0.55);
  const stillness = clamp01(1 - tempo * 0.6 + weather.humidity * 0.2);
  const breathingRate = 0.85 + tempo * 0.3;
  const settlingFactor = clamp01(0.5 + weather.humidity * 0.3 - weather.windActivity * 0.2);

  return { tempo, stillness, breathingRate, settlingFactor };
}
