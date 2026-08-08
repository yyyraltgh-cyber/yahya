"use client";

/** Flame icon + current streak count, for the topbar. */
export function StreakBadge({ streak }: { streak: number }) {
  if (streak <= 0) return null;
  return (
    <div className="flex items-center gap-1 rounded-full bg-[var(--color-warning)]/15 px-2 py-1 text-xs font-semibold text-[var(--color-warning)]">
      <span key={streak} className="animate-flame-pulse">🔥</span>
      {streak}
    </div>
  );
}
