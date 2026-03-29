import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const entry = await prisma.cycleEntry.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(entry)
  } catch {
    return NextResponse.json({ error: 'Error al obtener el ciclo' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { startDate, cycleLength = 28, periodLength = 5 } = body

    if (!startDate) {
      return NextResponse.json({ error: 'startDate es requerido' }, { status: 400 })
    }

    // Parse as local noon UTC to avoid timezone shifts.
    // new Date("2026-03-16") parses as UTC midnight, which in UTC-3 becomes March 15 at 9pm local.
    // Adding T12:00:00Z ensures the date stays correct in any timezone from UTC-12 to UTC+11.
    const parsedDate = new Date(startDate + 'T12:00:00.000Z')
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'startDate inválido' }, { status: 400 })
    }

    const cl = Number(cycleLength)
    const pl = Number(periodLength)
    if (!Number.isInteger(cl) || cl < 21 || cl > 45) {
      return NextResponse.json({ error: 'cycleLength debe estar entre 21 y 45' }, { status: 400 })
    }
    if (!Number.isInteger(pl) || pl < 2 || pl > 10 || pl >= cl) {
      return NextResponse.json({ error: 'periodLength debe estar entre 2 y 10 y ser menor que cycleLength' }, { status: 400 })
    }

    const entry = await prisma.cycleEntry.create({
      data: {
        startDate: parsedDate,
        cycleLength: cl,
        periodLength: pl,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al guardar el ciclo' }, { status: 500 })
  }
}
