import type { AtmosphereState, GrowthLevel } from "@/lib/garden/types";
import type { SeasonSignals } from "@/lib/world/seasons";
import type { LightModel } from "@/lib/world/light";
import type { WeatherModel } from "@/lib/world/weather";

// Fixed, deterministic star positions — never Math.random(), same
// reasoning as GardenParticles: no hydration/flicker risk.
const STARS = [
  { left: "14%", top: "14%", size: 1.5 },
  { left: "78%", top: "20%", size: 2 },
  { left: "60%", top: "8%", size: 1.5 },
  { left: "30%", top: "28%", size: 1 },
] as const;

/**
 * The sky is what carries mood now, not a glow halo around the plant.
 * Color shifts with atmosphere (the same four states useGarden already
 * produces — no new logic) and warms very slightly with growthLevel, so
 * progress reads as "the world got a little warmer" rather than "the
 * icon got brighter." Deliberately quiet: no hard gradients, no visible
 * banding, nothing that reads as a UI effect.
 *
 * Release 5A: a second, independent gradient layer carries season —
 * warmth (continuous, -1..1) leans the sky toward accent-gold in summer
 * or a cool blue (the same family already used for night) in winter;
 * greenness (0..1, peaks at spring) adds a faint primary-teal freshness
 * distinct from summer's heat.
 *
 * Release 5D: `light` (lib/world/light.ts, one shared computation — see
 * world-light-context.tsx) now positions and softens the same gradient
 * layer. `light.direction.x` shifts where the warm/cool wash actually
 * sits — a real light-direction cue instead of two fixed positions that
 * never moved. `light.ambientSoftness` widens the gradient's spread when
 * light is diffuse (night, or a fresh spring). Color still comes from
 * season (warmth/greenness) exactly as 5A left it — light only ever
 * repositions and softens, it doesn't reintroduce new color.
 *
 * Release 5E: `weather.clarity` gently scales that same color's
 * intensity — a hazier reading (low clarity) mutes the warm/cool wash
 * slightly, a clear one lets it read fully. No cloud shape, no mist
 * layer, no particle is drawn here; weather only ever adjusts a number
 * that was already driving an existing gradient.
 */
export function GardenSky({
  atmosphere,
  growthLevel,
  season,
  light,
  weather,
}: {
  atmosphere: AtmosphereState;
  growthLevel: GrowthLevel;
  season: SeasonSignals;
  light: LightModel;
  weather: WeatherModel;
}) {
  const warmth = growthLevel / 8;

  const skyByAtmosphere: Record<AtmosphereState, string> = {
    calm: `radial-gradient(ellipse 120% 80% at 50% -10%, color-mix(in srgb, var(--color-accent) ${8 + warmth * 6}%, transparent) 0%, transparent 60%), var(--color-surface)`,
    celebration: `radial-gradient(ellipse 120% 80% at 50% -10%, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, transparent 65%), var(--color-surface)`,
    recovery: `radial-gradient(ellipse 120% 80% at 50% -10%, color-mix(in srgb, var(--color-text-muted) 10%, transparent) 0%, transparent 65%), var(--color-surface)`,
    night: `radial-gradient(ellipse 120% 80% at 50% -10%, rgba(70, 100, 150, 0.14) 0%, transparent 60%), rgba(10, 21, 18, 0.5), var(--color-surface)`,
    rain: `radial-gradient(ellipse 120% 80% at 50% -10%, color-mix(in srgb, var(--color-text-muted) 10%, transparent) 0%, transparent 65%), var(--color-surface)`,
  };

  // Each term only contributes when its sign/value is actually active
  // (Math.max(0, ...)) — a winter day adds zero warm tint, a summer day
  // adds zero cool tint, so the two never fight for the same pixels.
  // A clarity floor of 0.5 keeps the wash from ever fully disappearing —
  // weather biases the sky, it doesn't erase it.
  const clarityFactor = 0.5 + weather.clarity * 0.5;
  const warmPercent = Math.max(0, season.warmth) * 7 * clarityFactor;
  const coolPercent = Math.max(0, -season.warmth) * 7 * clarityFactor;
  const greenPercent = season.greenness * 5 * clarityFactor;

  // A subtle positional lean (base ±15%, shifted a few more points by
  // light direction) and a spread that widens when ambientSoftness is
  // high — soft light doesn't cast a tight pool, it fills the space.
  const warmX = (65 + light.direction.x * 10).toFixed(1);
  const coolX = (35 + light.direction.x * 10).toFixed(1);
  const spread = (100 + light.ambientSoftness * 20).toFixed(0);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-[68%] overflow-hidden"
      style={{ background: skyByAtmosphere[atmosphere] }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse ${spread}% 70% at ${warmX}% 10%, color-mix(in srgb, var(--color-accent) ${warmPercent.toFixed(1)}%, transparent) 0%, transparent 65%),
            radial-gradient(ellipse ${spread}% 70% at ${coolX}% 10%, rgba(90, 130, 190, ${(coolPercent / 100).toFixed(3)}) 0%, transparent 65%),
            radial-gradient(ellipse 90% 60% at 50% 25%, color-mix(in srgb, var(--color-primary) ${greenPercent.toFixed(1)}%, transparent) 0%, transparent 70%)
          `,
        }}
      />
      {atmosphere === "night" &&
        STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/60"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          />
        ))}
    </div>
  );
}
