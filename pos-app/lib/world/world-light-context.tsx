"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getAmbientPeriod, type AmbientPeriod } from "./ambient-clock";
import { useUnifiedSeason } from "./use-unified-season";
import { useWorldDirection } from "./use-world-direction";
import { applyDirection } from "./direction";
import { computeLight, type LightModel } from "./light";
import { computeWeather, type WeatherModel } from "./weather";
import { computeRhythm, type RhythmModel } from "./rhythm";
import { computeWind, type WindModel } from "./wind";
import type { UnifiedSeasonSignals } from "./unified-season";

export interface WorldLightValue {
  period: AmbientPeriod;
  season: UnifiedSeasonSignals;
  light: LightModel;
  weather: WeatherModel;
  rhythm: RhythmModel;
  wind: WindModel;
}

const WorldLightContext = createContext<WorldLightValue | null>(null);

/**
 * Release 5D. Before this release, GardenScene and WorldAmbient each
 * independently called useUnifiedSeason() + useWorldDirection() —
 * meaning every page load fired the underlying Supabase queries
 * (garden_snapshots, user_achievements, daily_intentions) TWICE, once
 * per component tree, with no coordination between them. Objective 6
 * ("one computation, many consumers, never duplicate calculations") is
 * this provider: mounted once (in WorldAmbient, wrapping everything
 * including the Garden), it calls those hooks exactly once per page
 * load, computes Light from the result, and every consumer below reads
 * the same object via context instead of recomputing anything.
 *
 * None of the underlying formulas changed — useUnifiedSeason,
 * useWorldDirection, applyDirection, getSeasonSignals,
 * getLifeSeasonSignals are all byte-for-byte what Releases 5A-5C
 * shipped. This only changes how many times they're called.
 *
 * Release 5E: Weather is computed here too, immediately after Light, in
 * the same pass — "one computation, many consumers, exactly like Light"
 * means literally reusing this provider rather than building a second,
 * parallel one. Weather adds no new query and no new hook of its own;
 * computeWeather() is a pure function of period/season/light, all three
 * already sitting right here.
 *
 * Release 5F: Rhythm, same pattern again — computed here, exposed here,
 * consumed by nobody yet. This release's brief is explicit that no
 * existing animation may be touched, so unlike Weather (which did wire
 * GardenSky and WorldAmbient), Rhythm ships as a complete, correct,
 * currently-unread value on this context. That's the intended state,
 * not a partial implementation — the interface is what this release was
 * asked to deliver, not its adoption.
 *
 * Release 5G: Wind, same pass again, deriving from weather+rhythm+light
 * (never re-computing what any of them already answered). Exactly one
 * consumer is introduced this release, per that brief's own limit — the
 * Garden plant's existing sway animation (GardenTile), which already
 * approximated "wind" visually since Release 5A; it's now driven by
 * this real computation instead of a fixed amplitude/duration.
 */
export function WorldLightProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [period, setPeriod] = useState<AmbientPeriod>("day");
  const earthAndLife = useUnifiedSeason(userId);
  const direction = useWorldDirection(userId);

  useEffect(() => {
    setPeriod(getAmbientPeriod());
    const id = setInterval(() => setPeriod(getAmbientPeriod()), 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const season = applyDirection(earthAndLife, direction);
  const light = computeLight(period, season);
  const weather = computeWeather(period, season, light);
  const rhythm = computeRhythm(period, season, light, weather);
  const wind = computeWind(season, light, weather, rhythm);

  return (
    <WorldLightContext.Provider value={{ period, season, light, weather, rhythm, wind }}>
      {children}
    </WorldLightContext.Provider>
  );
}

/**
 * Falls back to a neutral, correctly-shaped value if called outside the
 * provider rather than throwing — the same defensive stance every other
 * world hook in this system already takes for missing data, so a
 * consumer never crashes a screen over a lighting, weather, or rhythm
 * signal.
 */
export function useWorldLight(): WorldLightValue {
  const ctx = useContext(WorldLightContext);
  if (ctx) return ctx;
  const period: AmbientPeriod = "day";
  const season: UnifiedSeasonSignals = {
    warmth: 0,
    greenness: 0,
    label: "spring",
    earthLabel: "spring",
    lifeLabel: "renewal",
  };
  const light = computeLight(period, season);
  const weather = computeWeather(period, season, light);
  const rhythm = computeRhythm(period, season, light, weather);
  return { period, season, light, weather, rhythm, wind: computeWind(season, light, weather, rhythm) };
}
