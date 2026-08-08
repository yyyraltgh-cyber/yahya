import type { RoutineTemplate } from "../types";
import { morningRoutines } from "./morning";
import { eveningRoutines } from "./evening";
import { weeklyRoutines } from "./weekly";
import { monthlyRoutines } from "./monthly";

/** All 50 routine templates across the four cadence groups. */
export const allRoutines: RoutineTemplate[] = [
  ...morningRoutines,
  ...eveningRoutines,
  ...weeklyRoutines,
  ...monthlyRoutines,
];

/** Fast lookup from a routine's stable id to its full template. */
export const routinesById: Record<string, RoutineTemplate> = Object.fromEntries(
  allRoutines.map((r) => [r.id, r])
);

export { morningRoutines, eveningRoutines, weeklyRoutines, monthlyRoutines };
