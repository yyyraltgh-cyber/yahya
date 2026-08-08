-- ===========================================================================
-- Personal OS - Wellbeing features: daily intention journal + optional
-- single support-partner accountability (no leaderboard, no cross-user
-- data exposure beyond a same-day activity boolean).
-- Run after 0001-0005.
-- ===========================================================================

create table if not exists public.daily_intentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  intention_date date not null default current_date,
  text text not null,
  created_at timestamptz not null default now(),
  unique (user_id, intention_date)
);
alter table public.daily_intentions enable row level security;
create policy "Users manage own intentions" on public.daily_intentions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Support partners: a single mutual accountability pairing. Each side can
-- only ever see that a row exists and its status — never the other user's
-- habits, tasks, or notes. The inviter (user_id) has full control over
-- their own row; the invitee (partner_id) may only flip status to
-- 'accepted' or 'declined', never edit other fields.
create table if not exists public.support_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  unique (user_id, partner_id),
  check (user_id <> partner_id)
);
alter table public.support_partners enable row level security;

create policy "Either side can view the pairing" on public.support_partners
  for select using (auth.uid() = user_id or auth.uid() = partner_id);

create policy "Inviter manages their own invite" on public.support_partners
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Invitee can only respond to the invite" on public.support_partners
  for update using (auth.uid() = partner_id)
  with check (auth.uid() = partner_id and status in ('accepted','declined'));

create index if not exists support_partners_user_id_idx on public.support_partners(user_id);
create index if not exists support_partners_partner_id_idx on public.support_partners(partner_id);

-- Lets an accepted support partner learn ONLY whether the other person had
-- any activity today — never row-level access to xp_events itself (which
-- stays fully RLS-protected as before). security definer is required
-- because the caller has no RLS grant to read the other user's xp_events;
-- this function is the sole, narrow, read-only exception, and it first
-- verifies an accepted pairing exists before revealing even the boolean.
create or replace function public.partner_active_today(target_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  is_paired boolean;
  has_activity boolean;
begin
  select exists (
    select 1 from public.support_partners
    where status = 'accepted'
      and (
        (user_id = auth.uid() and partner_id = target_user_id) or
        (partner_id = auth.uid() and user_id = target_user_id)
      )
  ) into is_paired;

  if not is_paired then
    return null;
  end if;

  select exists (
    select 1 from public.xp_events
    where user_id = target_user_id
      and created_at >= current_date
  ) into has_activity;

  return has_activity;
end;
$$;
