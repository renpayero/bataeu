import { NextResponse, type NextRequest } from 'next/server'
import { getSubscriptionsFor, sendPushTo } from '@/lib/push/sender'

export const dynamic = 'force-dynamic'

/**
 * Endpoint protegido por env var PUSH_ADMIN_SECRET.
 * Manda una notificación de prueba a una audiencia.
 *
 * curl -X POST http://localhost:3000/api/push/test \
 *   -H "Authorization: Bearer $PUSH_ADMIN_SECRET" \
 *   -H "Content-Type: application/json" \
 *   -d '{"audience": null, "title": "Prueba", "body": "Hola desde Hormonitas"}'
 */

type TestBody = {
  audience?: 'novia' | 'renzo' | null
  title?: string
  body?: string
  url?: string
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

  let payload: TestBody
  try {
    payload = (await req.json()) as TestBody
  } catch {
    payload = {}
  }

  const audience = payload.audience ?? null
  const subs = await getSubscriptionsFor(audience)

  const result = await sendPushTo(subs, {
    title: payload.title ?? '🧪 Prueba',
    body: payload.body ?? 'Si ves esto, las notificaciones funcionan ✓',
    url: payload.url ?? '/',
    tag: `test-${Date.now()}`,
  })

  return NextResponse.json(result)
}
