'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface LoginPromptModalProps {
  questionsAnswered: number;
}

type Status = 'idle' | 'loading' | 'sent' | 'error';

export function LoginPromptModal({ questionsAnswered }: LoginPromptModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setErrorMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setErrorMsg(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
      return;
    }
    setStatus('sent');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(3, 8, 16, 0.85)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: 'var(--navy)', border: '1px solid var(--border)' }}
      >
        <div className="mb-6 text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: 'var(--gold-light)', color: '#030810' }}
          >
            ⚓
          </div>
          <h2
            className="text-xl font-bold mb-1"
            style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
          >
            Weiter lernen
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            Du hast {questionsAnswered} Fragen beantwortet. Erstelle ein kostenloses Konto,
            um deinen Fortschritt zu speichern und alle Themen freizuschalten.
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
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{
                background: 'var(--white)',
                color: '#1f1f1f',
                border: '1px solid var(--border)',
              }}
            >
              <GoogleIcon />
              {googleLoading ? 'Weiterleitung…' : 'Mit Google anmelden'}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs" style={{ color: 'var(--muted)' }}>oder</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
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

              {errorMsg && (
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
            </form>

            <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
              Kostenlos · Kein Passwort nötig
            </p>
          </div>
        )}

        <div className="mt-5 pt-4 border-t text-center" style={{ borderColor: 'var(--border)' }}>
          <Link
            href="/"
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: 'var(--muted)' }}
          >
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}
