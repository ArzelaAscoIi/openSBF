import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { fetchPost, fetchComments, displayName, formatDate } from '@/lib/supabase/forum';
import { CommentForm } from './CommentForm';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const post = await fetchPost(supabase, id);
  return { title: post ? `${post.title} – OpenSBF Forum` : 'Forum – OpenSBF' };
}

export default async function ForumPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [post, comments, { data: { user } }] = await Promise.all([
    fetchPost(supabase, id),
    fetchComments(supabase, id),
    supabase.auth.getUser(),
  ]);

  if (!post) notFound();

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div className="border-b px-4 py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/forum"
            className="text-xs font-medium mb-6 inline-block transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← Forum
          </Link>
          <h1
            className="text-2xl font-bold mb-3 leading-snug"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
            <span>{displayName(post.user_display)}</span>
            <span style={{ color: 'var(--border-hover)' }}>·</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div
          className="px-5 py-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
            color: 'var(--white)',
          }}
        >
          {post.body}
        </div>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--muted)' }}>
            {comments.length === 0
              ? 'Noch keine Kommentare'
              : `${comments.length} ${comments.length === 1 ? 'Kommentar' : 'Kommentare'}`}
          </h2>

          {comments.length > 0 && (
            <div className="space-y-3 mb-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="px-5 py-4 rounded-xl"
                  style={{
                    background: 'var(--navy)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <p
                    className="text-sm leading-relaxed whitespace-pre-wrap mb-3"
                    style={{ color: 'var(--white)' }}
                  >
                    {comment.body}
                  </p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--muted)' }}>
                    <span>{displayName(comment.user_display)}</span>
                    <span style={{ color: 'var(--border-hover)' }}>·</span>
                    <span>{formatDate(comment.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <CommentForm postId={post.id} userEmail={user?.email ?? null} />
        </section>
      </div>
    </div>
  );
}
