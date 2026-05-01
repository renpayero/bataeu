// Helper para disparar push notifications desde routes (fire-and-forget).
// No bloquea la response del endpoint si falla el push.

import type { PushPayload } from './sender'
import { getSubscriptionsFor, sendPushTo } from './sender'

export function firePush(audience: string | null, payload: PushPayload): void {
  ;(async () => {
    try {
      const subs = await getSubscriptionsFor(audience)
      if (subs.length === 0) return
      await sendPushTo(subs, payload)
    } catch (err) {
      console.error('[push:trigger]', err)
    }
  })()
}
