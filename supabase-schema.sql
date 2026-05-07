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
