import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dateId = parseInt(id, 10)
    if (isNaN(dateId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const body = await request.json()
    const { title, date, emoji } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'title es requerido' }, { status: 400 })
    }

    const data: { title: string; emoji?: string; date?: Date } = { title: title.trim() }
    if (emoji && typeof emoji === 'string') data.emoji = emoji
    if (date && typeof date === 'string') {
      const dateObj = new Date(date)
      data.date = new Date(
        Date.UTC(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), 12, 0, 0, 0)
      )
    }

    const updated = await prisma.specialDate.update({
      where: { id: dateId },
      data,
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar la fecha' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dateId = parseInt(id, 10)
    if (isNaN(dateId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    await prisma.specialDate.delete({ where: { id: dateId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar la fecha' }, { status: 500 })
  }
}
