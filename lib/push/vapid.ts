import webpush from 'web-push'

let configured = false

export function getVapidPublicKey(): string {
  const k = process.env.VAPID_PUBLIC_KEY
  if (!k) throw new Error('VAPID_PUBLIC_KEY env var missing')
  return k
}

export function configureVapid(): void {
  if (configured) return
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || 'mailto:noreply@hormonitas.local'
  if (!publicKey || !privateKey) {
    throw new Error('VAPID keys missing — set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY')
  }
  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
}
