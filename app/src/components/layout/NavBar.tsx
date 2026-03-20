'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { href: '/', label: 'Start' },
  { href: '/binnen', label: 'SBF Binnen' },
  { href: '/see', label: 'SBF See' },
  { href: '/lernen', label: 'Wissen' },
];

export function NavBar() {
  const pathname = usePathname();

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
                  className="w-7 h-7 rounded flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'var(--gold)',
                    color: 'var(--navy-deepest)',
                  }}
                >
                  ⚓
                </div>
                <span
                  className="text-base font-bold tracking-tight"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--white)' }}
                >
                  OpenSBF
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-0.5">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
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

              <Disclosure.Button
                className="md:hidden p-1.5 rounded-md"
                style={{ color: 'var(--muted)' }}
              >
                {open ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel
            className="md:hidden border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="px-4 py-2 space-y-0.5">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
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
