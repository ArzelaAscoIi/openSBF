'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GoogleIcon } from '@/components/ui/GoogleIcon';

type AuthStatus = 'idle' | 'loading' | 'sent' | 'error';

interface AuthFormProps {
  onSent?: () => void;
}

export function AuthForm({ onSent }: AuthFormProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleGoogleSignIn(): Promise<void> {
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
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
    onSent?.();
  }

  if (status === 'sent') {
    return (
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
    );
  }

  return (
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
        <div>
          <label
            htmlFor="auth-email"
            className="block text-xs font-medium mb-1.5"
            style={{ color: 'var(--muted)' }}
          >
            E-Mail-Adresse
          </label>
          <input
            id="auth-email"
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

        <p className="text-xs text-center" style={{ color: 'var(--muted)' }}>
          Kostenlos · Kein Passwort nötig
        </p>
      </form>
    </div>
  );
}
