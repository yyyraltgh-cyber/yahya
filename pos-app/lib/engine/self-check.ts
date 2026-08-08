import { generateSuggestions } from "./suggestion-engine";
import type { SuggestionContext } from "./suggestion-engine";
import { rules } from "@/lib/suggestions";

/**
 * Lightweight, dependency-free correctness checks for the suggestion
 * engine. No test framework (Jest/Vitest) is installed in this project,
 * so this module stands in for one: call runSuggestionEngineSelfCheck()
 * manually (e.g. from a scratch script or the browser console) to sanity
 * check the engine after changing a rule. Not imported by any page or
 * build step — it has zero effect on the shipped app.
 */

interface CheckResult {
  name: string;
  pass: boolean;
  detail?: string;
}

function baseContext(overrides: Partial<SuggestionContext> = {}): SuggestionContext {
  return {
    now: new Date("2026-07-22T10:00:00"),
    tasks: [],
    habits: [],
    habitLogs: [],
    routines: [],
    reviews: [],
    lifeAreas: [],
    streak: { current: 0, lastActivityDate: null },
    ...overrides,
  };
}

function checkDeterminism(): CheckResult {
  const ctx = baseContext({
    tasks: [
      {
        id: "t1",
        user_id: "u1",
        title: "Overdue thing",
        description: null,
        status: "todo",
        priority: "medium",
        due_date: "2026-07-20",
        area_id: null,
        created_at: "2026-07-01T00:00:00Z",
        updated_at: "2026-07-01T00:00:00Z",
      },
    ],
  });
  const first = generateSuggestions(ctx, rules);
  const second = generateSuggestions(ctx, rules);
  const same =
    first.length === second.length &&
    first.every((s, i) => s.key === second[i].key && s.priority === second[i].priority);
  return {
    name: "determinism: same context produces identical output",
    pass: same,
    detail: same ? undefined : "two runs with the same context produced different results",
  };
}

function checkUniqueKeys(): CheckResult {
  const ctx = baseContext({
    tasks: [
      { id: "t1", user_id: "u1", title: "A", description: null, status: "todo", priority: "medium", due_date: "2026-07-20", area_id: "area1", created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z" },
      { id: "t2", user_id: "u1", title: "B", description: null, status: "todo", priority: "medium", due_date: "2026-07-20", area_id: "area1", created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z" },
      { id: "t3", user_id: "u1", title: "C", description: null, status: "todo", priority: "medium", due_date: "2026-07-20", area_id: "area1", created_at: "2026-07-01T00:00:00Z", updated_at: "2026-07-01T00:00:00Z" },
    ],
  });
  const results = generateSuggestions(ctx, rules);
  const keys = results.map((s) => s.key);
  const unique = new Set(keys).size === keys.length;
  return {
    name: "every suggestion key is unique within one run",
    pass: unique,
    detail: unique ? undefined : `duplicate keys found: ${keys.join(", ")}`,
  };
}

function checkOverdueTasksRuleFires(): CheckResult {
  const ctx = baseContext({
    tasks: [
      { id: "t1", user_id: "u1", title: "Late", description: null, status: "todo", priority: "medium", due_date: "2020-01-01", area_id: null, created_at: "2020-01-01T00:00:00Z", updated_at: "2020-01-01T00:00:00Z" },
    ],
  });
  const results = generateSuggestions(ctx, rules);
  const pass = results.some((s) => s.key === "overdue_tasks");
  return { name: "overdue task produces the overdue_tasks suggestion", pass };
}

function checkNoTasksNoSuggestion(): CheckResult {
  const ctx = baseContext();
  const results = generateSuggestions(ctx, rules);
  const pass = !results.some((s) => s.key === "overdue_tasks");
  return { name: "empty context produces no overdue_tasks suggestion", pass };
}

function checkStreakAtRiskRespectsHour(): CheckResult {
  const morningCtx = baseContext({
    now: new Date("2026-07-22T09:00:00"),
    streak: { current: 5, lastActivityDate: "2026-07-21" },
  });
  const eveningCtx = baseContext({
    now: new Date("2026-07-22T20:00:00"),
    streak: { current: 5, lastActivityDate: "2026-07-21" },
  });
  const morningResults = generateSuggestions(morningCtx, rules);
  const eveningResults = generateSuggestions(eveningCtx, rules);
  const pass =
    !morningResults.some((s) => s.key === "streak_at_risk") &&
    eveningResults.some((s) => s.key === "streak_at_risk");
  return {
    name: "streak_at_risk only fires in the evening when streak not yet extended",
    pass,
  };
}

/** Runs all self-checks and returns a pass/fail summary. */
export function runSuggestionEngineSelfCheck(): { pass: boolean; results: CheckResult[] } {
  const results = [
    checkDeterminism(),
    checkUniqueKeys(),
    checkOverdueTasksRuleFires(),
    checkNoTasksNoSuggestion(),
    checkStreakAtRiskRespectsHour(),
  ];
  return { pass: results.every((r) => r.pass), results };
}
