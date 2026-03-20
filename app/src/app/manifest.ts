import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OpenSBF – Sportbootführerschein',
    short_name: 'OpenSBF',
    description: 'Open Source Community Projekt zur Prüfungsvorbereitung für den Sportbootführerschein Binnen & See',
    start_url: '/',
    display: 'standalone',
    background_color: '#060C18',
    theme_color: '#060C18',
    orientation: 'portrait-primary',
    categories: ['education'],
    lang: 'de',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'SBF Binnen üben',
        url: '/binnen',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'SBF See üben',
        url: '/see',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
