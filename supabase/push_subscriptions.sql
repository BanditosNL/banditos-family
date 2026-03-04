-- Push notificaties tabel
-- Voer dit uit in Supabase SQL Editor (naast de andere tabellen)

create table if not exists push_subscriptions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users,
  gezin_code  text not null,
  subscription jsonb not null,
  aangemaakt_op timestamptz default now()
);

alter table push_subscriptions enable row level security;
create policy "gezin" on push_subscriptions for all using (true) with check (true);

-- Index voor snelle lookups
create index if not exists push_subs_gezin on push_subscriptions(gezin_code);
