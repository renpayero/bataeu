import webpush, { WebPushError } from 'web-push'
import type { PushSubscription } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { configureVapid } from './vapid'

export type PushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
}

export type SendResult = {
  attempted: number
  sent: number
  removed: number
  failed: number
  errors: { endpoint: string; status: number | null; message: string }[]
}

const MAX_FAILURES_BEFORE_PRUNE = 5

/**
 * Envía un payload de push a una lista de subscriptions.
 *
 * Maneja automáticamente:
 *  - 404 / 410 (subscription expirada): elimina de DB
 *  - Otros errores: incrementa failureCount; tras MAX_FAILURES_BEFORE_PRUNE elimina
 *  - Éxito: actualiza lastSeenAt y resetea failureCount
 */
export async function sendPushTo(
  subs: PushSubscription[],
  payload: PushPayload,
): Promise<SendResult> {
  configureVapid()

  const result: SendResult = {
    attempted: subs.length,
    sent: 0,
    removed: 0,
    failed: 0,
    errors: [],
  }

  if (subs.length === 0) return result

  const json = JSON.stringify(payload)

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          json,
          { TTL: 60 * 60 * 24 }, // 24h: si el celular está apagado, se entrega cuando vuelva
        )
        result.sent++
        await prisma.pushSubscription
          .update({
            where: { id: sub.id },
            data: { lastSeenAt: new Date(), failureCount: 0 },
          })
          .catch(() => {})
      } catch (err) {
        const status = err instanceof WebPushError ? err.statusCode : null
        const message = err instanceof Error ? err.message : String(err)

        if (status === 404 || status === 410) {
          // subscription gone — remove forever
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
          result.removed++
        } else {
          result.failed++
          result.errors.push({ endpoint: sub.endpoint.slice(0, 80), status, message })
          // bump failureCount; prune if it exceeds threshold
          await prisma.pushSubscription
            .update({
              where: { id: sub.id },
              data: { failureCount: { increment: 1 } },
            })
            .then(async (updated) => {
              if (updated.failureCount >= MAX_FAILURES_BEFORE_PRUNE) {
                await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
                result.removed++
                result.failed--
              }
            })
            .catch(() => {})
        }
      }
    }),
  )

  return result
}

/**
 * Devuelve subscriptions que deben recibir un mensaje dirigido a `audience`.
 *
 *  - audience === 'novia' → subs con userLabel='novia' OR userLabel=null
 *  - audience === 'renzo' → subs con userLabel='renzo' OR userLabel=null
 *  - audience === null → todas
 */
export async function getSubscriptionsFor(audience: string | null): Promise<PushSubscription[]> {
  if (audience === null) {
    return prisma.pushSubscription.findMany()
  }
  return prisma.pushSubscription.findMany({
    where: { OR: [{ userLabel: audience }, { userLabel: null }] },
  })
}
