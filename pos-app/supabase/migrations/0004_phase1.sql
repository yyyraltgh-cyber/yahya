-- ===========================================================================
-- Personal OS - Phase 1 foundation: localization preferences, daily goal
-- level, streak freezes, and the dismissed-suggestions log.
-- Run after 0001_init.sql, 0002_modules.sql, and 0003_gamification.sql.
-- ===========================================================================

-- Profile extensions for Phase 1 ---------------------------------------------
alter table public.profiles
  add column if not exists locale text not null default 'ar' check (locale in ('ar','en')),
  add column if not exists daily_goal_level text not null default 'medium' check (daily_goal_level in ('light','medium','ambitious')),
  add column if not exists streak_freezes_available int not null default 0;

-- Dismissed suggestions (so the client-side suggestion engine never
-- re-surfaces something the user already dismissed) ------------------------
create table if not exists public.dismissed_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  suggestion_key text not null,
  dismissed_at timestamptz not null default now(),
  unique (user_id, suggestion_key)
);
alter table public.dismissed_suggestions enable row level security;
create policy "Users manage own dismissed suggestions" on public.dismissed_suggestions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists dismissed_suggestions_user_id_idx on public.dismissed_suggestions(user_id);
