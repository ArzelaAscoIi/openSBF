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
        background: 'rgba(5, 14, 26, 0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(200, 169, 81, 0.2)',
      }}
    >
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-3 group">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                    color: 'var(--navy-deepest)',
                  }}
                >
                  ⚓
                </div>
                <span
                  className="text-xl font-bold tracking-wide"
                  style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold)' }}
                >
                  OpenSBF
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        color: isActive ? 'var(--gold)' : 'var(--muted)',
                        background: isActive ? 'rgba(200, 169, 81, 0.1)' : 'transparent',
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <Disclosure.Button className="md:hidden p-2 rounded-lg" style={{ color: 'var(--muted)' }}>
                {open ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden border-t" style={{ borderColor: 'rgba(200, 169, 81, 0.1)' }}>
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Disclosure.Button
                    key={link.href}
                    as={Link}
                    href={link.href}
                    className="block px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive ? 'var(--gold)' : 'var(--muted)',
                      background: isActive ? 'rgba(200, 169, 81, 0.1)' : 'transparent',
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
