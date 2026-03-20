'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const UserMenu = dynamic(() => import('./UserMenu'), { ssr: false });

const navLinks = [
  { href: '/', label: 'Start' },
  { href: '/binnen', label: 'SBF Binnen' },
  { href: '/see', label: 'SBF See' },
  { href: '/lernen', label: 'Wissen' },
  { href: '/navigation', label: 'Navigation' },
];

export function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(6, 12, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--border)',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
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
            <button
              className="md:hidden p-1.5 rounded-md"
              style={{ color: 'var(--muted)' }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Navigation öffnen"
            >
              {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
            <UserMenu />
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-2 space-y-0.5">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3.5 py-2 rounded-md text-sm font-medium transition-colors"
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
        </div>
      )}
    </nav>
  );
}
