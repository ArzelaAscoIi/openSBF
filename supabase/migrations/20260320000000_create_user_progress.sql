
-- User progress table — one row per user, progress stored as JSONB
create table if not exists public.user_progress (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users(id) on delete cascade,
  questions    jsonb       not null default '{}',
  topics       jsonb       not null default '{}',
  last_updated timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  constraint user_progress_user_id_key unique (user_id)
);

-- Row Level Security
alter table public.user_progress enable row level security;

create policy "Users can read own progress"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress
  for update
  using (auth.uid() = user_id);

-- Index for fast lookups by user
create index if not exists user_progress_user_id_idx on public.user_progress (user_id);
