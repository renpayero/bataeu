import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteFile, normalizeGalleryUrl } from '@/lib/galleria/storage'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const photoId = parseInt(id, 10)
    if (isNaN(photoId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const body = await request.json()
    const { caption, takenAt, specialDateId } = body

    const data: {
      caption?: string | null
      takenAt?: Date | null
      specialDateId?: number | null
    } = {}

    if (caption !== undefined) {
      data.caption = typeof caption === 'string' && caption.trim() ? caption.trim() : null
    }
    if (takenAt !== undefined) {
      if (takenAt === null || takenAt === '') {
        data.takenAt = null
      } else if (typeof takenAt === 'string') {
        const d = new Date(takenAt)
        if (!isNaN(d.getTime())) {
          data.takenAt = new Date(
            Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0)
          )
        }
      }
    }
    if (specialDateId !== undefined) {
      if (specialDateId === null || specialDateId === '') {
        data.specialDateId = null
      } else {
        const n = typeof specialDateId === 'number' ? specialDateId : parseInt(specialDateId, 10)
        if (!isNaN(n)) data.specialDateId = n
      }
    }

    const updated = await prisma.galleryPhoto.update({
      where: { id: photoId },
      data,
      include: { specialDate: true },
    })

    return NextResponse.json({ ...updated, url: normalizeGalleryUrl(updated.url, updated.filename) })
  } catch (err) {
    console.error('[galeria:PUT]', err)
    return NextResponse.json({ error: 'Error al actualizar la foto' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const photoId = parseInt(id, 10)
    if (isNaN(photoId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

    const existing = await prisma.galleryPhoto.findUnique({ where: { id: photoId } })
    if (!existing) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })

    await prisma.galleryPhoto.delete({ where: { id: photoId } })
    await deleteFile(existing.filename)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[galeria:DELETE]', err)
    return NextResponse.json({ error: 'Error al eliminar la foto' }, { status: 500 })
  }
}
