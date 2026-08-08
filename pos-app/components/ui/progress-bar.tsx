/**
 * A single progress fill. The `key`-based re-mount-to-replay-animation
 * trick (used by both call sites this replaces) stays the caller's
 * responsibility — pass a `resetKey` that changes when the value should
 * visibly animate from empty again (e.g. the XP total itself).
 */
export function ProgressBar({
  percent,
  resetKey,
  className,
}: {
  percent: number;
  resetKey?: string | number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={`h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)] ${className ?? ""}`}>
      <div
        key={resetKey}
        className="animate-xp-fill h-full rounded-full bg-[var(--color-primary)]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
