import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeStreaks, toDayKey } from '@/lib/lectura/streakCalc'
import { SESSION_MIN_MINUTES } from '@/lib/lectura/readingConfig'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [sessionsForStreak, recentAll, latest, booksReadCount] =
      await Promise.all([
        prisma.readingSession.findMany({
          where: {
            durationMins: { gte: SESSION_MIN_MINUTES },
            bookId: { not: null },
          },
          select: { startedAt: true, durationMins: true, bookId: true },
          orderBy: { startedAt: 'desc' },
          take: 2000,
        }),
        prisma.readingSession.findMany({
          select: { startedAt: true, durationMins: true, bookId: true },
          orderBy: { startedAt: 'desc' },
          take: 5000,
        }),
        prisma.readingSession.findFirst({
          orderBy: { startedAt: 'desc' },
          select: { startedAt: true },
        }),
        // libros terminados con al menos 1 sesión
        prisma.book.count({
          where: {
            status: 'terminado',
            sessions: { some: {} },
          },
        }),
      ])

    const { current, longest } = computeStreaks(sessionsForStreak)

    const todayKey = toDayKey(new Date())
    // Últimos 7 días (incluyendo hoy) y últimos 30 días
    const weekKeys = new Set<string>()
    const monthKeys = new Set<string>()
    const now = new Date()
    for (let i = 0; i < 7; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      weekKeys.add(toDayKey(d))
    }
    for (let i = 0; i < 30; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      monthKeys.add(toDayKey(d))
    }

    let todayMins = 0,
      todaySessions = 0
    let weekMins = 0,
      weekSessions = 0
    const weekDays = new Set<string>()
    let monthMins = 0,
      monthSessions = 0
    const monthDays = new Set<string>()
    let allMins = 0,
      allSessions = 0

    for (const s of recentAll) {
      if (s.durationMins < 1) continue
      const key = toDayKey(s.startedAt)
      allMins += s.durationMins
      allSessions++
      if (key === todayKey) {
        todayMins += s.durationMins
        todaySessions++
      }
      if (weekKeys.has(key)) {
        weekMins += s.durationMins
        weekSessions++
        weekDays.add(key)
      }
      if (monthKeys.has(key)) {
        monthMins += s.durationMins
        monthSessions++
        monthDays.add(key)
      }
    }

    return NextResponse.json({
      today: { mins: todayMins, sessions: todaySessions },
      thisWeek: {
        mins: weekMins,
        sessions: weekSessions,
        days: weekDays.size,
      },
      thisMonth: {
        mins: monthMins,
        sessions: monthSessions,
        days: monthDays.size,
      },
      allTime: {
        mins: allMins,
        sessions: allSessions,
        booksRead: booksReadCount,
      },
      currentStreak: current,
      longestStreak: longest,
      lastSessionAt: latest?.startedAt ?? null,
    })
  } catch (err) {
    console.error('[GET /api/lectura/sessions/stats]', err)
    return NextResponse.json(
      { error: 'Error al calcular stats' },
      { status: 500 }
    )
  }
}
