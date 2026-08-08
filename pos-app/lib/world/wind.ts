import type { UnifiedSeasonSignals } from "./unified-season";
import type { LightModel } from "./light";
import type { WeatherModel } from "./weather";
import type { RhythmModel } from "./rhythm";

/**
 * Release 5G — Wind Engine.
 *
 * "Wind is invisible. Everything else reveals it." This file is the
 * invisible part — four numbers, no rendering, no DOM, no animation
 * definition. A consumer reveals wind by letting one of its own,
 * already-existing properties (an amplitude, a duration) vary with
 * these values; this file never decides what that property is.
 *
 * Consumes only what the brief allows: Weather, Rhythm, Light, and
 * Unified Season (which already carries Direction's own gentle bend, via
 * unified-season.ts + direction.ts — exactly the same "Direction is
 * already folded in" reasoning Light, Weather, and Rhythm all rely on,
 * not re-litigated here). No new query, no new persistence, no Garden-
 * specific atmosphere (that value lives below where Wind is computed,
 * same structural boundary Weather's engine already documented).
 *
 * Four fields:
 *  - strength (0-1): directly weather.windActivity — Wind doesn't
 *    invent its own notion of "how windy," it reads the one Weather
 *    already computed. Re-deriving it here would be exactly the
 *    duplicate-computation this whole system exists to avoid.
 *  - direction (-1..1): reuses light.direction.x — the same lean that
 *    already informs where the sky's warm/cool wash sits. Wind and
 *    light share a direction on purpose; a world where they disagreed
 *    would feel wrong even if no one could say exactly why.
 *  - gustiness (0-1): how uneven the wind reads, moment to moment —
 *    derived from rhythm's stillness (a stiller world has steadier,
 *    less gusty wind) rather than invented independently.
 *  - settling (0-1): how quickly wind-driven motion should damp back to
 *    rest — a direct read of rhythm.settlingFactor, not a new concept.
 */
export interface WindModel {
  strength: number;
  direction: number;
  gustiness: number;
  settling: number;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function computeWind(
  _season: UnifiedSeasonSignals,
  light: LightModel,
  weather: WeatherModel,
  rhythm: RhythmModel
): WindModel {
  const strength = weather.windActivity;
  const direction = Math.max(-1, Math.min(1, light.direction.x));
  const gustiness = clamp01(1 - rhythm.stillness);
  const settling = rhythm.settlingFactor;

  return { strength, direction, gustiness, settling };
}
