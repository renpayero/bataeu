import { NextResponse } from 'next/server'
import { getVapidPublicKey } from '@/lib/push/vapid'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json({ publicKey: getVapidPublicKey() })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'VAPID misconfigured' },
      { status: 500 },
    )
  }
}
