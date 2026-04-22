import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeStreaks } from '@/lib/lectura/streakCalc'
import { SESSION_MIN_MINUTES } from '@/lib/lectura/readingConfig'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [sessions, latest] = await Promise.all([
      prisma.readingSession.findMany({
        where: {
          durationMins: { gte: SESSION_MIN_MINUTES },
          bookId: { not: null },
        },
        select: { startedAt: true, durationMins: true, bookId: true },
        orderBy: { startedAt: 'desc' },
        take: 2000,
      }),
      prisma.readingSession.findFirst({
        orderBy: { startedAt: 'desc' },
        select: { startedAt: true },
      }),
    ])

    const { current, longest, hasSessionToday } = computeStreaks(sessions)

    return NextResponse.json({
      current,
      longest,
      hasSessionToday,
      lastSessionAt: latest?.startedAt ?? null,
    })
  } catch (err) {
    console.error('[GET /api/lectura/sessions/streak]', err)
    return NextResponse.json(
      { error: 'Error al calcular la racha' },
      { status: 500 }
    )
  }
}
