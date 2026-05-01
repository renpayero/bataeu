import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  buildCycleNotification,
  buildSpecialDateNotifications,
  buildAutoMilestoneNotifications,
  type ScheduledNotification,
} from '@/lib/push/messages'
import { COUPLE_START_DATE } from '@/lib/coupleConfig'
import { getSubscriptionsFor, sendPushTo, type SendResult } from '@/lib/push/sender'

export const dynamic = 'force-dynamic'

/**
 * Endpoint del cron diario. Calcula las notifs del día y las dispatchea.
 *
 * Protección: header `Authorization: Bearer ${PUSH_ADMIN_SECRET}`.
 *
 * Para correr en VPS, agregar al crontab:
 *   0 9 * * * curl -fsS -X POST https://TU_DOMINIO/api/push/cron \
 *     -H "Authorization: Bearer $PUSH_ADMIN_SECRET" >> /var/log/hormonitas-cron.log 2>&1
 *
 * Es idempotente: si se ejecuta dos veces el mismo día, manda dos notifs idénticas
 * (con mismo `tag`, los browsers replazan la anterior). No duplica conceptualmente.
 */

type DispatchSummary = {
  tag: string
  audience: string | null
  result: SendResult
}

export async function POST(req: NextRequest) {
  const secret = process.env.PUSH_ADMIN_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'PUSH_ADMIN_SECRET not configured' }, { status: 500 })
  }
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()

  // Cargar datos en paralelo
  const [cycleEntry, specialDates] = await Promise.all([
    prisma.cycleEntry.findFirst({ orderBy: { startDate: 'desc' } }),
    prisma.specialDate.findMany(),
  ])

  // Construir lista de notifs
  const notifications: ScheduledNotification[] = []
  const cycleNotif = buildCycleNotification(cycleEntry, today)
  if (cycleNotif) notifications.push(cycleNotif)
  notifications.push(...buildSpecialDateNotifications(specialDates, today))
  notifications.push(...buildAutoMilestoneNotifications(COUPLE_START_DATE, today))

  // Despachar
  const summary: DispatchSummary[] = []
  for (const notif of notifications) {
    const subs = await getSubscriptionsFor(notif.audience)
    const result = await sendPushTo(subs, notif.payload)
    summary.push({ tag: notif.payload.tag ?? '<no-tag>', audience: notif.audience, result })
  }

  return NextResponse.json({
    ranAt: today.toISOString(),
    notificationsBuilt: notifications.length,
    dispatch: summary,
  })
}

// GET solo para healthcheck/inspección — devuelve qué se enviaría sin enviarlo.
export async function GET(req: NextRequest) {
  const secret = process.env.PUSH_ADMIN_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'PUSH_ADMIN_SECRET not configured' }, { status: 500 })
  }
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const [cycleEntry, specialDates] = await Promise.all([
    prisma.cycleEntry.findFirst({ orderBy: { startDate: 'desc' } }),
    prisma.specialDate.findMany(),
  ])

  const notifications: ScheduledNotification[] = []
  const cycleNotif = buildCycleNotification(cycleEntry, today)
  if (cycleNotif) notifications.push(cycleNotif)
  notifications.push(...buildSpecialDateNotifications(specialDates, today))
  notifications.push(...buildAutoMilestoneNotifications(COUPLE_START_DATE, today))

  const subsCount = await prisma.pushSubscription.count()

  return NextResponse.json({
    ranAt: today.toISOString(),
    dryRun: true,
    activeSubscriptions: subsCount,
    notifications,
  })
}
