import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPushTo } from '@/lib/push/sender'
import { COUPLE_NICKNAMES } from '@/lib/coupleConfig'

export const dynamic = 'force-dynamic'

type WelcomeBody = { endpoint?: string }

function welcomeFor(label: string | null): { title: string; body: string } {
  if (label === COUPLE_NICKNAMES.name2) {
    return {
      title: `Hola ${COUPLE_NICKNAMES.name2} 💌`,
      body: 'Sé que tenés buena memoria, pero a partir de ahora te van a estar llegando recordatorios igual.',
    }
  }
  if (label === COUPLE_NICKNAMES.name1) {
    return {
      title: `Eh, ${COUPLE_NICKNAMES.name1} 🙃`,
      body: '¿Tenés una memoria de mierda? Ahora te van a estar llegando notificaciones 😊',
    }
  }
  return {
    title: '🔔 Notificaciones activadas',
    body: 'Listo. Te avisamos cuando haga falta.',
  }
}

export async function POST(req: NextRequest) {
  let body: WelcomeBody
  try {
    body = (await req.json()) as WelcomeBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const endpoint = body?.endpoint
  if (typeof endpoint !== 'string' || endpoint.length === 0) {
    return NextResponse.json({ error: 'endpoint required' }, { status: 400 })
  }

  const sub = await prisma.pushSubscription.findUnique({ where: { endpoint } })
  if (!sub) {
    return NextResponse.json({ error: 'subscription not found' }, { status: 404 })
  }

  const payload = welcomeFor(sub.userLabel)
  const result = await sendPushTo([sub], {
    ...payload,
    url: '/',
    tag: `welcome-${Date.now()}`,
  })

  return NextResponse.json({ ok: true, sent: result.sent })
}
