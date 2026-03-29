import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const dates = await prisma.specialDate.findMany({
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(dates)
  } catch {
    return NextResponse.json({ error: 'Error al obtener las fechas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, date, emoji } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'title es requerido' }, { status: 400 })
    }
    if (!date || typeof date !== 'string') {
      return NextResponse.json({ error: 'date es requerido' }, { status: 400 })
    }

    // Normalize to noon UTC to avoid timezone shifting
    const dateObj = new Date(date)
    const normalizedDate = new Date(
      Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 12, 0, 0, 0)
    )

    const specialDate = await prisma.specialDate.create({
      data: {
        title: title.trim(),
        date: normalizedDate,
        ...(emoji && typeof emoji === 'string' ? { emoji } : {}),
      },
    })

    return NextResponse.json(specialDate, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al guardar la fecha' }, { status: 500 })
  }
}
