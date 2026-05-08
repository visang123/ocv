create table if not exists public.ovc_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  password_hash text not null,
  color text,
  created_at timestamptz not null default now()
);

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
  char_length(name) = 3
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
