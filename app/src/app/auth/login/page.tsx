'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }

    setStatus('sent');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
      >
        <div className="mb-8 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: 'var(--gold-light)', color: '#030810' }}
          >
            ⚓
          </div>
          <h1
            className="text-xl font-bold"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            Anmelden
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Fortschritt über Geräte synchronisieren
          </p>
        </div>

        {status === 'sent' ? (
          <div className="text-center space-y-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto"
              style={{ background: 'rgba(18, 184, 112, 0.15)' }}
            >
              ✉
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
              Magic Link versendet!
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Schau in deinem Posteingang nach einer E-Mail von OpenSBF und klicke auf den Link.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="text-xs underline"
              style={{ color: 'var(--muted)' }}
            >
              Andere E-Mail verwenden
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--muted)' }}
              >
                E-Mail-Adresse
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
                style={{
                  background: 'var(--navy-deep)',
                  border: '1px solid var(--border-hover)',
                  color: 'var(--white)',
                }}
              />
            </div>

            {status === 'error' && (
              <p className="text-xs" style={{ color: 'var(--red-signal)' }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ background: 'var(--gold)', color: 'var(--navy-deepest)' }}
            >
              {status === 'loading' ? 'Wird gesendet…' : 'Magic Link senden'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Kein Passwort nötig — wir senden dir einen Link per E-Mail.
            </p>
          </form>
        )}

        <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link
            href="/"
            className="block text-center text-xs transition-opacity hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
