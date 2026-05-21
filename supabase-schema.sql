-- Run this in your Supabase project's SQL editor
-- (supabase.com → your project → SQL Editor)

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null,
  emoji       text not null default '🎯',
  target_date date not null,
  color       text not null default 'violet',
  note        text,
  created_at  timestamptz default now()
);

alter table events enable row level security;

-- Users can only see and modify their own events
create policy "Users manage own events" on events
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
