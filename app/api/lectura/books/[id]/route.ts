import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function normalizeDate(value: unknown): Date | null | undefined {
  if (value === null) return null
  if (value === undefined) return undefined
  if (typeof value !== 'string') return undefined
  const d = new Date(value)
  if (isNaN(d.getTime())) return undefined
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0)
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bookId = parseInt(id, 10)
    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        series: { include: { books: { select: { id: true, title: true, status: true } } } },
        quotes: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!book) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener el libro' },
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
    const bookId = parseInt(id, 10)
    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }

    const body = await request.json()
    const data: Record<string, unknown> = {}

    if (typeof body.title === 'string' && body.title.trim())
      data.title = body.title.trim()
    if (typeof body.author === 'string' && body.author.trim())
      data.author = body.author.trim()
    if ('coverUrl' in body) data.coverUrl = body.coverUrl || null
    if ('isbn' in body) data.isbn = body.isbn || null
    if ('pages' in body)
      data.pages = typeof body.pages === 'number' ? body.pages : null
    if ('year' in body)
      data.year = typeof body.year === 'number' ? body.year : null
    if ('genre' in body) data.genre = body.genre || null
    if (typeof body.format === 'string') data.format = body.format
    if (typeof body.status === 'string') data.status = body.status
    if (typeof body.priority === 'number') data.priority = body.priority
    if ('currentPage' in body)
      data.currentPage =
        typeof body.currentPage === 'number' ? body.currentPage : null
    if ('location' in body) data.location = body.location || null
    if ('seriesOrder' in body)
      data.seriesOrder =
        typeof body.seriesOrder === 'number' ? body.seriesOrder : null
    if ('startDate' in body) data.startDate = normalizeDate(body.startDate)
    if ('endDate' in body) data.endDate = normalizeDate(body.endDate)
    if ('rating' in body)
      data.rating = typeof body.rating === 'number' ? body.rating : null
    if ('lentTo' in body) data.lentTo = body.lentTo || null
    if ('lentAt' in body) data.lentAt = normalizeDate(body.lentAt)
    if (Array.isArray(body.moods))
      data.moods = body.moods.filter((m: unknown) => typeof m === 'string')
    if ('abandonReason' in body) data.abandonReason = body.abandonReason || null
    if ('abandonNote' in body) data.abandonNote = body.abandonNote || null

    if (body.seriesName !== undefined) {
      if (!body.seriesName) {
        data.seriesId = null
      } else if (typeof body.seriesName === 'string' && body.seriesName.trim()) {
        const s = await prisma.series.upsert({
          where: { name: body.seriesName.trim() },
          update: {},
          create: { name: body.seriesName.trim() },
        })
        data.seriesId = s.id
      }
    }

    const book = await prisma.book.update({
      where: { id: bookId },
      data,
      include: { series: true, quotes: true },
    })

    return NextResponse.json(book)
  } catch (err) {
    console.error('[PUT /api/lectura/books/:id]', err)
    return NextResponse.json(
      { error: 'Error al actualizar el libro' },
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
    const bookId = parseInt(id, 10)
    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }

    await prisma.book.delete({ where: { id: bookId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar el libro' },
      { status: 500 }
    )
  }
}
