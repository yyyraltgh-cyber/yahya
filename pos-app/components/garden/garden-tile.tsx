"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { GARDEN_STAGE_HAS_WATER, GARDEN_STAGE_IMAGE } from "@/lib/garden/stage-assets";
import { GROWTH_STAGE_LABELS, type GrowthLevel } from "@/lib/garden/types";
import { useWorldLight } from "@/lib/world/world-light-context";

// Must match the garden-crossfade-in animation duration in globals.css.
const TRANSITION_MS = 380;

/**
 * Displays the current growth-level illustration with a real crossfade:
 * the outgoing image stays put while the incoming one fades+scales in on
 * top of it, then swaps in as the new base once the transition settles —
 * no instant pop, no layout shift.
 *
 * Release 5G — Wind Engine's one deliberate consumer (this release's
 * brief permits exactly one). The sway animation already existed
 * (Release 5A, an approximation of "wind" on the plant) with a fixed
 * ±0.6deg/8s. It now reads real wind.strength/gustiness, within a
 * deliberately narrow band that stays close to those original numbers —
 * Objective 7 ("slow, elegant, natural, no exaggerated movement") is
 * the reason the range is this tight, not an oversight. No new
 * animation was created; the existing keyframe (globals.css) now reads
 * two CSS custom properties instead of two hardcoded values, and
 * defaults to the exact original numbers when they're unset.
 */
export function GardenTile({ growthLevel }: { growthLevel: GrowthLevel }) {
  const [displayed, setDisplayed] = useState(growthLevel);
  const [incoming, setIncoming] = useState<GrowthLevel | null>(null);
  const prevRef = useRef(growthLevel);
  const { wind } = useWorldLight();

  useEffect(() => {
    if (growthLevel === prevRef.current) return;
    setIncoming(growthLevel);
    const timer = setTimeout(() => {
      setDisplayed(growthLevel);
      setIncoming(null);
      prevRef.current = growthLevel;
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [growthLevel]);

  const hasWater = GARDEN_STAGE_HAS_WATER[displayed];

  // 0.4deg-0.8deg (original was a fixed 0.6deg) and 7s-10s (original was
  // a fixed 8s) — both ranges deliberately straddle the pre-Wind values
  // rather than escalate past them.
  const windAmplitude = `${(0.4 + wind.strength * 0.4).toFixed(2)}deg`;
  const windDuration = `${(10 - wind.gustiness * 3).toFixed(1)}s`;

  return (
    <div
      className="animate-garden-sway relative h-32 w-32 shrink-0 overflow-hidden rounded-[var(--radius-md)] sm:h-40 sm:w-40 lg:h-48 lg:w-48"
      style={{ "--wind-amplitude": windAmplitude, "--wind-duration": windDuration } as CSSProperties}
    >
      <Image
        key={`base-${displayed}`}
        src={GARDEN_STAGE_IMAGE[displayed]}
        alt={GROWTH_STAGE_LABELS[displayed]}
        fill
        sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 128px"
        className="object-contain"
        priority
      />
      {incoming !== null && (
        <Image
          key={`incoming-${incoming}`}
          src={GARDEN_STAGE_IMAGE[incoming]}
          alt={GROWTH_STAGE_LABELS[incoming]}
          fill
          sizes="(min-width: 1024px) 192px, (min-width: 640px) 160px, 128px"
          className="object-contain animate-garden-crossfade-in"
          priority
        />
      )}
      {hasWater && (
        <div className="pointer-events-none absolute inset-0 animate-garden-water-shimmer" aria-hidden="true" />
      )}
    </div>
  );
}
