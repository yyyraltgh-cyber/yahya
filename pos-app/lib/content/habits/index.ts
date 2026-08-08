import type { Category, HabitTemplate } from "../types";
import { spiritualHabits } from "./spiritual";
import { workHabits } from "./work";
import { healthHabits } from "./health";
import { learningHabits } from "./learning";
import { socialHabits } from "./social";

/** All 200 habit templates across the five life-area categories. */
export const allHabits: HabitTemplate[] = [
  ...spiritualHabits,
  ...workHabits,
  ...healthHabits,
  ...learningHabits,
  ...socialHabits,
];

/** Habits grouped by category, for category-filtered browsing. */
export const habitsByCategory: Record<Category, HabitTemplate[]> = {
  spiritual: spiritualHabits,
  work: workHabits,
  health: healthHabits,
  learning: learningHabits,
  social: socialHabits,
};

/** Fast lookup from a habit's stable id to its full template. */
export const habitsById: Record<string, HabitTemplate> = Object.fromEntries(
  allHabits.map((h) => [h.id, h])
);

export { spiritualHabits, workHabits, healthHabits, learningHabits, socialHabits };
