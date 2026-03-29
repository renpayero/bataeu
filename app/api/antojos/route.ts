import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MAX_ANTOJOS = 4
const TTL_MS = 24 * 60 * 60 * 1000 // 24 horas en ms

async function deleteExpired() {
  const cutoff = new Date(Date.now() - TTL_MS)
  await prisma.antojo.deleteMany({ where: { createdAt: { lt: cutoff } } })
}

export async function GET() {
  try {
    await deleteExpired()
    const antojos = await prisma.antojo.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(antojos)
  } catch {
    return NextResponse.json({ error: 'Error al obtener los antojos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await deleteExpired()

    const count = await prisma.antojo.count()
    if (count >= MAX_ANTOJOS) {
      return NextResponse.json({ error: 'Máximo de antojos alcanzado' }, { status: 429 })
    }

    const body = await request.json()
    const { content, emoji } = body

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'content es requerido' }, { status: 400 })
    }

    const antojo = await prisma.antojo.create({
      data: {
        content: content.trim(),
        ...(emoji && typeof emoji === 'string' ? { emoji } : {}),
      },
    })

    return NextResponse.json(antojo, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al guardar el antojo' }, { status: 500 })
  }
}
