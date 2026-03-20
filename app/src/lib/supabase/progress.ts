import type { SupabaseClient } from '@supabase/supabase-js';
import type { UserProgress } from '@/lib/types';
import { mergeProgress } from '@/lib/progress';

export async function fetchCloudProgress(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('questions, topics, last_updated')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  return {
    questions: data.questions as UserProgress['questions'],
    topics: data.topics as UserProgress['topics'],
    lastUpdated: data.last_updated as string,
  };
}

export async function pushProgressToCloud(
  supabase: SupabaseClient,
  userId: string,
  progress: UserProgress,
): Promise<void> {
  await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      questions: progress.questions,
      topics: progress.topics,
      last_updated: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
}

export async function syncProgressWithCloud(
  supabase: SupabaseClient,
  userId: string,
  localProgress: UserProgress,
): Promise<UserProgress> {
  const cloud = await fetchCloudProgress(supabase, userId);

  if (!cloud) {
    await pushProgressToCloud(supabase, userId, localProgress);
    return localProgress;
  }

  const merged = mergeProgress(localProgress, cloud);
  await pushProgressToCloud(supabase, userId, merged);
  return merged;
}
