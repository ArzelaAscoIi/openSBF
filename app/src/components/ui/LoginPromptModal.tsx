'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';

interface LoginPromptModalProps {
  questionsAnswered: number;
}

export function LoginPromptModal({ questionsAnswered }: LoginPromptModalProps): React.ReactElement {
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

        <AuthForm />

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
