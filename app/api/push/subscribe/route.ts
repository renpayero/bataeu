import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { COUPLE_NICKNAMES } from '@/lib/coupleConfig'

export const dynamic = 'force-dynamic'

type SubscribeBody = {
  subscription: {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }
  userLabel?: string | null
}

const ALLOWED_LABELS = new Set([COUPLE_NICKNAMES.name1, COUPLE_NICKNAMES.name2])

function normalizeLabel(label: unknown): string | null {
  if (typeof label !== 'string') return null
  const trimmed = label.trim()
  return ALLOWED_LABELS.has(trimmed) ? trimmed : null
}

export async function POST(req: NextRequest) {
  let body: SubscribeBody
  try {
    body = (await req.json()) as SubscribeBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const sub = body?.subscription
  if (
    !sub ||
    typeof sub.endpoint !== 'string' ||
    !sub.keys ||
    typeof sub.keys.p256dh !== 'string' ||
    typeof sub.keys.auth !== 'string'
  ) {
    return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 })
  }

  const userAgent = req.headers.get('user-agent')?.slice(0, 250) ?? null
  const userLabel = normalizeLabel(body.userLabel)

  // Upsert por endpoint (único). Si ya existe, refrescamos keys/label/timestamp.
  const saved = await prisma.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    create: {
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      userLabel,
      userAgent,
    },
    update: {
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      userLabel,
      userAgent,
      lastSeenAt: new Date(),
      failureCount: 0,
    },
  })

  return NextResponse.json({ ok: true, id: saved.id, userLabel: saved.userLabel })
}

export async function DELETE(req: NextRequest) {
  let body: { endpoint?: string }
  try {
    body = (await req.json()) as { endpoint?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const endpoint = body?.endpoint
  if (typeof endpoint !== 'string' || endpoint.length === 0) {
    return NextResponse.json({ error: 'endpoint required' }, { status: 400 })
  }

  await prisma.pushSubscription.deleteMany({ where: { endpoint } })
  return NextResponse.json({ ok: true })
}
