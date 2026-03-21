import type { Metadata, Viewport } from 'next';
import './globals.css';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';
import { FeedbackModal } from '@/components/ui/FeedbackModal';

export const metadata: Metadata = {
  title: 'OpenSBF – Sportbootführerschein Lernplattform',
  description: 'Lerne für den SBF Binnen und SBF See – kostenlos, strukturiert und interaktiv.',
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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen" style={{ background: 'var(--navy-deep)' }}>
        <NavBar />
        <main>{children}</main>
        <Footer />
        <ServiceWorkerRegistration />
        <div className="fixed bottom-6 right-4 z-40">
          <FeedbackModal
            trigger={
              <button
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy-deepest)',
                  boxShadow: '0 4px 24px rgba(188,147,50,0.35)',
                }}
              >
                <span>💬</span>
                Feedback
              </button>
            }
          />
        </div>
      </body>
    </html>
  );
}
