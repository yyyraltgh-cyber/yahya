import type { ProjectTemplate } from "../types";
import { spiritualProjects } from "./spiritual";
import { healthProjects } from "./health";
import { learningProjects } from "./learning";
import { careerProjects } from "./career";
import { financialProjects } from "./financial";
import { relationshipsProjects } from "./relationships";

/** All 30 project (journey) templates across the six domains. */
export const allProjects: ProjectTemplate[] = [
  ...spiritualProjects,
  ...healthProjects,
  ...learningProjects,
  ...careerProjects,
  ...financialProjects,
  ...relationshipsProjects,
];

/** Fast lookup from a project's stable id to its full template. */
export const projectsById: Record<string, ProjectTemplate> = Object.fromEntries(
  allProjects.map((p) => [p.id, p])
);

export {
  spiritualProjects,
  healthProjects,
  learningProjects,
  careerProjects,
  financialProjects,
  relationshipsProjects,
};
