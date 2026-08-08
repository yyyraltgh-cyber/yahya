import type { AtmosphereState } from "@/lib/garden/types";

/**
 * Recovery weather, rebuilt to span the full scene instead of a small
 * overlay clipped to the plant's own box. Rain falls from the sky
 * through the whole frame; mist drifts at mid-height. Still explicitly
 * gentle — "tending needed," never a storm (Constitution §6).
 *
 * Naming note (Release 5E): this component predates, and is unrelated
 * to, lib/world/weather.ts's WeatherModel/computeWeather — that's a
 * world-level engine (humidity/clarity/precipitationChance, derived
 * from season+light, renders nothing itself); this is a Garden-specific
 * visual tied to the Garden's own `atmosphere` prop (useGarden's daily
 * formula output). Release 5E's brief explicitly forbids this release
 * from drawing rain — that instruction governs new work, not this
 * already-approved effect, which stays exactly as it was.
 */
export function GardenWeather({ atmosphere }: { atmosphere: AtmosphereState }) {
  if (atmosphere !== "recovery") return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="animate-garden-rain absolute top-0 h-4 w-px bg-[var(--color-primary)]/40"
          style={{ left: `${12 + i * 18}%`, animationDelay: `${i * 0.35}s` }}
        />
      ))}
      <div
        className="animate-garden-mist absolute inset-x-[-10%] top-[38%] h-1/4 rounded-full blur-lg"
        style={{ background: "var(--color-text-muted)" }}
      />
    </div>
  );
}
