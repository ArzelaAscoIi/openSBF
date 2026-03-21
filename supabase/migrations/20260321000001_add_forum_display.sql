alter table public.forum_posts
  add column user_display text not null default '';

alter table public.forum_comments
  add column user_display text not null default '';

update public.forum_posts
  set user_display = left(split_part(user_email, '@', 1), 5) || '***';

update public.forum_comments
  set user_display = left(split_part(user_email, '@', 1), 5) || '***';
