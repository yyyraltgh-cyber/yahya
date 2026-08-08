/**
 * Shared type definitions for the Personal OS content library
 * (habit/routine/project templates). Pure data contracts — no logic here.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";
export type Category = "spiritual" | "work" | "health" | "learning" | "social";

export type CharacterStat =
  | "strength"
  | "intelligence"
  | "wisdom"
  | "spirit"
  | "discipline"
  | "compassion"
  | "creativity"
  | "influence";

export interface HabitTemplate {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  category: Category;
  difficulty: Difficulty;
  minLevel: number;
  xpReward: number;
  statsBoost: Partial<Record<CharacterStat, number>>;
  frequency: "daily" | "weekly" | "custom";
  suggestedTime?: "morning" | "afternoon" | "evening" | "night" | "anytime";
  estimatedMinutes: number;
  icon: string;
  tags: string[];
  motivationalQuotes: string[];
}

export interface RoutineStep {
  time?: string;
  durationMinutes: number;
  action_ar: string;
  action_en: string;
  linkedHabitId?: string;
}

export interface RoutineTemplate {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  category: Category;
  difficulty: Difficulty;
  minLevel: number;
  totalMinutes: number;
  steps: RoutineStep[];
  bestFor: string[];
  icon: string;
  xpReward: number;
}

export interface ProjectMilestone {
  day: number;
  title_ar: string;
  title_en: string;
  targetValue?: number;
  reward: {
    xp: number;
    badge?: string;
  };
}

export interface ProjectTemplate {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  category: Category;
  difficulty: Difficulty;
  minLevel: number;
  durationDays: number;
  dailyCommitmentMinutes: number;
  milestones: ProjectMilestone[];
  finalReward: {
    xp: number;
    badge: string;
    title_ar: string;
  };
  icon: string;
  successStories?: string[];
}
