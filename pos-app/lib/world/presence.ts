/**
 * Release 4A — Living Relationship Engine.
 *
 * This is real persistence, not an illusion built on nothing — it's just
 * device-local (localStorage) rather than account-level (Supabase),
 * disclosed here plainly rather than left implicit. The proper,
 * account-level foundation for this already exists (garden_snapshots,
 * Release 2A) but nothing reads or writes it yet. Using localStorage for
 * the *feel* of memory today, while that real foundation waits for a
 * future release to actually wire it up, is the honest middle ground
 * between "fake it" and "block this whole release on a bigger migration
 * project" — Objective 5 explicitly asks for exactly this: use existing
 * architecture where possible, prepare foundations where necessary, but
 * do not fake persistence. Nothing here pretends to be more durable than
 * it is: a browser's local storage, cleared if the user clears it,
 * scoped to one device.
 */

const LAST_VISIT_KEY = "pos-world-last-visit";
const TRACE_KEY_PREFIX = "pos-world-trace-"; // + YYYY-MM-DD

export type PresenceMode = "first" | "continuous" | "returning" | "absence";

export interface PresenceState {
  mode: PresenceMode;
  daysSinceLastVisit: number | null;
}

function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Reads the stored last-visit date, classifies the gap, then updates the
 * stored value to today. Called once per session (WorldAmbient's mount
 * effect) — safe to call multiple times, idempotent within the same day.
 */
export function readAndUpdatePresence(): PresenceState {
  if (typeof window === "undefined") return { mode: "continuous", daysSinceLastVisit: 0 };

  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(LAST_VISIT_KEY);
    window.localStorage.setItem(LAST_VISIT_KEY, todayKey());
  } catch {
    // localStorage unavailable (private mode) — treat every visit as
    // continuous rather than let a storage error read as "absence".
    return { mode: "continuous", daysSinceLastVisit: 0 };
  }

  if (!stored) return { mode: "first", daysSinceLastVisit: null };

  const last = new Date(stored);
  const now = new Date();
  const daysSince = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince <= 1) return { mode: "continuous", daysSinceLastVisit: daysSince };
  if (daysSince <= 3) return { mode: "returning", daysSinceLastVisit: daysSince };
  return { mode: "absence", daysSinceLastVisit: daysSince };
}

/**
 * A same-day trace of "how much happened today" — incremented once per
 * celebrate() call (task/habit completion, streak, achievement), reset
 * automatically since the key is date-scoped. This is what lets the
 * world read as "slightly different because you acted" for the rest of
 * a session, not just for the brief pulse moment itself.
 */
export function recordTrace(): number {
  if (typeof window === "undefined") return 0;
  try {
    const key = TRACE_KEY_PREFIX + todayKey();
    const current = Number(window.localStorage.getItem(key) ?? "0");
    const next = current + 1;
    window.localStorage.setItem(key, String(next));
    return next;
  } catch {
    return 0;
  }
}

export function readTrace(): number {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.localStorage.getItem(TRACE_KEY_PREFIX + todayKey()) ?? "0");
  } catch {
    return 0;
  }
}
