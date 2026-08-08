-- ===========================================================================
-- Personal OS - Content library integration: tracks which long-term
-- journeys (projects) from the static content library a user has started.
-- Habits and routines picked from the library are inserted directly into
-- the existing public.habits / public.routines tables (no new table needed
-- for those — they become normal user habits/routines once added).
-- Run after 0001-0004.
-- ===========================================================================

create table if not exists public.user_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id text not null, -- matches ProjectTemplate.id from lib/content/projects (static data, not a DB foreign key)
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, project_id)
);
alter table public.user_journeys enable row level security;
create policy "Users manage own journeys" on public.user_journeys
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists user_journeys_user_id_idx on public.user_journeys(user_id);
