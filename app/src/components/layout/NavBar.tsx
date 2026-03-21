'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const UserMenu = dynamic(() => import('./UserMenu'), { ssr: false });

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
  activePrefixes: string[];
};

const navGroups: NavGroup[] = [
  {
    label: 'Lernen',
    activePrefixes: ['/lernen'],
    items: [
      {
        href: '/lernen',
        label: 'Theorie & Wissen',
        description: 'Artikel zu Lichtern, Seezeichen, Ausweichregeln u.v.m.',
        icon: '📖',
      },
    ],
  },
  {
    label: 'Üben',
    activePrefixes: ['/binnen', '/see', '/ueben', '/navigation'],
    items: [
      {
        href: '/binnen',
        label: 'SBF Binnen',
        description: 'Alle Prüfungsfragen für den Führerschein Binnen',
        icon: '🚢',
      },
      {
        href: '/see',
        label: 'SBF See',
        description: 'Alle Prüfungsfragen für den Führerschein See',
        icon: '⛵',
      },
      {
        href: '/navigation',
        label: 'Navigation',
        description: 'Kursberechnung, Kompass & Prüfungsaufgaben',
        icon: '🧭',
      },
    ],
  },
];

function DesktopDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isGroupActive = group.activePrefixes.some((p) => pathname.startsWith(p));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors"
        style={{
          color: isGroupActive ? 'var(--white)' : 'var(--muted)',
          background: isGroupActive ? 'rgba(255,255,255,0.07)' : 'transparent',
        }}
      >
        {group.label}
        <ChevronDownIcon
          className="h-3.5 w-3.5 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1.5 min-w-64 rounded-xl py-1.5 z-50"
          style={{
            background: 'var(--navy)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}
        >
          {group.items.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 mx-1.5 px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                }}
              >
                <span className="text-lg leading-none mt-0.5 shrink-0">{item.icon}</span>
                <span>
                  <span
                    className="block text-sm font-medium"
                    style={{ color: isActive ? 'var(--gold-light)' : 'var(--white)' }}
                  >
                    {item.label}
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

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
            {navGroups.map((group) => (
              <DesktopDropdown key={group.label} group={group} pathname={pathname} />
            ))}
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
            {navGroups.map((group) => {
              const isGroupActive = group.activePrefixes.some((p) => pathname.startsWith(p));
              const isExpanded = mobileExpanded === group.label;

              return (
                <div key={group.label}>
                  <button
                    onClick={() => setMobileExpanded(isExpanded ? null : group.label)}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-md text-sm font-semibold transition-colors"
                    style={{
                      color: isGroupActive ? 'var(--white)' : 'var(--muted)',
                      background: isGroupActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                    }}
                  >
                    {group.label}
                    <ChevronDownIcon
                      className="h-3.5 w-3.5 transition-transform"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {isExpanded && (
                    <div className="ml-3 mt-0.5 space-y-0.5 pb-1">
                      {group.items.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setMobileExpanded(null);
                            }}
                            className="flex items-center gap-2.5 px-3.5 py-2 rounded-md text-sm font-medium transition-colors"
                            style={{
                              color: isActive ? 'var(--gold-light)' : 'var(--muted)',
                              background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                            }}
                          >
                            <span className="text-base leading-none">{item.icon}</span>
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
