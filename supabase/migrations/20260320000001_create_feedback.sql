
-- Feedback table — collects bug reports and suggestions from users
create table if not exists public.feedback (
  id         uuid        primary key default gen_random_uuid(),
  type       text        not null check (type in ('bug', 'suggestion', 'other')),
  message    text        not null,
  email      text,
  page       text,
  user_id    uuid        references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Row Level Security
alter table public.feedback enable row level security;

-- Anyone (including anonymous visitors) may submit feedback
create policy "Anyone can submit feedback"
  on public.feedback
  for insert
  with check (true);

-- Index for time-based querying
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
