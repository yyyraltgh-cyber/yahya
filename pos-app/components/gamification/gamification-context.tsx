"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-context";
import { recordTrace, readTrace } from "@/lib/world/presence";
import type { XpAwardResult } from "@/lib/gamification";

interface Toast {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
}

interface GamificationContextValue {
  xp: number;
  currentStreak: number;
  longestStreak: number;
  streakFreezesAvailable: number;
  statsLoaded: boolean;
  /** Release 2B — true for a brief moment whenever celebrate() fires
   *  (task/habit completion, level-up, streak, achievement). Lets the
   *  shared environment (WorldAmbient) visibly react to the same events
   *  that already produce a toast, without any new call sites — every
   *  screen that calls celebrate() today already covers this for free. */
  worldReacting: boolean;
  /** Release 4A — how many times celebrate() has fired today (resets
   *  naturally at midnight via presence.ts's date-scoped storage key).
   *  A lasting-for-the-session trace, distinct from worldReacting's
   *  brief pulse: "the world is slightly different because you acted
   *  today," not just "something just happened." */
  todayTraceCount: number;
  refreshStats: () => Promise<void>;
  celebrate: (result: XpAwardResult, amount: number, xpReason: string) => void;
}

const GamificationContext = createContext<GamificationContextValue | null>(null);

/** Access XP/streak stats and the celebration trigger from any page under GamificationProvider. */
export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}

const ICONS = { xp: "✨", level: "🎉", achievement: "🏆", streak: "🔥", freeze: "🧊" };

/**
 * Combines XP/streak state (for the topbar badge) with a toast-based
 * celebration system (for XP/level/streak/achievement notifications).
 * Wrap any authenticated page tree with this once the user is known.
 */
export function GamificationProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [xp, setXp] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [streakFreezesAvailable, setStreakFreezesAvailable] = useState(0);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [worldReacting, setWorldReacting] = useState(false);
  const [todayTraceCount, setTodayTraceCount] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setTodayTraceCount(readTrace());
  }, []);
  const counter = useRef(0);
  const { t } = useTranslation();
  // Same reasoning as ToastProvider: this provider unmounts on every page
  // navigation (AppShell is mounted per-page, not a persistent layout),
  // and both push() and celebrate() below schedule a setState after a
  // delay from inside event handlers, not useEffect — nothing else would
  // guard them against firing after unmount.
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refreshStats = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("xp,current_streak,longest_streak,streak_freezes_available")
      .eq("id", userId)
      .single();
    if (data) {
      setXp(data.xp);
      setCurrentStreak(data.current_streak);
      setLongestStreak(data.longest_streak);
      setStreakFreezesAvailable(data.streak_freezes_available);
    }
    setStatsLoaded(true);
  }, [userId]);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = `t${counter.current++}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      if (mountedRef.current) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    }, 3200);
  }, []);

  const celebrate = useCallback(
    (result: XpAwardResult, amount: number, xpReason: string) => {
      setWorldReacting(true);
      setTimeout(() => {
        if (mountedRef.current) setWorldReacting(false);
      }, 1600);
      setTodayTraceCount(recordTrace());

      if (amount > 0) {
        push({ title: `+${amount} XP`, subtitle: xpReason, icon: ICONS.xp });
      }
      if (result.leveledUp) {
        push({ title: `Level ${result.newLevel}!`, subtitle: "You leveled up", icon: ICONS.level });
      }
      if (result.streakExtended && result.newStreak > 1) {
        push({ title: `${result.newStreak}-day streak!`, subtitle: "Keep it going", icon: ICONS.streak });
      }
      for (const ach of result.unlockedAchievements) {
        push({ title: ach.title, subtitle: ach.description, icon: ICONS.achievement });
      }
      if (result.freezeConsumed) {
        push({
          title: t("gamification.streakFreezeUsedTitle"),
          subtitle: t("gamification.streakFreezeUsedBody", { streak: result.newStreak }),
          icon: ICONS.freeze,
        });
      }
      setXp(result.newXp);
      setCurrentStreak(result.newStreak);
      if (result.newFreezesAvailable !== undefined) {
        setStreakFreezesAvailable(result.newFreezesAvailable);
      }
    },
    [push, t]
  );

  return (
    <GamificationContext.Provider
      value={{ xp, currentStreak, longestStreak, streakFreezesAvailable, statsLoaded, worldReacting, todayTraceCount, refreshStats, celebrate }}
    >
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-celebration-in pointer-events-auto flex max-w-sm items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--elevation-raised)]"
          >
            <span className="text-2xl">{t.icon}</span>
            <div>
              <p className="font-display text-sm font-semibold">{t.title}</p>
              {t.subtitle && <p className="text-xs text-[var(--color-text-muted)]">{t.subtitle}</p>}
            </div>
          </div>
        ))}
      </div>
    </GamificationContext.Provider>
  );
}
