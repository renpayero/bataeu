import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function normalizeDate(value: unknown): Date | undefined {
  if (!value || typeof value !== 'string') return undefined
  const d = new Date(value)
  if (isNaN(d.getTime())) return undefined
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0)
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? undefined

    const books = await prisma.book.findMany({
      where: status ? { status } : undefined,
      include: { series: true, quotes: { select: { id: true } } },
      orderBy: [{ status: 'asc' }, { priority: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(books)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener los libros' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      author,
      coverUrl,
      isbn,
      pages,
      year,
      genre,
      format,
      status,
      priority,
      currentPage,
      location,
      seriesName,
      seriesOrder,
      startDate,
      moods,
      googleBooksId,
    } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'title es requerido' }, { status: 400 })
    }
    if (!author || typeof author !== 'string' || !author.trim()) {
      return NextResponse.json(
        { error: 'author es requerido' },
        { status: 400 }
      )
    }

    let seriesId: number | undefined
    if (seriesName && typeof seriesName === 'string' && seriesName.trim()) {
      const s = await prisma.series.upsert({
        where: { name: seriesName.trim() },
        update: {},
        create: { name: seriesName.trim() },
      })
      seriesId = s.id
    }

    const book = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        coverUrl: coverUrl || null,
        isbn: isbn || null,
        pages: typeof pages === 'number' ? pages : null,
        year: typeof year === 'number' ? year : null,
        genre: genre || null,
        format: typeof format === 'string' ? format : 'fisico',
        status: typeof status === 'string' ? status : 'quiero',
        priority: typeof priority === 'number' ? priority : 3,
        currentPage: typeof currentPage === 'number' ? currentPage : null,
        location: location || null,
        seriesId,
        seriesOrder: typeof seriesOrder === 'number' ? seriesOrder : null,
        startDate: normalizeDate(startDate),
        moods: Array.isArray(moods)
          ? moods.filter((m: unknown) => typeof m === 'string')
          : [],
        googleBooksId: googleBooksId || null,
      },
      include: { series: true, quotes: true },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (err) {
    console.error('[POST /api/lectura/books]', err)
    return NextResponse.json(
      { error: 'Error al guardar el libro' },
      { status: 500 }
    )
  }
}
