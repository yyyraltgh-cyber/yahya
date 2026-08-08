"use client";

import type { CSSProperties } from "react";
import type { GrowthLevel } from "@/lib/garden/types";
import type { SeasonSignals } from "@/lib/world/seasons";
import type { LightModel } from "@/lib/world/light";

// Fixed preset positions (never Math.random — deterministic, no
// hydration/flicker risk). Six is the max shown, at growthLevel 8.
const PRESETS = [
  { left: "22%", bottom: "58%", size: 3, delay: "0s" },
  { left: "72%", bottom: "68%", size: 2, delay: "1.1s" },
  { left: "38%", bottom: "78%", size: 2, delay: "2.3s" },
  { left: "60%", bottom: "40%", size: 3, delay: "0.6s" },
  { left: "15%", bottom: "35%", size: 2, delay: "1.8s" },
  { left: "82%", bottom: "50%", size: 2, delay: "3s" },
] as const;

/**
 * Purely presentational, purely derived from growthLevel (already
 * computed by useGarden — no new data). More motes, slightly brighter,
 * the further along the Garden is: a "reward" and "progress" signal
 * the brief explicitly asked to communicate without text. At level 0
 * this renders nothing — an empty garden doesn't twinkle.
 *
 * Release 5A: color only, never count — count is still driven purely by
 * growthLevel, exactly as before (an earlier release explicitly ruled
 * out adding more particles as a depth technique, and that discipline
 * still applies here, including in Release 5D below). In winter
 * (season.warmth < 0) the motes lean toward the same cool blue used
 * elsewhere for cold/night; otherwise they stay the original warm gold.
 *
 * Release 5D: light.strength gently scales the base opacity on top of
 * growthLevel's own contribution — motes read a touch dimmer at night,
 * without changing how many exist or where.
 */
export function GardenParticles({
  growthLevel,
  season,
  light,
}: {
  growthLevel: GrowthLevel;
  season: SeasonSignals;
  light: LightModel;
}) {
  if (growthLevel === 0) return null;

  const count = Math.max(1, Math.round((growthLevel / 8) * PRESETS.length));
  const opacity = ((0.25 + (growthLevel / 8) * 0.45) * (0.75 + light.strength * 0.25)).toFixed(2);
  const coolLean = Math.max(0, -season.warmth);
  const moteColor =
    coolLean > 0
      ? `color-mix(in srgb, var(--color-accent) ${(100 - coolLean * 55).toFixed(0)}%, rgb(120, 155, 200) ${(coolLean * 55).toFixed(0)}%)`
      : "var(--color-accent)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {PRESETS.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="animate-garden-mote absolute rounded-full"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            backgroundColor: moteColor,
            "--mote-opacity": opacity,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
