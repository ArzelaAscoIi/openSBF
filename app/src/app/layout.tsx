import type { Metadata, Viewport } from 'next';
import './globals.css';
import { NavBar } from '@/components/layout/NavBar';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'OpenSBF – Sportbootführerschein Lernplattform',
  description: 'Lerne für den SBF Binnen und SBF See – kostenlos, strukturiert und interaktiv.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'OpenSBF',
  },
};

export const viewport: Viewport = {
  themeColor: '#060C18',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
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
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
