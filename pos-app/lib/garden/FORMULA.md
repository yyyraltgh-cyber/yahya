# Garden Growth-Level Formula — Product Spec

*Implemented in `use-garden.ts`. This file is the reviewable source of truth for the*
*decision — the code should link back here, not restate the reasoning inline.*

---

## What this formula decides

A single number, `growthLevel` (0–8), that selects which static illustration
(`public/garden/stages/stage-N.webp`) the Garden shows. Per the Executive Constitution
§6, this number must represent something *real the user did* — never an arbitrary
animation trigger.

## The formula

```
score = habitRatio × 0.4 + achievementRatio × 0.35 + streakFactor × 0.25
growthLevel = round(score × 8), clamped to [0, 8]
```

| Term | Definition | Weight | Why |
|---|---|---|---|
| `habitRatio` | habits completed today ÷ habits scheduled today | **0.40** | The daily, recurring signal — carries the most weight because it's what the user does *most often*, and the Garden's promise is that ordinary daily effort is what grows it. |
| `achievementRatio` | achievements unlocked ÷ achievements total | **0.35** | A slower, cumulative signal — rewards sustained effort over time, not just today, so the Garden doesn't collapse to zero after one quiet day. |
| `streakFactor` | `min(currentStreak / 30, 1)` | **0.25** | Consistency over time. A 30-day streak reaches full weight — a deliberate choice, not derived from another part of the app. |

## What is deliberately *not* in the formula (yet)

- **Tasks** — the Today screen currently fetches an overdue-task *count*, not a
  completed-today count. Wiring it in would require a new query, which the original
  brief for this change explicitly disallowed. Left out rather than faked.
- **Goals / long-term projects** — no "goals" data model exists in the current schema.
  The closest concept (`user_journeys`) isn't fetched on the screen that renders the
  Garden.

Both are natural candidates for a future formula revision — but that revision should
update this document first, then the code, not the other way around.

## Changing this formula

Because the weights are a product decision (how much a day "counts" toward what the
user sees), not an engineering detail, any change to the weights, the terms, or the
0–8 scale should:

1. Update this document with the new formula and the reasoning, before or alongside
   the code change.
2. Be checked against Constitution §6 (Garden Philosophy) — specifically that growth
   stays "slow enough to feel earned and honest enough to feel true."
3. Not be a side effect of an unrelated refactor.

## Related, separate decision

`GARDEN_STAGE_HAS_WATER` in `stage-assets.ts` (which stages *visually* show water in
the illustration) is a pure art-asset fact, unrelated to this formula — it does not
affect `growthLevel`, only which decorative shimmer overlay renders on top of it.
