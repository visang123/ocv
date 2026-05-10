create table if not exists public.ovc_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  password_hash text not null,
  color text,
  created_at timestamptz not null default now()
);

-- 로그인 분기·시크릿 창: 로컬스토리지 없이도 튜토리얼 완료 여부 복원
alter table public.ovc_accounts add column if not exists tutorial_done boolean not null default false;
alter table public.ovc_accounts add column if not exists session_token text;

alter table public.ovc_accounts enable row level security;

drop policy if exists "ovc accounts readable" on public.ovc_accounts;
drop policy if exists "ovc accounts insertable" on public.ovc_accounts;
drop policy if exists "ovc accounts color update" on public.ovc_accounts;
drop policy if exists "ovc accounts deletable" on public.ovc_accounts;

create policy "ovc accounts readable"
on public.ovc_accounts
for select
to anon
using (true);

create policy "ovc accounts insertable"
on public.ovc_accounts
for insert
to anon
with check (
  char_length(name) >= 1
  and char_length(name) <= 3
  and char_length(password_hash) = 64
);

create policy "ovc accounts color update"
on public.ovc_accounts
for update
to anon
using (true)
with check (true);

create policy "ovc accounts deletable"
on public.ovc_accounts
for delete
to anon
using (true);

create table if not exists public.ovc_presence (
  id text primary key,
  room text not null default 'ovc-main-room',
  account_id text,
  name text not null,
  color text,
  x double precision not null default 0,
  depth double precision not null default 0,
  jump_y double precision not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.ovc_presence enable row level security;

drop policy if exists "ovc presence readable" on public.ovc_presence;
drop policy if exists "ovc presence upsertable" on public.ovc_presence;
drop policy if exists "ovc presence deletable" on public.ovc_presence;

create policy "ovc presence readable"
on public.ovc_presence
for select
to anon
using (true);

create policy "ovc presence upsertable"
on public.ovc_presence
for all
to anon
using (true)
with check (true);

create policy "ovc presence deletable"
on public.ovc_presence
for delete
to anon
using (true);

-- listPresence(room, updated_at >= …) 폴링 부하 완화
create index if not exists idx_ovc_presence_room_updated_at
  on public.ovc_presence (room, updated_at desc);

create table if not exists public.ovc_world (
  room text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.ovc_world enable row level security;

drop policy if exists "ovc world readable" on public.ovc_world;
drop policy if exists "ovc world writable" on public.ovc_world;

create policy "ovc world readable"
on public.ovc_world
for select
to anon
using (true);

create policy "ovc world writable"
on public.ovc_world
for all
to anon
using (true)
with check (true);
