'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

function obfuscateEmail(email: string): string {
  const local = email.split('@')[0];
  return local.slice(0, 5) + '***';
}

export async function createPost(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const title = (formData.get('title') as string | null)?.trim() ?? '';
  const body = (formData.get('body') as string | null)?.trim() ?? '';

  if (!title || !body) return;

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      title,
      body,
      user_id: user.id,
      user_email: user.email ?? '',
      user_display: obfuscateEmail(user.email ?? ''),
    })
    .select('id')
    .single();

  if (error || !data) return;

  redirect(`/forum/${data.id}`);
}

export async function createComment(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const postId = (formData.get('post_id') as string | null) ?? '';
  const body = (formData.get('body') as string | null)?.trim() ?? '';

  if (!postId || !body) return;

  await supabase
    .from('forum_comments')
    .insert({
      post_id: postId,
      body,
      user_id: user.id,
      user_email: user.email ?? '',
      user_display: obfuscateEmail(user.email ?? ''),
    });

  revalidatePath(`/forum/${postId}`);
}
