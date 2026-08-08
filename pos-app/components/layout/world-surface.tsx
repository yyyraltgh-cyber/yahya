"use client";

import type { ReactNode } from "react";
import { useWorldLight } from "@/lib/world/world-light-context";

/**
 * Release 2C — Spatial World Architecture, Objective 1: the layer model
 * asked for is Environment → World Surface → Interactive Surface →
 * Primary Focus → Transient Elements. Releases 2A/2B built Environment
 * (WorldAmbient) and left everything else sitting directly on it —
 * Cards read as floating rectangles because there was nothing between
 * "the atmosphere" and "the card" for the eye to register as a surface.
 *
 * This is that missing surface. Deliberately NOT glow, NOT opacity, NOT
 * a gradient (Objective 2 explicitly rules those out as the primary
 * technique) — it's a real light-hierarchy cue: a thin highlight at the
 * top (light falls on a surface from above; the top edge catches it)
 * and a soft, neutral (not color-tinted) contact shadow at the bottom
 * (the surface has weight and rests on something).
 *
 * Release 5D: those two values were fixed regardless of time of day —
 * now they read from the same shared Light Model everything else in the
 * world does (useWorldLight, one computation, see world-light-context).
 * shadowSoftness widens the blur/spread of the bottom shadow; strength
 * scales the top highlight's brightness. World Surface was explicitly
 * named in this release's brief as a required consumer of the shared
 * light source, alongside Garden Scene, Sky, Ground, Particles, and
 * World Ambient.
 *
 * No background color of its own — fully transparent, so it never
 * competes with WorldAmbient beneath it or adds visual noise (Objective
 * 6). It's felt as a boundary, not seen as a shape.
 */
export function WorldSurface({ children }: { children: ReactNode }) {
  const { light } = useWorldLight();
  const highlightAlpha = (0.03 + light.strength * 0.02).toFixed(3);
  const shadowBlur = (40 + light.shadowSoftness * 24).toFixed(0);
  const shadowSpread = (-28 - light.shadowSoftness * 8).toFixed(0);

  return (
    <div
      style={{
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, ${highlightAlpha}), 0 24px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.35)`,
        borderRadius: "var(--radius-card)",
      }}
    >
      {children}
    </div>
  );
}
