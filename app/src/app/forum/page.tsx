import Link from 'next/link';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/server';
import { fetchPosts, displayName, formatDate } from '@/lib/supabase/forum';

export const metadata = {
  title: 'Forum – OpenSBF',
  description: 'Stell Fragen und diskutiere mit der Community rund um den Sportbootführerschein.',
};

export default async function ForumPage() {
  const supabase = await createClient();
  const [posts, { data: { user } }] = await Promise.all([
    fetchPosts(supabase),
    supabase.auth.getUser(),
  ]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div className="border-b px-4 py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-xs font-medium mb-6 inline-block transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← Start
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
              >
                Forum
              </h1>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                Fragen stellen, Tipps teilen, gemeinsam lernen
              </p>
            </div>
            {user ? (
              <Link
                href="/forum/new"
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
                style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
              >
                + Frage stellen
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                style={{
                  color: 'var(--muted)',
                  border: '1px solid var(--border)',
                }}
              >
                Anmelden um zu fragen
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-2">
        {posts.length === 0 && (
          <div
            className="text-center py-16 rounded-xl"
            style={{ border: '1px dashed var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              Noch keine Beiträge.{' '}
              {user ? (
                <Link href="/forum/new" style={{ color: 'var(--gold)' }}>
                  Stell die erste Frage →
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" style={{ color: 'var(--gold)' }}>
                    Melde dich an
                  </Link>{' '}
                  um die erste Frage zu stellen.
                </>
              )}
            </p>
          </div>
        )}

        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/forum/${post.id}`}
            className="block px-5 py-4 rounded-xl transition-colors hover:bg-white/5"
            style={{
              background: 'var(--navy)',
              border: '1px solid var(--border)',
            }}
          >
            <h2 className="text-sm font-semibold mb-1.5" style={{ color: 'var(--white)' }}>
              {post.title}
            </h2>
            <p
              className="text-xs leading-relaxed mb-3 line-clamp-2"
              style={{ color: 'var(--muted)' }}
            >
              {post.body}
            </p>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--muted)' }}>
              <span>{displayName(post.user_display)}</span>
              <span style={{ color: 'var(--border-hover)' }}>·</span>
              <span>{formatDate(post.created_at)}</span>
              <span style={{ color: 'var(--border-hover)' }}>·</span>
              <span className="flex items-center gap-1">
                <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
                {post.comment_count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
