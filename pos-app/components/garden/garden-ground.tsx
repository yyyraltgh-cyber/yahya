import type { GrowthLevel } from "@/lib/garden/types";
import type { SeasonSignals } from "@/lib/world/seasons";
import type { LightModel } from "@/lib/world/light";

/**
 * The ground is what makes this a place instead of a sticker. A distinct
 * band beneath the horizon line, warmer/more present the more the
 * Garden has grown, plus two soft out-of-focus background shapes near
 * the horizon — suggested depth (a fuller garden bed behind the one
 * plant in focus), not new artwork. Static — the ground doesn't need to
 * move to feel real.
 *
 * Release 5A: greenness (lib/world/seasons.ts) is the most literal
 * "vegetation" signal this system has — a spring ground reads faintly
 * fresher/more present than an autumn one, layered on top of the
 * existing growth-driven presence rather than replacing it. A small
 * amount of the same warmth signal GardenSky uses keeps the ground
 * and sky feeling like the same season, not two independently-tuned
 * effects that happen to render near each other.
 *
 * Release 5D: the contact light-pool below — already described, since
 * its creation, as "the one thing in this layer that reads as light
 * falling on something" — now literally uses light.strength for its
 * own opacity and light.shadowSoftness for its blur radius, replacing
 * two values that used to be fixed regardless of time of day. A dim
 * night now casts a genuinely fainter, softer pool than a bright day.
 */
export function GardenGround({
  growthLevel,
  season,
  light,
}: {
  growthLevel: GrowthLevel;
  season: SeasonSignals;
  light: LightModel;
}) {
  const presence = 0.12 + (growthLevel / 8) * 0.1 + season.greenness * 0.04;
  const warmPercent = Math.max(0, season.warmth) * 4;
  const poolOpacity = (0.1 + light.strength * 0.2).toFixed(2);
  const poolBlur = (6 + light.shadowSoftness * 10).toFixed(0);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--color-primary) ${(presence * 100).toFixed(0)}%, transparent) 100%),
            linear-gradient(to bottom, transparent 40%, color-mix(in srgb, var(--color-accent) ${warmPercent.toFixed(1)}%, transparent) 100%)
          `,
        }}
      />
      {/* Distant, out-of-focus shapes near the horizon — depth, not decoration. */}
      <div
        className="absolute bottom-[18%] left-[18%] h-8 w-8 rounded-full opacity-20 blur-md"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="absolute bottom-[22%] right-[22%] h-6 w-6 rounded-full opacity-15 blur-md"
        style={{ background: "var(--color-accent)" }}
      />
      {/* Contact light-pool directly beneath the plant's stated position
          (see GardenScene) — now driven by the shared Light Model
          instead of two fixed values. */}
      <div
        className="absolute bottom-[8%] left-1/2 h-[22%] w-[46%] -translate-x-1/2 rounded-[100%]"
        style={{
          background: "radial-gradient(ellipse, var(--color-primary) 0%, transparent 75%)",
          opacity: poolOpacity,
          filter: `blur(${poolBlur}px)`,
        }}
      />
    </div>
  );
}
