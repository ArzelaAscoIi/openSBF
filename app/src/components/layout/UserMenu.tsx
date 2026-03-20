'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { loadProgress, saveProgress } from '@/lib/progress';
import { syncProgressWithCloud } from '@/lib/supabase/progress';

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export default function UserMenu() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Auto-sync on login
  useEffect(() => {
    if (!user) return;
    handleSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleSync() {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const supabase = createClient();
      const local = loadProgress();
      const merged = await syncProgressWithCloud(supabase, user.id, local);
      saveProgress(merged);
      setSyncStatus('synced');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch {
      setSyncStatus('error');
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => { setOpen((o) => !o); }}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        style={{ color: user ? 'var(--gold-light)' : 'var(--muted)' }}
        title={user ? `Angemeldet als ${user.email}` : 'Anmelden'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </button>

      {open && !loading && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-xl py-2 z-50"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}
        >
          {user ? (
            <>
              <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--white)' }}>
                  {user.email}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Fortschritt wird automatisch gespeichert
                </p>
              </div>

              <div className="px-4 py-3 space-y-1">
                <button
                  onClick={handleSync}
                  disabled={syncStatus === 'syncing'}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-left disabled:opacity-50"
                  style={{ color: 'var(--white)' }}
                >
                  <span className="text-base leading-none">
                    {syncStatus === 'syncing' ? '⟳' : syncStatus === 'synced' ? '✓' : '↕'}
                  </span>
                  {syncStatus === 'syncing'
                    ? 'Synchronisiere…'
                    : syncStatus === 'synced'
                      ? 'Synchronisiert'
                      : syncStatus === 'error'
                        ? 'Fehler – erneut versuchen'
                        : 'Mit Cloud synchronisieren'}
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-left"
                  style={{ color: 'var(--muted)' }}
                >
                  <span className="text-base leading-none">→</span>
                  Abmelden
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-semibold" style={{ color: 'var(--white)' }}>Fortschritt</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                  Anmelden für geräteübergreifende Synchronisierung
                </p>
              </div>

              <div className="px-4 py-3 space-y-1">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ color: 'var(--gold-light)' }}
                >
                  <span className="text-base leading-none">⚓</span>
                  Anmelden / Registrieren
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
