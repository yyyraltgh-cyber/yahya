-- ===========================================================================
-- Personal OS - World Memory foundation.
--
-- This is a FOUNDATION, not a feature: no application code reads or writes
-- this table yet. It exists so a future release can give the Garden actual
-- long-term memory (a stored history of what it looked like over time)
-- without a schema migration blocking that work later. Per Executive
-- Release 2, Objective 4: "Do not fake persistence. Create proper
-- foundations." — this table is real, RLS-protected, and empty by design
-- until a future release explicitly wires a write path to it.
--
-- Run after 0001-0006.
-- ===========================================================================

create table if not exists public.garden_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- The calendar date this snapshot represents (one per user per day,
  -- matching the daily cadence the Garden's growth formula already uses).
  snapshot_date date not null default current_date,

  -- The same GrowthLevel (0-8) the live formula in lib/garden/use-garden.ts
  -- already computes — this column stores a point-in-time copy of that
  -- output, not a separate or divergent calculation.
  growth_level smallint not null check (growth_level between 0 and 8),

  -- The AtmosphereState string ("calm" | "night" | "recovery" |
  -- "celebration" | "rain") active at the moment of the snapshot, for
  -- context when looking back (e.g. distinguishing "grew during a
  -- celebration" from an ordinary day).
  atmosphere text not null,

  -- Raw inputs that produced growth_level that day (habits done/total,
  -- achievements unlocked/total, current streak) — stored alongside the
  -- output so a future "why did it look like this" view never has to
  -- reverse-engineer the formula from other tables' historical state,
  -- which may itself change shape over time.
  contributing_factors jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),

  unique (user_id, snapshot_date)
);

alter table public.garden_snapshots enable row level security;

create policy "Users manage own garden snapshots" on public.garden_snapshots
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists garden_snapshots_user_date_idx
  on public.garden_snapshots (user_id, snapshot_date desc);
