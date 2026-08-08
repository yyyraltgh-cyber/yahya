import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Achievement } from "@/lib/types/database";
import { todayISO } from "@/lib/utils";
import {
  shouldConsumeFreeze,
  consumeFreeze,
  grantFreeze,
  isFreezeGrantingAchievement,
} from "@/lib/engine/streak-freeze-engine";
import { translate, DEFAULT_LOCALE } from "@/lib/i18n/translate";

type Client = SupabaseClient<Database>;

/**
 * Level curve: level N requires N * 50 more XP than level N-1 (classic
 * Duolingo-style ramp). Level 1 starts at 0 XP.
 * xpForLevel(n) = total cumulative XP needed to REACH level n.
 */
export function xpForLevel(level: number): number {
  // Sum of 50*k for k=1..level-1
  const n = level - 1;
  return (50 * n * (n + 1)) / 2;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level++;
  return level;
}

export function levelProgress(xp: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPct: number;
} {
  const level = levelFromXp(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const xpIntoLevel = xp - floor;
  const xpForNextLevel = ceil - floor;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progressPct: Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)),
  };
}

export const XP_REWARDS = {
  task_complete: 10,
  habit_log: 8,
  routine_complete: 15,
  review_submit: 12,
  note_create: 3,
  area_create: 5,
} as const;

export type XpSourceType = "task" | "habit" | "routine" | "review" | "note" | "area" | "streak_bonus" | "achievement";

export interface XpAwardResult {
  newXp: number;
  oldLevel: number;
  newLevel: number;
  leveledUp: boolean;
  newStreak: number;
  streakExtended: boolean;
  /** Present only when awardXp() itself ran the streak computation. Absent
   * on synthetic achievement-only results built elsewhere in the app, which
   * never touch streak freezes. */
  freezeConsumed?: boolean;
  newFreezesAvailable?: number;
  unlockedAchievements: Achievement[];
}

/**
 * Awards XP to the current user, updates their streak, logs the event, and
 * checks for newly-unlocked achievements. Call this after any meaningful
 * user action (completing a task, logging a habit, etc).
 */
export async function awardXp(
  supabase: Client,
  userId: string,
  amount: number,
  reason: string,
  sourceType: XpSourceType,
  sourceId?: string
): Promise<XpAwardResult | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp,current_streak,longest_streak,last_activity_date,streak_freezes_available,locale")
    .eq("id", userId)
    .single();

  if (!profile) return null;

  const oldLevel = levelFromXp(profile.xp);
  const today = todayISO();

  // Streak logic: extend if last activity was yesterday, keep if today,
  // consume a streak freeze if exactly one day was missed (see
  // lib/engine/streak-freeze-engine.ts), otherwise reset to 1.
  let newStreak = profile.current_streak;
  let streakExtended = false;
  let freezeConsumed = false;
  let newFreezesAvailable = profile.streak_freezes_available;
  if (profile.last_activity_date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayISO = yesterday.toISOString().slice(0, 10);

    if (profile.last_activity_date === yesterdayISO) {
      newStreak = profile.current_streak + 1;
    } else {
      const daysSinceLastActivity = profile.last_activity_date
        ? Math.round(
            (new Date(today).getTime() - new Date(profile.last_activity_date).getTime()) /
              (24 * 60 * 60 * 1000)
          )
        : Infinity;

      if (shouldConsumeFreeze(daysSinceLastActivity, profile.streak_freezes_available)) {
        newStreak = profile.current_streak + 1;
        newFreezesAvailable = consumeFreeze(profile.streak_freezes_available);
        freezeConsumed = true;
      } else {
        newStreak = 1;
      }
    }
    streakExtended = true;
  }
  const newLongest = Math.max(profile.longest_streak, newStreak);
  const newXp = profile.xp + amount;
  const newLevel = levelFromXp(newXp);

  await supabase
    .from("profiles")
    .update({
      xp: newXp,
      current_streak: newStreak,
      longest_streak: newLongest,
      last_activity_date: today,
      streak_freezes_available: newFreezesAvailable,
    })
    .eq("id", userId);

  await supabase.from("xp_events").insert({
    user_id: userId,
    amount,
    reason,
    source_type: sourceType,
    source_id: sourceId ?? null,
  });

  const unlockedAchievements = await checkAchievements(supabase, userId, {
    newLevel,
    newStreak,
  });

  if (freezeConsumed) {
    const locale = profile.locale === "en" ? "en" : DEFAULT_LOCALE;
    await supabase.from("notifications").insert({
      user_id: userId,
      title: translate(locale, "gamification.streakFreezeUsedTitle"),
      body: translate(locale, "gamification.streakFreezeUsedBody", { streak: newStreak }),
      kind: "system",
    });
  }

  return {
    newXp,
    oldLevel,
    newLevel,
    leveledUp: newLevel > oldLevel,
    newStreak,
    streakExtended,
    freezeConsumed,
    newFreezesAvailable,
    unlockedAchievements,
  };
}

