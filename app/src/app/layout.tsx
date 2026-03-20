import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/layout/NavBar';

export const metadata: Metadata = {
  title: 'OpenSBF – Sportbootführerschein Lernplattform',
  description: 'Lerne für den SBF Binnen und SBF See – kostenlos, strukturiert und interaktiv.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
