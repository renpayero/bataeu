import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const excludeId = searchParams.get('excludeId')
    const excludeNum = excludeId ? parseInt(excludeId, 10) : null

    const count = await prisma.quote.count({
      where: excludeNum ? { NOT: { id: excludeNum } } : undefined,
    })

    if (count === 0) {
      return NextResponse.json({ quote: null })
    }

    const skip = Math.floor(Math.random() * count)
    const [quote] = await prisma.quote.findMany({
      where: excludeNum ? { NOT: { id: excludeNum } } : undefined,
      skip,
      take: 1,
      include: {
        book: { select: { id: true, title: true, author: true, coverUrl: true } },
      },
    })

    return NextResponse.json({ quote })
  } catch {
    return NextResponse.json(
      { error: 'Error al obtener la frase del día' },
      { status: 500 }
    )
  }
}
