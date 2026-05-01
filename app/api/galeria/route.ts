import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveFile, validateUpload, normalizeGalleryUrl } from '@/lib/galleria/storage'
import { firePush } from '@/lib/push/triggers'
import { COUPLE_NICKNAMES } from '@/lib/coupleConfig'

export async function GET() {
  try {
    const photos = await prisma.galleryPhoto.findMany({
      include: { specialDate: true },
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
    })
    const normalized = photos.map((p) => ({ ...p, url: normalizeGalleryUrl(p.url, p.filename) }))
    return NextResponse.json(normalized)
  } catch {
    return NextResponse.json({ error: 'Error al obtener la galería' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Falta el archivo' }, { status: 400 })
    }

    const check = validateUpload(file)
    if (!check.ok) return NextResponse.json({ error: check.error }, { status: check.status })

    const caption = (form.get('caption') as string | null)?.trim() || null
    const takenAtRaw = form.get('takenAt') as string | null
    const specialDateIdRaw = form.get('specialDateId') as string | null

    let takenAt: Date | null = null
    if (takenAtRaw) {
      const d = new Date(takenAtRaw)
      if (!isNaN(d.getTime())) {
        takenAt = new Date(
          Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12, 0, 0, 0)
        )
      }
    }

    let specialDateId: number | null = null
    if (specialDateIdRaw) {
      const n = parseInt(specialDateIdRaw, 10)
      if (!isNaN(n)) specialDateId = n
    }

    const saved = await saveFile(file)

    const row = await prisma.galleryPhoto.create({
      data: {
        filename: saved.filename,
        url: saved.url,
        type: saved.type,
        caption,
        takenAt,
        specialDateId,
      },
      include: { specialDate: true },
    })

    firePush(COUPLE_NICKNAMES.name1, {
      title: `📸 ${COUPLE_NICKNAMES.name2} subió una foto`,
      body: row.caption ?? 'Un nuevo recuerdo en el álbum',
      url: '/galeria',
      tag: `galeria-${row.id}`,
    })

    return NextResponse.json(row, { status: 201 })
  } catch (err) {
    console.error('[galeria:POST]', err)
    return NextResponse.json({ error: 'Error al subir la foto' }, { status: 500 })
  }
}
