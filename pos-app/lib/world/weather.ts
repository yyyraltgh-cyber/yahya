import type { AmbientPeriod } from "./ambient-clock";
import type { UnifiedSeasonSignals } from "./unified-season";
import type { LightModel } from "./light";

/**
 * Release 5E — Weather Engine.
 *
 * "The application should never ask 'what particles should I draw?'
 * Instead it should ask 'what is the world's weather?' Everything else
 * should derive from that." This file IS that question and nothing
 * else — it produces numbers, never pixels. No component is imported
 * here, no JSX exists here, and none ever should; a future Rain/Fog/
 * Snow/Wildlife/Audio system reads WeatherModel and decides for itself
 * how (or whether) to render anything from it.
 *
 * Every input is something Light (5D) already computed from the World
 * Engine (5A-5C) — no new signal, no new query, no new backend logic.
 * Garden-specific atmosphere (calm/night/recovery/celebration/rain,
 * useGarden's own output) is deliberately NOT an input here: that value
 * only exists inside GardenStage's own render tree, structurally below
 * where Weather is computed (WorldLightProvider, mounted above the
 * Garden). Consumers that have both Weather and their own local
 * atmosphere are free to combine them locally — Weather doesn't need to
 * know about Garden specifically to be useful to it.
 *
 * Five fields, not the full list the brief offered as options — "the
 * implementation may choose different fields," and five is enough to
 * describe a believable atmosphere without inventing values nothing
 * derives cleanly from what already exists:
 *
 *  - humidity (0-1): higher when light is soft/diffuse and the season
 *    isn't warm — the same intuition real overcast, humid days share.
 *  - cloudDensity (0-1): directly the same signal as light's own
 *    ambientSoftness — cloud cover and diffuse light are, physically,
 *    close to the same phenomenon, so this is a named alias with intent
 *    rather than a fifth independent computation.
 *  - windActivity (0-1): a modest baseline that rises with greenness —
 *    spring reads breezier than a still winter, without inventing a
 *    calendar-independent wind model.
 *  - clarity (0-1): how "clear the air" reads — high light strength
 *    minus humidity's own haze.
 *  - precipitationChance (0-1): humidity scaled down by warmth — cool +
 *    humid raises it, warm suppresses it, exactly the direction real
 *    weather behaves without simulating anything close to a real model.
 */
export interface WeatherModel {
  humidity: number;
  cloudDensity: number;
  windActivity: number;
  clarity: number;
  precipitationChance: number;
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

export function computeWeather(
  _period: AmbientPeriod,
  season: UnifiedSeasonSignals,
  light: LightModel
): WeatherModel {
  const humidity = clamp01(0.5 - season.warmth * 0.3 + light.ambientSoftness * 0.3);
  const cloudDensity = light.ambientSoftness;
  const windActivity = clamp01(0.2 + season.greenness * 0.3);
  const clarity = clamp01(light.strength - humidity * 0.3);
  const precipitationChance = clamp01(humidity * (1 - Math.max(0, season.warmth)) * 0.6);

  return { humidity, cloudDensity, windActivity, clarity, precipitationChance };
}
