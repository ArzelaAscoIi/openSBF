import type { SupabaseClient } from '@supabase/supabase-js';

export type ForumPost = {
  id: string;
  title: string;
  body: string;
  user_id: string;
  user_display: string;
  created_at: string;
};

export type ForumPostWithCount = ForumPost & { comment_count: number };

export type ForumComment = {
  id: string;
  post_id: string;
  body: string;
  user_id: string;
  user_display: string;
  created_at: string;
};

export async function fetchPosts(supabase: SupabaseClient): Promise<ForumPostWithCount[]> {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('id, title, body, user_id, user_display, created_at, forum_comments(count)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    body: row.body as string,
    user_id: row.user_id as string,
    user_display: row.user_display as string,
    created_at: row.created_at as string,
    comment_count: Number((row.forum_comments as Array<{ count: number | string }>)[0]?.count ?? 0),
  }));
}

export async function fetchPost(supabase: SupabaseClient, id: string): Promise<ForumPost | null> {
  const { data, error } = await supabase
    .from('forum_posts')
    .select('id, title, body, user_id, user_display, created_at')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as ForumPost;
}

export async function fetchComments(supabase: SupabaseClient, postId: string): Promise<ForumComment[]> {
  const { data, error } = await supabase
    .from('forum_comments')
    .select('id, post_id, body, user_id, user_display, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data as ForumComment[];
}

export function displayName(email: string): string {
  return email;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
