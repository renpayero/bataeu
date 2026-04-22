import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeStreaks } from '@/lib/lectura/streakCalc'
import {
  SESSION_MIN_MINUTES,
  SESSION_MAX_MINUTES,
} from '@/lib/lectura/readingConfig'

export const dynamic = 'force-dynamic'

// Nota: ReadingSession.startedAt/endedAt son timestamps REALES (no fechas de
// día). No se normalizan a noon UTC como sí hacen SpecialDate/Book.startDate.

function parseIsoDate(v: unknown): Date | null {
  if (typeof v !== 'string') return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

function parseIntSafe(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return Math.trunc(v)
  if (typeof v === 'string' && v.trim() && !isNaN(Number(v))) {
    return Math.trunc(Number(v))
  }
  return null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookIdRaw = searchParams.get('bookId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const limitRaw = searchParams.get('limit')

    const where: Record<string, unknown> = {}
    if (bookIdRaw !== null && bookIdRaw !== '') {
      const bookId = parseInt(bookIdRaw, 10)
      if (!isNaN(bookId)) where.bookId = bookId
    }
    if (from || to) {
      const range: Record<string, Date> = {}
      const f = parseIsoDate(from)
      const t = parseIsoDate(to)
      if (f) range.gte = f
      if (t) range.lte = t
      if (Object.keys(range).length) where.startedAt = range
    }

    const limit = parseIntSafe(limitRaw) ?? 100
    const sessions = await prisma.readingSession.findMany({
      where,
      orderBy: { startedAt: 'desc' },
      take: Math.min(limit, 500),
      include: {
        book: {
          select: { id: true, title: true, author: true, coverUrl: true },
        },
      },
    })

    return NextResponse.json(sessions)
  } catch (err) {
    console.error('[GET /api/lectura/sessions]', err)
    return NextResponse.json(
      { error: 'Error al obtener las sesiones' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const startedAt = parseIsoDate(body.startedAt)
    const endedAt = parseIsoDate(body.endedAt)
    if (!startedAt || !endedAt) {
      return NextResponse.json(
        { error: 'startedAt y endedAt son requeridos (ISO)' },
        { status: 400 }
      )
    }

    const durationMins = parseIntSafe(body.durationMins)
    if (
      durationMins === null ||
      durationMins < SESSION_MIN_MINUTES ||
      durationMins > SESSION_MAX_MINUTES
    ) {
      return NextResponse.json(
        {
          error: `durationMins debe estar entre ${SESSION_MIN_MINUTES} y ${SESSION_MAX_MINUTES}`,
        },
        { status: 400 }
      )
    }

    const bookIdRaw = parseIntSafe(body.bookId)
    const bookId: number | null = bookIdRaw ?? null
    const startPage = parseIntSafe(body.startPage)
    const endPage = parseIntSafe(body.endPage)
    const pagesRead = parseIntSafe(body.pagesRead)
    const customMins = parseIntSafe(body.customMins)

    const pomodoroType =
      typeof body.pomodoroType === 'string' &&
      ['25-5', '45-15', 'libre', 'custom'].includes(body.pomodoroType)
        ? body.pomodoroType
        : '25-5'

    const note =
      typeof body.note === 'string' && body.note.trim()
        ? body.note.trim().slice(0, 500)
        : null

    // Transacción: crear sesión + (opcionalmente) actualizar Book.currentPage
    // solo si hay bookId, endPage numérico y es mayor al current actual.
    const result = await prisma.$transaction(async (tx) => {
      // Validar que el libro existe si hay bookId (evita FK silente)
      let safeBookId: number | null = bookId
      if (safeBookId !== null) {
        const exists = await tx.book.findUnique({
          where: { id: safeBookId },
          select: { id: true, currentPage: true },
        })
        if (!exists) {
          // libro borrado — guardamos como sesión libre
          safeBookId = null
        } else if (endPage !== null && endPage > (exists.currentPage ?? 0)) {
          await tx.book.update({
            where: { id: safeBookId },
            data: { currentPage: endPage },
          })
        }
      }

      const session = await tx.readingSession.create({
        data: {
          bookId: safeBookId,
          startedAt,
          endedAt,
          durationMins,
          pagesRead: pagesRead ?? null,
          startPage: startPage ?? null,
          endPage: endPage ?? null,
          pomodoroType,
          customMins: customMins ?? null,
          note,
        },
        include: {
          book: {
            select: { id: true, title: true, author: true, coverUrl: true },
          },
        },
      })

      return session
    })

    // Calcular si esta sesión creó un nuevo día de streak (para flag newStreak)
    const recentSessions = await prisma.readingSession.findMany({
      where: { durationMins: { gte: SESSION_MIN_MINUTES }, bookId: { not: null } },
      select: { startedAt: true, durationMins: true, bookId: true },
      orderBy: { startedAt: 'desc' },
      take: 365,
    })
    const { current, hasSessionToday } = computeStreaks(recentSessions)
    // newStreak = true si current === 1 y hoy es el primer día
    const newStreak = hasSessionToday && current === 1

    return NextResponse.json(
      { ...result, newStreak, streakCurrent: current },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/lectura/sessions]', err)
    return NextResponse.json(
      { error: 'Error al crear la sesión' },
      { status: 500 }
    )
  }
}
