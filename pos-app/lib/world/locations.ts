/**
 * Release 3A — World Map Architecture.
 *
 * Internal logic discovered before implementing anything (per the brief's
 * explicit instruction not to redesign screens independently): every
 * destination in Personal OS falls into one of four purposes, and every
 * purpose has one atmosphere family. Four families, not twelve unique
 * hues — enough for each place to be genuinely itself, not so much that
 * the app reads as twelve different products wearing one sidebar.
 *
 *  - GROWTH  — tending a life (the Garden's own family: teal-leaning).
 *    Habits (a garden path — the most daily, most direct echo of the
 *    Garden itself) and Life Areas (a map of the same life the Garden
 *    represents).
 *  - FOCUS   — active work (clear, minimally tinted, slightly brighter).
 *    Tasks (a workshop) and Notes (a study).
 *  - WARM    — anything reflective, accumulated, or ceremonial
 *    (gold-leaning, the Garden's own accent family). Routines (a
 *    hearth — ritual), Reviews (a sanctuary — the softest, dimmest of
 *    this family, since reflection is quieter than ceremony), Knowledge
 *    Base (an archive), the Content Library (a reading room, slightly
 *    brighter than the Archive — browsing versus keeping), and
 *    Achievements (a gallery — composed, not a trophy case).
 *  - SKY     — observation and time (cool, blue-leaning, night-adjacent
 *    even by day). Calendar (a horizon — wide, low-anchored) and
 *    Statistics (an observatory — the same family, top-anchored, since
 *    looking up and looking out are the same act with a different
 *    direction).
 *  - NEUTRAL — corridors, not destinations. Settings, Search,
 *    Notifications: utilities are allowed to stay utilitarian, per the
 *    Design DNA's own "attention hierarchy" principle — not everything
 *    needs to announce a place.
 *
 * intensity is a multiplier on the existing wash strength (1 = same as
 * the app's baseline, introduced in Release 2B); anchorY only matters
 * for the "sky" family, distinguishing a horizon (low) from an
 * observatory (high).
 */
export type LocationFamily = "growth" | "focus" | "warm" | "sky" | "neutral";

export interface Location {
  family: LocationFamily;
  intensity: number;
  anchorY?: "low" | "high";
}

const LOCATIONS: { prefix: string; location: Location }[] = [
  { prefix: "/habits", location: { family: "growth", intensity: 1 } },
  { prefix: "/areas", location: { family: "growth", intensity: 0.85 } },
  { prefix: "/tasks", location: { family: "focus", intensity: 1 } },
  { prefix: "/notes", location: { family: "focus", intensity: 0.85 } },
  { prefix: "/routines", location: { family: "warm", intensity: 1.1 } },
  { prefix: "/reviews", location: { family: "warm", intensity: 0.7 } },
  { prefix: "/knowledge", location: { family: "warm", intensity: 0.9 } },
  { prefix: "/library", location: { family: "warm", intensity: 1 } },
  { prefix: "/achievements", location: { family: "warm", intensity: 1 } },
  { prefix: "/calendar", location: { family: "sky", intensity: 0.9, anchorY: "low" } },
  { prefix: "/statistics", location: { family: "sky", intensity: 0.9, anchorY: "high" } },
];

const DEFAULT_LOCATION: Location = { family: "neutral", intensity: 0 };

/** Dashboard is intentionally excluded — it's the Garden itself, not a
 *  location relative to it, and its own scene already carries far more
 *  identity than this system provides. */
export function getLocation(pathname: string): Location {
  const match = LOCATIONS.find((l) => pathname.startsWith(l.prefix));
  return match?.location ?? DEFAULT_LOCATION;
}
