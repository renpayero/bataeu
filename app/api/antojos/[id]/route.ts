import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const antojoId = parseInt(id, 10)
    if (isNaN(antojoId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const body = await request.json()
    const { content, emoji } = body

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'content es requerido' }, { status: 400 })
    }

    const updated = await prisma.antojo.update({
      where: { id: antojoId },
      data: {
        content: content.trim(),
        ...(emoji && typeof emoji === 'string' ? { emoji } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Error al actualizar el antojo' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const antojoId = parseInt(id, 10)
    if (isNaN(antojoId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    await prisma.antojo.delete({ where: { id: antojoId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar el antojo' }, { status: 500 })
  }
}
