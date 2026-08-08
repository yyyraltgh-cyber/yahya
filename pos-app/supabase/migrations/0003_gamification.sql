-- ===========================================================================
-- Personal OS - Gamification: XP, levels, streaks, and achievements.
-- Run after 0001_init.sql and 0002_modules.sql.
-- ===========================================================================

-- Profile extensions for gamification ----------------------------------------
alter table public.profiles
  add column if not exists xp int not null default 0,
  add column if not exists current_streak int not null default 0,
  add column if not exists longest_streak int not null default 0,
  add column if not exists last_activity_date date;

-- XP event log (every award is recorded here; used for history + anti-cheat) -
create table if not exists public.xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  reason text not null,
  source_type text not null check (source_type in ('task','habit','routine','review','note','area','streak_bonus','achievement')),
  source_id uuid,
  created_at timestamptz not null default now()
);
alter table public.xp_events enable row level security;
create policy "Users manage own xp events" on public.xp_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists xp_events_user_id_idx on public.xp_events(user_id, created_at desc);

-- Achievement catalog (static reference data, readable by everyone) ---------
create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null default 'star',
  xp_reward int not null default 0,
  sort_order int not null default 0
);
alter table public.achievements enable row level security;
create policy "Anyone can read achievements catalog" on public.achievements
  for select using (true);

-- Unlocked achievements per user ---------------------------------------------
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);
alter table public.user_achievements enable row level security;
create policy "Users manage own unlocked achievements" on public.user_achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists user_achievements_user_id_idx on public.user_achievements(user_id);

-- Seed the achievement catalog -----------------------------------------------
insert into public.achievements (id, title, description, icon, xp_reward, sort_order) values
  ('first_task',      'Getting Started',   'Complete your first task',              'check-circle', 10, 1),
  ('first_habit',     'Habit Former',      'Log your first habit',                  'repeat',       10, 2),
  ('first_routine',   'Routine Runner',    'Finish a full routine',                 'list-checks',  10, 3),
  ('first_review',    'Reflective Mind',   'Write your first review',               'book-open',    10, 4),
  ('streak_3',        'On a Roll',         'Reach a 3-day streak',                  'flame',        20, 5),
  ('streak_7',        'Week Warrior',      'Reach a 7-day streak',                  'flame',        40, 6),
  ('streak_30',       'Unstoppable',       'Reach a 30-day streak',                 'flame',       150, 7),
  ('tasks_10',        'Task Slayer',       'Complete 10 tasks',                     'check-circle', 30, 8),
  ('tasks_50',        'Productivity Pro',  'Complete 50 tasks',                     'check-circle', 80, 9),
  ('level_5',         'Rising Star',       'Reach level 5',                         'star',         30, 10),
  ('level_10',        'High Achiever',     'Reach level 10',                        'star',         60, 11),
  ('area_creator',    'Life Architect',    'Create your first life area',           'layers',       10, 12),
  ('knowledge_5',     'Curious Mind',      'Save 5 knowledge articles',             'book-open',    30, 13)
on conflict (id) do nothing;
