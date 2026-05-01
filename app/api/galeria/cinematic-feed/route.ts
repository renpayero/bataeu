import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getGalleryFeedsCinematic } from '@/lib/galleria/settings'
import { normalizeGalleryUrl } from '@/lib/galleria/storage'
import { getFirstMemory, type Memory } from '@/components/CinematicCounter/memoriesManifest'

export async function GET() {
  try {
    const enabled = await getGalleryFeedsCinematic()
    if (!enabled) {
      return NextResponse.json({ enabled: false, memories: [] satisfies Memory[] })
    }

    const photos = await prisma.galleryPhoto.findMany({
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
    })

    if (photos.length === 0) {
      // Fallback defensivo: sin fotos en galería, no activamos el override.
      return NextResponse.json({ enabled: false, memories: [] satisfies Memory[] })
    }

    const first = getFirstMemory()
    const rest: Memory[] = photos.map((p) => ({
      src: normalizeGalleryUrl(p.url, p.filename),
      type: p.type === 'video' ? 'video' : 'photo',
      ...(p.caption ? { caption: p.caption } : {}),
    }))

    return NextResponse.json({ enabled: true, memories: [first, ...rest] })
  } catch (err) {
    console.error('[galeria/cinematic-feed:GET]', err)
    return NextResponse.json({ enabled: false, memories: [] satisfies Memory[] })
  }
}
