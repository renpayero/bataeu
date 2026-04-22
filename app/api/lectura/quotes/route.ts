import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookId = searchParams.get('bookId')
    const tag = searchParams.get('tag')

    const quotes = await prisma.quote.findMany({
      where: {
        ...(bookId ? { bookId: parseInt(bookId, 10) } : {}),
        ...(tag ? { tags: { has: tag } } : {}),
      },
      include: {
        book: { select: { id: true, title: true, author: true, coverUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(quotes)
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener las frases' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookId, text, page, tags } = body

    if (typeof bookId !== 'number') {
      return NextResponse.json(
        { error: 'bookId es requerido' },
        { status: 400 }
      )
    }
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'text es requerido' }, { status: 400 })
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book) {
      return NextResponse.json(
        { error: 'Libro no encontrado' },
        { status: 404 }
      )
    }

    const quote = await prisma.quote.create({
      data: {
        bookId,
        text: text.trim(),
        page: typeof page === 'number' ? page : null,
        tags: Array.isArray(tags)
          ? tags.filter((t: unknown) => typeof t === 'string')
          : [],
      },
      include: {
        book: { select: { id: true, title: true, author: true, coverUrl: true } },
      },
    })

    return NextResponse.json(quote, { status: 201 })
  } catch (err) {
    console.error('[POST /api/lectura/quotes]', err)
    return NextResponse.json(
      { error: 'Error al guardar la frase' },
      { status: 500 }
    )
  }
}
