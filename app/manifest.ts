import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Bata Eu',
    short_name: 'Bata Eu',
    description: 'Nuestra cápsula',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fff1f2',
    theme_color: '#f43f5e',
    lang: 'es',
    categories: ['lifestyle'],
    icons: [
      { src: '/icon-192', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512', sizes: '512x512', type: 'image/png' },
      {
        src: '/icon-512-maskable',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Ciclo',
        short_name: 'Ciclo',
        description: 'Calendario y fase actual',
        url: '/ciclo',
        icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Antojos',
        short_name: 'Antojos',
        description: 'Antojos del momento',
        url: '/antojos',
        icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Galería',
        short_name: 'Galería',
        description: 'Nuestros recuerdos',
        url: '/galeria',
        icons: [{ src: '/icon-192', sizes: '192x192', type: 'image/png' }],
      },
    ],
    // TODO: agregar screenshots tras el primer deploy real (1080×1920 mobile + 1920×1080 desktop)
    // para habilitar Richer Install UI.
  }
}
