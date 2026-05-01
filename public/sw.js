// Hormonitas Service Worker — mínimo. Solo existe para que el celular
// reconozca la app como "instalable" y para recibir push notifications.
// No intentamos offline real (el user no lo pidió).

const CACHE = 'hormonitas-shell-v2'

// Paths que el SW NO debe interceptar (los maneja el browser directo).
// Esto evita que las fotos/videos del cinematic counter, los assets de Next,
// y los uploads de la galería sufran race conditions con el cache del SW.
function shouldBypass(url) {
  const p = url.pathname
  return (
    p.startsWith('/memories/') ||
    p.startsWith('/audio/') ||
    p.startsWith('/galeria/') ||
    p.startsWith('/_next/') ||
    p.startsWith('/icon-') ||
    p === '/icon.svg' ||
    p === '/apple-icon' ||
    p === '/manifest.webmanifest' ||
    p.startsWith('/api/')
  )
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.add(new Request('/', { cache: 'reload' })))
      .catch(() => {})
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      ),
    ])
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  let url
  try {
    url = new URL(req.url)
  } catch {
    return
  }

  if (url.origin !== self.location.origin) return
  if (shouldBypass(url)) return // browser handles natively

  // Solo intercepta navegaciones a páginas HTML.
  // Estrategia: network-first, fallback a cache de '/' si no hay red.
  event.respondWith(
    fetch(req).catch(() =>
      caches.match(req).then((cached) => cached || caches.match('/'))
    )
  )
})

// ─── Push notifications ──────────────────────────────────
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch (_) {}

  const title = data.title || 'Hormonitas'
  const options = {
    body: data.body || '',
    icon: '/icon-192',
    badge: '/icon-192',
    tag: data.tag || 'hormonitas',
    data: { url: data.url || '/' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(url))
      if (existing) return existing.focus()
      return self.clients.openWindow(url)
    })
  )
})
