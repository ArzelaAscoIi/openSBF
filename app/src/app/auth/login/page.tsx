'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Mode = 'signin' | 'signup';
type Status = 'idle' | 'loading' | 'error' | 'confirm';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const supabase = createClient();

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setStatus('error');
        setErrorMsg(error.message);
        return;
      }
      router.push('/');
      router.refresh();
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    setStatus('confirm');
  }

  if (status === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="w-full max-w-sm rounded-2xl p-8 text-center space-y-4"
          style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto"
            style={{ background: 'rgba(18, 184, 112, 0.15)' }}
          >
            ✉
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--white)' }}>
            Bestätigungsmail versendet
          </p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            Schau in deinem Posteingang nach einer Bestätigungsmail und klicke auf den Link.
          </p>
          <button
            onClick={() => { setStatus('idle'); setMode('signin'); }}
            className="text-xs underline"
            style={{ color: 'var(--muted)' }}
          >
            Zurück zur Anmeldung
          </button>
        </div>
      </div>
    );
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
            {mode === 'signin' ? 'Anmelden' : 'Registrieren'}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Fortschritt über Geräte synchronisieren
          </p>
        </div>

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
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--navy-deep)',
                border: '1px solid var(--border-hover)',
                color: 'var(--white)',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--muted)' }}
            >
              Passwort
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
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
            {status === 'loading'
              ? 'Bitte warten…'
              : mode === 'signin'
                ? 'Anmelden'
                : 'Konto erstellen'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
            {mode === 'signin' ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrorMsg(''); setStatus('idle'); }}
              className="underline"
              style={{ color: 'var(--white)' }}
            >
              {mode === 'signin' ? 'Registrieren' : 'Anmelden'}
            </button>
          </p>
        </form>

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
