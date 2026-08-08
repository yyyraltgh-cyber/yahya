import type { AtmosphereState } from "@/lib/garden/types";

/**
 * Achievement-only effects: a soft glow + a few golden particles.
 * Renders nothing for every other state, so it costs nothing outside
 * the celebration moment.
 *
 * Sprint 6: takes atmosphere as a direct prop now instead of reading it
 * from GardenAtmosphere's context — the component tree is flatter since
 * the scene rebuild, so the context indirection no longer earned its
 * keep (Constitution §13: "the simplest solution that is honestly
 * correct"). GardenAtmosphere itself was retired.
 */
export function GardenEffects({ atmosphere }: { atmosphere: AtmosphereState }) {
  if (atmosphere !== "celebration") return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      <div
        className="absolute inset-0 rounded-[var(--radius-md)] animate-garden-glow"
        style={{ boxShadow: "0 0 18px 4px var(--color-accent)" }}
      />
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="animate-garden-particle absolute h-1 w-1 rounded-full bg-[var(--color-accent)]"
          style={{ left: `${24 + i * 16}%`, bottom: "12%", animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
  );
}
