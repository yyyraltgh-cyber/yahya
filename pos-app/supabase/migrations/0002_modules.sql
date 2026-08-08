-- ===========================================================================
-- Personal OS - schema expansion: life areas, routines, calendar, reviews,
-- knowledge base, and profile/onboarding fields.
-- Every table has RLS scoped to auth.uid(). Run after 0001_init.sql.
-- ===========================================================================

-- Profile extensions for onboarding + preferences ---------------------------
alter table public.profiles
  add column if not exists onboarded boolean not null default false,
  add column if not exists timezone text not null default 'UTC',
  add column if not exists theme text not null default 'system' check (theme in ('system','light','dark'));

-- Life areas ----------------------------------------------------------------
create table if not exists public.life_areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#6366f1',
  description text,
  created_at timestamptz not null default now()
);
alter table public.life_areas enable row level security;
create policy "Users manage own life areas" on public.life_areas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists life_areas_user_id_idx on public.life_areas(user_id);

-- Link tasks/notes/habits to a life area (nullable) -------------------------
alter table public.tasks add column if not exists area_id uuid references public.life_areas(id) on delete set null;
alter table public.notes add column if not exists area_id uuid references public.life_areas(id) on delete set null;
alter table public.habits add column if not exists area_id uuid references public.life_areas(id) on delete set null;

-- Routines (ordered checklists of steps) ------------------------------------
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  time_of_day text not null default 'morning' check (time_of_day in ('morning','afternoon','evening','anytime')),
  steps jsonb not null default '[]',
  created_at timestamptz not null default now()
);
alter table public.routines enable row level security;
create policy "Users manage own routines" on public.routines
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists routines_user_id_idx on public.routines(user_id);

-- Calendar events -----------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  location text,
  notes text,
  area_id uuid references public.life_areas(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "Users manage own events" on public.events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists events_user_id_idx on public.events(user_id);
create index if not exists events_starts_at_idx on public.events(user_id, starts_at);

-- Reviews (daily/weekly reflections) ----------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'weekly' check (kind in ('daily','weekly','monthly')),
  period_start date not null,
  went_well text,
  to_improve text,
  rating int check (rating between 1 and 5),
  created_at timestamptz not null default now(),
  unique (user_id, kind, period_start)
);
alter table public.reviews enable row level security;
create policy "Users manage own reviews" on public.reviews
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists reviews_user_id_idx on public.reviews(user_id);

-- Knowledge base articles ---------------------------------------------------
create table if not exists public.kb_articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null default '',
  tags text[] not null default '{}',
  area_id uuid references public.life_areas(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.kb_articles enable row level security;
create policy "Users manage own kb articles" on public.kb_articles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists kb_articles_user_id_idx on public.kb_articles(user_id);

-- Notifications -------------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  kind text not null default 'info' check (kind in ('info','reminder','review','system')),
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "Users manage own notifications" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index if not exists notifications_user_id_idx on public.notifications(user_id, read);

-- updated_at triggers for new tables ----------------------------------------
drop trigger if exists kb_articles_updated_at on public.kb_articles;
create trigger kb_articles_updated_at before update on public.kb_articles
  for each row execute function public.set_updated_at();
