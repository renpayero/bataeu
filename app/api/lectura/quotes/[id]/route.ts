import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const quoteId = parseInt(id, 10)
    if (isNaN(quoteId)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }

    const body = await request.json()
    const data: Record<string, unknown> = {}
    if (typeof body.text === 'string' && body.text.trim())
      data.text = body.text.trim()
    if ('page' in body)
      data.page = typeof body.page === 'number' ? body.page : null
    if (Array.isArray(body.tags))
      data.tags = body.tags.filter((t: unknown) => typeof t === 'string')

    const quote = await prisma.quote.update({
      where: { id: quoteId },
      data,
      include: {
        book: { select: { id: true, title: true, author: true, coverUrl: true } },
      },
    })

    return NextResponse.json(quote)
  } catch {
    return NextResponse.json(
      { error: 'Error al actualizar la frase' },
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
    const quoteId = parseInt(id, 10)
    if (isNaN(quoteId)) {
      return NextResponse.json({ error: 'id inválido' }, { status: 400 })
    }

    await prisma.quote.delete({ where: { id: quoteId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: 'Error al eliminar la frase' },
      { status: 500 }
    )
  }
}
