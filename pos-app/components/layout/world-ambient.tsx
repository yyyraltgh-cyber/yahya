"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getLocation } from "@/lib/world/locations";
import { readAndUpdatePresence } from "@/lib/world/presence";
import { useWorldHistory } from "@/lib/world/use-world-history";
import { useWorldLegacy } from "@/lib/world/use-world-legacy";
import { WorldLightProvider, useWorldLight } from "@/lib/world/world-light-context";
import { useGamification } from "@/components/gamification/gamification-context";

const ABSENCE_WELCOME_DURATION_MS = 2600;

/**
 * Release 5D: WorldAmbient now mounts WorldLightProvider once (see
 * lib/world/world-light-context.tsx) and its own rendering reads from
 * that shared context via useWorldLight() — the same object GardenScene
 * and every layer inside it now read too, instead of each independently
 * calling useUnifiedSeason()/useWorldDirection() a second time. This is
 * the fix for a real duplicate-query issue: before this release, every
 * page load fired the season/direction Supabase queries twice.
 *
 * Release 5E: also reads `weather` from the same context (no new call)
 * — one small, capped term (weatherBoost) folded into the existing
 * intensity chain, per Objective 5's explicit list naming "Ambient" as
 * a Weather consumer.
 */
export function WorldAmbient({ userId, children }: { userId: string; children: ReactNode }) {
  return (
    <WorldLightProvider userId={userId}>
      <WorldAmbientLayers userId={userId}>{children}</WorldAmbientLayers>
    </WorldLightProvider>
  );
}

function WorldAmbientLayers({ userId, children }: { userId: string; children: ReactNode }) {
  const [absenceWelcome, setAbsenceWelcome] = useState(false);
  const { worldReacting, currentStreak, todayTraceCount } = useGamification();
  const { period, season, weather } = useWorldLight();
  const familiarityFactor = useWorldHistory(userId);
  const legacyTier = useWorldLegacy(userId);
  const pathname = usePathname();
  const location = getLocation(pathname ?? "");

  useEffect(() => {
    const presence = readAndUpdatePresence();
    if (presence.mode === "absence") {
      setAbsenceWelcome(true);
      const timer = setTimeout(() => setAbsenceWelcome(false), ABSENCE_WELCOME_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  const consistencyFactor = 1 + (Math.min(currentStreak, 30) / 30) * 0.3;
  const traceFactor = 1 + (Math.min(todayTraceCount, 5) / 5) * 0.2;
  const familiarityBoost = 1 + familiarityFactor * 0.15;
  const legacyBoost = 1 + legacyTier * 0.025;
  const seasonBoost = 1 + season.warmth * 0.05;
  // Smallest term of all — weather is itself derived from season+light,
  // so giving it a large independent weight here would double-count the
  // same underlying signal twice. A hazier reading (low clarity) mutes
  // the wash by up to 4%; a clear one leaves it untouched.
  const weatherBoost = 0.96 + weather.clarity * 0.04;
  const combinedIntensity =
    location.intensity *
    consistencyFactor *
    traceFactor *
    familiarityBoost *
    legacyBoost *
    seasonBoost *
    weatherBoost;

  const reacting = worldReacting || absenceWelcome;

  return (
    <div className={`world-ambient world-ambient-${period} ${reacting ? "world-ambient-reacting" : ""}`}>
      <div className="world-ambient-layer world-ambient-vignette" aria-hidden="true" />
      <div className="world-ambient-layer world-ambient-glow" aria-hidden="true" />
      <div
        className={`world-ambient-layer world-ambient-location world-ambient-location-${location.family} world-ambient-anchor-${location.anchorY ?? "low"}`}
        style={{ "--location-intensity": combinedIntensity } as CSSProperties}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
