// Helpers para suscribir/desuscribir desde el browser.

function urlBase64ToBuffer(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const buffer = new ArrayBuffer(raw.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < raw.length; i++) view[i] = raw.charCodeAt(i)
  return buffer
}

export type PushSupport =
  | { ok: true; reason?: never }
  | { ok: false; reason: 'no-window' | 'no-sw' | 'no-push' | 'no-notification' | 'ios-not-installed' }

export function checkPushSupport(): PushSupport {
  if (typeof window === 'undefined') return { ok: false, reason: 'no-window' }
  if (!('serviceWorker' in navigator)) return { ok: false, reason: 'no-sw' }
  if (!('PushManager' in window)) return { ok: false, reason: 'no-push' }
  if (!('Notification' in window)) return { ok: false, reason: 'no-notification' }

  // iOS solo soporta web push si la PWA fue instalada al home screen (display-mode: standalone).
  const ua = navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream
  if (isIos) {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    if (!standalone) return { ok: false, reason: 'ios-not-installed' }
  }

  return { ok: true }
}

async function fetchPublicKey(): Promise<string> {
  const res = await fetch('/api/push/vapid-public-key', { cache: 'no-store' })
  if (!res.ok) throw new Error('VAPID public key unavailable')
  const data = (await res.json()) as { publicKey: string }
  return data.publicKey
}

export async function subscribePush(label: string): Promise<PushSubscription> {
  const reg = await navigator.serviceWorker.ready
  let sub = await reg.pushManager.getSubscription()
  if (!sub) {
    const publicKey = await fetchPublicKey()
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToBuffer(publicKey),
    })
  }

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON(), userLabel: label }),
  })
  if (!res.ok) {
    throw new Error(`subscribe failed: ${res.status}`)
  }
  return sub
}

export async function unsubscribePush(): Promise<void> {
  const reg = await navigator.serviceWorker.ready
  const sub = await reg.pushManager.getSubscription()
  if (!sub) return
  await fetch('/api/push/subscribe', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: sub.endpoint }),
  }).catch(() => {})
  await sub.unsubscribe().catch(() => {})
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) return null
    return await reg.pushManager.getSubscription()
  } catch {
    return null
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return await Notification.requestPermission()
}
