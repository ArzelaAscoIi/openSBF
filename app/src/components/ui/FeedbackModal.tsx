'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type FeedbackType = 'bug' | 'suggestion' | 'other';

const TYPES: { value: FeedbackType; label: string; emoji: string }[] = [
  { value: 'bug', label: 'Fehler', emoji: '🐛' },
  { value: 'suggestion', label: 'Vorschlag', emoji: '💡' },
  { value: 'other', label: 'Sonstiges', emoji: '💬' },
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  function reset() {
    setType('bug');
    setMessage('');
    setEmail('');
    setStatus('idle');
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('loading');

    const supabase = createClient();
    const page = typeof window !== 'undefined' ? window.location.pathname : null;

    const { error } = await supabase.from('feedback').insert({
      type,
      message: message.trim(),
      email: email.trim() || null,
      page,
    });

    if (error) {
      setStatus('error');
      return;
    }

    setStatus('success');
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hover:underline transition-colors"
        style={{ color: 'var(--seafoam-light)', background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
      >
        Feedback geben
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(6, 12, 24, 0.75)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div
            className="w-full max-w-md rounded-xl p-6"
            style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold" style={{ color: 'var(--white)' }}>
                Feedback
              </h2>
              <button
                onClick={handleClose}
                className="text-xl leading-none transition-opacity hover:opacity-60"
                style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                aria-label="Schließen"
              >
                ×
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-8 text-center">
                <p className="text-3xl mb-3">🙏</p>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--white)' }}>
                  Vielen Dank!
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Dein Feedback wurde übermittelt.
                </p>
                <button
                  onClick={handleClose}
                  className="mt-5 px-5 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
                >
                  Schließen
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex gap-2 mb-5">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setType(t.value)}
                      className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: type === t.value ? 'rgba(188,147,50,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${type === t.value ? 'rgba(188,147,50,0.4)' : 'var(--border)'}`,
                        color: type === t.value ? 'var(--gold)' : 'var(--muted)',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{t.emoji}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === 'bug'
                      ? 'Was ist passiert? Was hast du erwartet?'
                      : type === 'suggestion'
                        ? 'Was könnte verbessert werden?'
                        : 'Deine Nachricht…'
                  }
                  rows={4}
                  className="w-full rounded-lg px-3 py-2.5 text-sm resize-none mb-3 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--white)',
                  }}
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-Mail (optional, für Rückfragen)"
                  className="w-full rounded-lg px-3 py-2.5 text-sm mb-4 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--white)',
                  }}
                />

                {status === 'error' && (
                  <p className="text-xs mb-3" style={{ color: '#f87171' }}>
                    Fehler beim Senden. Bitte versuche es erneut.
                  </p>
                )}

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-70"
                    style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading' || !message.trim()}
                    className="px-5 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: 'var(--gold)', color: 'var(--navy-deepest)', cursor: status === 'loading' ? 'wait' : 'pointer' }}
                  >
                    {status === 'loading' ? 'Senden…' : 'Senden'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
