import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OpenSBF – Sportbootführerschein',
    short_name: 'OpenSBF',
    description: 'Lerne für den SBF Binnen und SBF See – kostenlos, strukturiert und interaktiv.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#060C18',
    theme_color: '#060C18',
    categories: ['education'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
