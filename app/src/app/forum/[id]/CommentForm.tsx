'use client';

import { useRef, useTransition } from 'react';
import Link from 'next/link';
import { createComment } from '../actions';

type Props = {
  postId: string;
  userEmail: string | null;
};

export function CommentForm({ postId, userEmail }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  if (!userEmail) {
    return (
      <p className="text-sm py-4" style={{ color: 'var(--muted)' }}>
        <Link href="/auth/login" style={{ color: 'var(--gold)' }}>
          Anmelden
        </Link>{' '}
        um einen Kommentar zu schreiben.
      </p>
    );
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createComment(formData);
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">
      <input type="hidden" name="post_id" value={postId} />
      <textarea
        name="body"
        required
        rows={3}
        placeholder="Dein Kommentar…"
        className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none transition-colors focus:ring-1"
        style={{
          background: 'var(--navy)',
          border: '1px solid var(--border)',
          color: 'var(--white)',
          caretColor: 'var(--gold)',
        }}
      />
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
        >
          {isPending ? 'Wird gesendet…' : 'Kommentar senden'}
        </button>
      </div>
    </form>
  );
}
