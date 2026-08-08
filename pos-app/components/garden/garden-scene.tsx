"use client";

import { GardenTile } from "./garden-tile";
import { GardenSky } from "./garden-sky";
import { GardenGround } from "./garden-ground";
import { GardenWeather } from "./garden-weather";
import { GardenEffects } from "./garden-effects";
import { GardenParticles } from "./garden-particles";
import { useWorldLight } from "@/lib/world/world-light-context";
import type { AtmosphereState, GrowthLevel } from "@/lib/garden/types";

/**
 * Composition root only — combines layers, passes data, controls layout.
 * No SVG drawing logic lives here; each layer owns its own rendering.
 * Same EXTERNAL props contract as every prior sprint (growthLevel,
 * atmosphere) plus one addition (userId, Release 5B) — needed because
 * the unified season now factors in this account's own consistency,
 * history, and legacy, not just the calendar.
 *
 * Sprint 6 (Garden Scene Architecture) — this is no longer a circular
 * glow with a plant centered inside it. It's a landscape: a sky (top),
 * a ground (bottom), and the plant standing on that ground in the lower
 * third — not centered, not floating. Every layer that used to be "an
 * effect drawn on the icon" now belongs to the environment instead:
 * stars are in the sky, rain falls from sky to ground, light pools where
 * the plant meets the earth. There is no glow halo left — mood now comes
 * from the sky's color and the ground's warmth, not brightness.
 *
 * Release 5A gave the sky and ground a season (warmth/greenness) driven
 * by the calendar. Release 5B replaced that with the Unified Season
 * (Earth + Life). Release 5C added Direction as a further gentle bend.
 *
 * Release 5D: GardenScene no longer computes any of this itself. It
 * reads useWorldLight() — the SAME shared computation WorldAmbient now
 * also reads (lib/world/world-light-context.tsx) — which fixes a real
 * duplicate-query issue (both used to call useUnifiedSeason/
 * useWorldDirection independently, firing the underlying Supabase
 * queries twice per page load). Sky, Ground, and Particles now receive
 * a `light` prop (direction/strength/temperature/softness) instead of
 * raw `season` — one shared light source, not each layer inventing its
 * own, per Objective 4.
 *
 * Release 5E: `weather` (lib/world/weather.ts, computed in the same
 * provider pass as light) is threaded to GardenSky only this release —
 * not forced onto Ground/Particles/GardenWeather, per Objective 5 ("use
 * it only where appropriate"). No rain, fog, cloud, or particle is
 * drawn anywhere in this release; weather only adjusts numbers an
 * existing gradient already used.
 */
export function GardenScene({
  growthLevel,
  atmosphere,
}: {
  growthLevel: GrowthLevel;
  atmosphere: AtmosphereState;
}) {
  const { season, light, weather } = useWorldLight();

  return (
    <div className="animate-garden-stage-in relative aspect-[4/3] w-full max-w-md overflow-hidden sm:aspect-[16/10]">
      <GardenSky atmosphere={atmosphere} growthLevel={growthLevel} season={season} light={light} weather={weather} />
      <GardenGround growthLevel={growthLevel} season={season} light={light} />
      <GardenWeather atmosphere={atmosphere} />

      {/* The plant, standing in the lower third — camera framing, not
          centering. left-1/2 + a fixed offset from bottom (not 50%)
          is what actually puts it "on the ground" rather than floating
          in the middle of the frame. */}
      <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2">
        <div className="relative">
          <GardenTile growthLevel={growthLevel} />
          <GardenEffects atmosphere={atmosphere} />
        </div>
      </div>

      <GardenParticles growthLevel={growthLevel} season={season} light={light} />
    </div>
  );
}
