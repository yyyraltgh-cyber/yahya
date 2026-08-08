/**
 * Garden of Life — shared types.
 * Hybrid architecture: growth stages are static illustrated assets
 * (public/garden/stages/), atmosphere/effects are CSS/SVG layers on top.
 */

/** 0 = empty soil, 8 = complete sanctuary garden. One static image per level. */
export type GrowthLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Independent of GrowthLevel — layered visually on top of whichever stage
 *  image is showing, never baked into the stage images themselves. */
export type AtmosphereState = "calm" | "recovery" | "celebration" | "night" | "rain";

export const GROWTH_STAGE_LABELS: Record<GrowthLevel, string> = {
  0: "بداية",
  1: "بذرة",
  2: "أول برعم",
  3: "غرسة",
  4: "نمو",
  5: "ازدهار",
  6: "نضج",
  7: "ملاذ",
  8: "حديقة مكتملة",
};

export function clampGrowthLevel(n: number): GrowthLevel {
  return Math.max(0, Math.min(8, Math.round(n))) as GrowthLevel;
}
