import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createPost } from '../actions';

export const metadata = {
  title: 'Neue Frage – OpenSBF Forum',
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
      <div className="border-b px-4 py-10" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-2xl mx-auto">
          <Link
            href="/forum"
            className="text-xs font-medium mb-6 inline-block transition-opacity hover:opacity-70"
            style={{ color: 'var(--muted)' }}
          >
            ← Forum
          </Link>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            Frage stellen
          </h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Stell eine Frage an die Community
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form action={createPost} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              Titel
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="Kurze, präzise Zusammenfassung deiner Frage"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors focus:ring-1"
              style={{
                background: 'var(--navy)',
                border: '1px solid var(--border)',
                color: 'var(--white)',
                caretColor: 'var(--gold)',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="body"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              Beschreibung
            </label>
            <textarea
              id="body"
              name="body"
              required
              rows={6}
              placeholder="Beschreibe deine Frage so genau wie möglich…"
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none focus:ring-1"
              style={{
                background: 'var(--navy)',
                border: '1px solid var(--border)',
                color: 'var(--white)',
                caretColor: 'var(--gold)',
              }}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/forum"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              style={{ color: 'var(--muted)' }}
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
            >
              Veröffentlichen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
