import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  SESSION_MIN_MINUTES,
  SESSION_MAX_MINUTES,
} from '@/lib/lectura/readingConfig'

export const dynamic = 'force-dynamic'

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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sid = parseInt(id, 10)
    if (isNaN(sid)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }
    const session = await prisma.readingSession.findUnique({
      where: { id: sid },
      include: {
        book: {
          select: { id: true, title: true, author: true, coverUrl: true },
        },
      },
    })
    if (!session) {
      return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
    }
    return NextResponse.json(session)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener la sesión' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sid = parseInt(id, 10)
    if (isNaN(sid)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }
    const body = await request.json()
    const data: Record<string, unknown> = {}

    if ('durationMins' in body) {
      const d = parseIntSafe(body.durationMins)
      if (d === null || d < SESSION_MIN_MINUTES || d > SESSION_MAX_MINUTES) {
        return NextResponse.json(
          { error: 'durationMins fuera de rango' },
          { status: 400 }
        )
      }
      data.durationMins = d
    }
    if ('pagesRead' in body) {
      data.pagesRead = parseIntSafe(body.pagesRead)
    }
    if ('startPage' in body) {
      data.startPage = parseIntSafe(body.startPage)
    }
    if ('endPage' in body) {
      data.endPage = parseIntSafe(body.endPage)
    }
    if ('note' in body) {
      data.note =
        typeof body.note === 'string' && body.note.trim()
          ? body.note.trim().slice(0, 500)
          : null
    }
    if ('endedAt' in body) {
      const e = parseIsoDate(body.endedAt)
      if (!e) {
        return NextResponse.json({ error: 'endedAt inválido' }, { status: 400 })
      }
      data.endedAt = e
    }

    const updated = await prisma.readingSession.update({
      where: { id: sid },
      data,
      include: {
        book: {
          select: { id: true, title: true, author: true, coverUrl: true },
        },
      },
    })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('[PUT /api/lectura/sessions/:id]', err)
    return NextResponse.json(
      { error: 'Error al actualizar' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sid = parseInt(id, 10)
    if (isNaN(sid)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }
    await prisma.readingSession.delete({ where: { id: sid } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar' },
      { status: 500 }
    )
  }
}
