'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

export default function LoginPage(): React.ReactElement {
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

        <AuthForm />

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