/**
 * Checks milestone-based achievements (streaks, levels, counts) and unlocks
 * any newly-earned ones, awarding their bonus XP. Returns the list of newly
 * unlocked achievements so the UI can celebrate them.
 */
async function checkAchievements(
  supabase: Client,
  userId: string,
  ctx: { newLevel: number; newStreak: number }
): Promise<Achievement[]> {
  const { data: alreadyUnlocked } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId);
  const unlockedIds = new Set((alreadyUnlocked ?? []).map((a) => a.achievement_id));

  const candidates: string[] = [];

  if (ctx.newStreak >= 3) candidates.push("streak_3");
  if (ctx.newStreak >= 7) candidates.push("streak_7");
  if (ctx.newStreak >= 30) candidates.push("streak_30");
  if (ctx.newLevel >= 5) candidates.push("level_5");
  if (ctx.newLevel >= 10) candidates.push("level_10");

  const toCheck = candidates.filter((id) => !unlockedIds.has(id));
  if (toCheck.length === 0) return [];

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .in("id", toCheck);

  const newlyUnlocked: Achievement[] = [];
  for (const ach of achievements ?? []) {
    const { error } = await supabase
      .from("user_achievements")
      .insert({ user_id: userId, achievement_id: ach.id });
    if (!error) {
      newlyUnlocked.push(ach);
      if (ach.xp_reward > 0) {
        await supabase
          .from("profiles")
          .update({ xp: (await getCurrentXp(supabase, userId)) + ach.xp_reward })
          .eq("id", userId);
        await supabase.from("xp_events").insert({
          user_id: userId,
          amount: ach.xp_reward,
          reason: `Achievement: ${ach.title}`,
          source_type: "achievement",
          source_id: ach.id,
        });
      }
      // Streak-milestone achievements also grant a streak freeze, capped
      // at MAX_STREAK_FREEZES (see lib/engine/streak-freeze-engine.ts).
      if (isFreezeGrantingAchievement(ach.id)) {
        const currentFreezes = await getCurrentFreezes(supabase, userId);
        await supabase
          .from("profiles")
          .update({ streak_freezes_available: grantFreeze(currentFreezes) })
          .eq("id", userId);
      }
    }
  }
  return newlyUnlocked;
}

async function getCurrentXp(supabase: Client, userId: string): Promise<number> {
  const { data } = await supabase.from("profiles").select("xp").eq("id", userId).single();
  return data?.xp ?? 0;
}

async function getCurrentFreezes(supabase: Client, userId: string): Promise<number> {
  const { data } = await supabase
    .from("profiles")
    .select("streak_freezes_available")
    .eq("id", userId)
    .single();
  return data?.streak_freezes_available ?? 0;
}

/**
 * Checks count-based achievements (first task, N tasks, etc). Call this
 * after fetching a fresh count from the relevant table.
 */
export async function checkCountAchievement(
  supabase: Client,
  userId: string,
  achievementId: string,
  currentCount: number,
  threshold: number
): Promise<Achievement | null> {
  if (currentCount < threshold) return null;

  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_id", achievementId)
    .maybeSingle();
  if (existing) return null;

  const { data: ach } = await supabase
    .from("achievements")
    .select("*")
    .eq("id", achievementId)
    .single();
  if (!ach) return null;

  const { error } = await supabase
    .from("user_achievements")
    .insert({ user_id: userId, achievement_id: achievementId });
  if (error) return null;

  if (ach.xp_reward > 0) {
    const currentXp = await getCurrentXp(supabase, userId);
    await supabase.from("profiles").update({ xp: currentXp + ach.xp_reward }).eq("id", userId);
    await supabase.from("xp_events").insert({
      user_id: userId,
      amount: ach.xp_reward,
      reason: `Achievement: ${ach.title}`,
      source_type: "achievement",
      source_id: ach.id,
    });
  }

  return ach;
}
