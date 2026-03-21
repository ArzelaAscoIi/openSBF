create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_posts enable row level security;

create policy "Anyone can read posts"
  on public.forum_posts for select
  using (true);

create policy "Authenticated users can insert posts"
  on public.forum_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own posts"
  on public.forum_posts for delete
  to authenticated
  using (auth.uid() = user_id);

create table public.forum_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  body text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_comments enable row level security;

create policy "Anyone can read comments"
  on public.forum_comments for select
  using (true);

create policy "Authenticated users can insert comments"
  on public.forum_comments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.forum_comments for delete
  to authenticated
  using (auth.uid() = user_id);

create index on public.forum_posts(created_at desc);
create index on public.forum_comments(post_id, created_at asc);
