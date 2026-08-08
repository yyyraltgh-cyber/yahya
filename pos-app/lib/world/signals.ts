import type { AmbientPeriod } from "./ambient-clock";
import type { LocationFamily } from "./locations";
import type { LegacyTier } from "./legacy";
import type { UnifiedSeasonSignals } from "./unified-season";
import type { DirectionSignals } from "./direction";
import type { LightModel } from "./light";
import type { WeatherModel } from "./weather";
import type { RhythmModel } from "./rhythm";
import type { WindModel } from "./wind";

/**
 * Release 4C, Objective 4 — "prepare the architecture so future systems
 * (Seasons, Weather, Wildlife, Audio) can naturally react to accumulated
 * legacy. Do not implement those systems yet." This file is that
 * foundation and nothing more: a single, named shape for every signal
 * the world currently tracks, so a future system can depend on this one
 * type instead of importing four unrelated hooks and re-deriving the
 * same combination WorldAmbient already computes.
 *
 * Release 5B, Objective 6 — "future systems must eventually react to
 * the unified season, not directly to the calendar." `season` below is
 * typed as UnifiedSeasonSignals (Earth + Life combined, see
 * unified-season.ts), not raw SeasonSignals — a future Weather/Wildlife/
 * Audio system reading `signals.season` gets the already-personalized
 * result by construction; there is no separate "raw calendar" field for
 * it to accidentally read instead.
 *
 * Nothing in this file executes. It is a contract, not a component —
 * the discipline this release was asked to exercise is stopping here,
 * not building the thing this contract would eventually serve.
 */
export interface WorldSignals {
  /** Time-of-day (Release 2A). */
  period: AmbientPeriod;
  /** Which place this is (Release 3A). Not present on neutral/utility
   *  screens — those simply have no location identity to react to. */
  locationFamily: LocationFamily;
  /** 0-1, today's session activity (Release 4A). A future Wildlife
   *  system might use this as "how likely is something to appear right
   *  now," for instance — not decided here, only left possible. */
  todayActivity: number;
  /** 0-1, capped ~30-day consistency (Release 4A). */
  consistency: number;
  /** 0-1, capped ~6-month accumulated history (Release 4B). A future
   *  Seasons system reacting to "how long has this world existed" would
   *  read this, not re-query garden_snapshots itself. */
  familiarity: number;
  /** 0-4, discrete legacy tier from rare foundational moments (Release
   *  4C). A future Weather system distinguishing "an ordinary world"
   *  from "a world that's been through something" would read this. */
  legacyTier: LegacyTier;
  /** The Unified Season (Release 5B) — Earth's calendar curve, gently
   *  bent by this account's own consistency/history/legacy. A future
   *  Weather system would read `season.warmth`; a future Wildlife
   *  system might read `season.greenness`. Neither is decided here. */
  season: UnifiedSeasonSignals;
  /** Direction (Release 5C) — already applied to `season` above, but
   *  also exposed on its own so a future Garden Evolution or Lighting
   *  system could react to the raw pull/intentionality directly rather
   *  than only its already-blended effect on warmth. The weakest
   *  influence in the system by design (direction.ts's own cap is the
   *  smallest of any layer) — future systems should treat it that way
   *  too, not amplify it back to Life Season's own weight. */
  direction: DirectionSignals;
  /** The Light Model (Release 5D) — direction, strength, temperature,
   *  ambientSoftness, shadowSoftness, computed once from `season` above
   *  (see lib/world/light.ts) and already shared by every visual system
   *  in the app today (Garden Scene, Sky, Ground, Particles, World
   *  Surface, World Ambient). This is the field Objective 5 asks future
   *  Weather/Wildlife/Water/Clouds/Fog/Audio systems to consume — not
   *  the calendar, not raw season, this. */
  light: LightModel;
  /** Weather (Release 5E) — environmental state (humidity, cloudDensity,
   *  windActivity, clarity, precipitationChance), derived from
   *  period/season/light, never rendered by this system itself. A
   *  future Rain system would read `precipitationChance`; a future Fog
   *  system would read `humidity`/`clarity`; a future Leaves/Wildlife
   *  system might read `windActivity`. None of that is decided here —
   *  only the fields those future systems would need are. */
  weather: WeatherModel;
  /** Rhythm (Release 5F) — tempo, stillness, breathingRate,
   *  settlingFactor, computed once alongside light and weather, never
   *  applied to any animation in this release. A future Garden/
   *  Particles/Ambient motion refinement, or a future Wind/Audio/
   *  Wildlife system, would read `rhythm.tempo` or `rhythm.stillness`
   *  instead of choosing an animation duration by feel — that's the
   *  question this field exists to make askable. */
  rhythm: RhythmModel;
  /** Wind (Release 5G) — strength, direction, gustiness, settling,
   *  computed once from weather/rhythm/light. Currently revealed by
   *  exactly one consumer (the Garden plant's sway, GardenTile) — a
   *  future Fog system would read `strength`/`direction` to drift;
   *  a future Rain system would read `direction` to angle; a future
   *  Audio system might read `gustiness` to vary an ambient loop. */
  wind: WindModel;
}
