/**
 * Release 5A — Living Seasons.
 *
 * Deliberately not "four states blended at boundaries" — that shape
 * always risks a seam, however carefully smoothed. Instead: two
 * independent, continuous sinusoids computed directly from the day of
 * year, with zero discontinuities anywhere, by construction:
 *
 *  - warmth:    -1 (deep winter) .. +1 (deep summer), peaking at the
 *               summer solstice (~day 172), trough at the winter
 *               solstice (~day 355).
 *  - greenness:  0 .. 1, a spring-specific "freshness" bump peaking
 *               around the spring equinox (~day 80), fading toward
 *               autumn — real spring growth is a distinct color event
 *               from summer's heat, not just "less winter."
 *
 * A `label` is derived only for internal/debug reference (which of the
 * four familiar names best describes today) — nothing in the app
 * displays it, and no component branches on it; every visual consumer
 * reads warmth/greenness directly, which is what keeps the system
 * continuous instead of a four-way switch wearing a gradient disguise.
 *
 * Northern-hemisphere solar seasons (meteorological month boundaries)
 * — a deliberate, disclosed choice, not the only one considered (a
 * Hijri-calendar-aware model was the alternative raised in the Vision
 * Recovery Masterplan); this release's brief names Spring/Summer/
 * Autumn/Winter literally, so that's what's implemented here.
 */
export type Season = "winter" | "spring" | "summer" | "autumn";

export interface SeasonSignals {
  warmth: number; // -1..1
  greenness: number; // 0..1
  label: Season;
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function seasonLabel(month: number): Season {
  if (month === 11 || month <= 1) return "winter"; // Dec, Jan, Feb
  if (month <= 4) return "spring"; // Mar, Apr, May
  if (month <= 7) return "summer"; // Jun, Jul, Aug
  return "autumn"; // Sep, Oct, Nov
}

export function getSeasonSignals(date: Date = new Date()): SeasonSignals {
  const doy = dayOfYear(date);
  const yearAngle = (doy / 365) * Math.PI * 2;

  const warmth = Math.cos(yearAngle - (172 / 365) * Math.PI * 2);
  const greennessRaw = Math.cos(yearAngle - (80 / 365) * Math.PI * 2);

  return {
    warmth,
    greenness: Math.max(0, greennessRaw),
    label: seasonLabel(date.getMonth()),
  };
}
