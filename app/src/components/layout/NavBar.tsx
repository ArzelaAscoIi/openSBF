'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const STORAGE_KEY = 'opensbf_progress';

const navLinks = [
  { href: '/', label: 'Start' },
  { href: '/binnen', label: 'SBF Binnen' },
  { href: '/see', label: 'SBF See' },
  { href: '/lernen', label: 'Wissen' },
  { href: '/navigation', label: 'Navigation' },
];

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [msg, setMsg] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleExport() {
    const raw = localStorage.getItem(STORAGE_KEY) ?? '{}';
    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `opensbf-fortschritt-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        if (typeof imported !== 'object' || !imported.questions) throw new Error();

        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{"questions":{}}');
        const merged = { ...imported.questions };
        for (const [k, v] of Object.entries(current.questions ?? {})) {
          const imp = merged[k];
          const cur = v as { correctCount: number };
          merged[k] = imp
            ? { ...imp, correctCount: Math.max(imp.correctCount, cur.correctCount) }
            : cur;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...imported, questions: merged, lastUpdated: new Date().toISOString() }));

        setStatus('ok');
        setMsg(`Importiert — Seite neu laden?`);
      } catch {
        setStatus('err');
        setMsg('Ungültige Datei.');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => { setOpen((o) => !o); setStatus('idle'); }}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        style={{ color: 'var(--muted)' }}
        title="Fortschritt exportieren / importieren"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-xl py-2 z-50"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}
        >
          <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--white)' }}>Fortschritt</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Zwischen Geräten synchronisieren</p>
          </div>

          <div className="px-4 py-3 space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-left"
              style={{ color: 'var(--white)' }}
            >
              <span className="text-base leading-none">↓</span>
              Exportieren
            </button>

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5 text-left"
              style={{ color: 'var(--white)' }}
            >
              <span className="text-base leading-none">↑</span>
              Importieren
            </button>

            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

            {status !== 'idle' && (
              <div className="pt-1">
                <p className="text-xs px-3" style={{ color: status === 'ok' ? 'var(--green-signal)' : 'var(--red-signal)' }}>
                  {msg}
                  {status === 'ok' && (
                    <button onClick={() => window.location.reload()} className="ml-1 underline">
                      Laden
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(6, 12, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--border)',
      }}
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-bold shrink-0"
                  style={{
                    background: 'var(--gold-light)',
                    color: '#030810',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.10)',
                  }}
                >
                  ⚓
                </div>
                <span
                  className="text-base font-bold tracking-tight"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
                >
                  Open<span style={{ color: 'var(--gold-light)' }}>SBF</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors"
                      style={{
                        color: isActive ? 'var(--white)' : 'var(--muted)',
                        background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="flex items-center gap-1">
                {mounted && <UserMenu />}
                <Disclosure.Button
                  className="md:hidden p-1.5 rounded-md"
                  style={{ color: 'var(--muted)' }}
                >
                  {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="px-4 py-2 space-y-0.5">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Disclosure.Button
                    key={link.href}
                    as={Link}
                    href={link.href}
                    className="block px-3.5 py-2 rounded-md text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? 'var(--white)' : 'var(--muted)',
                      background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
