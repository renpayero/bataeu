import { NextResponse } from 'next/server'
import { getGalleryFeedsCinematic, setGalleryFeedsCinematic } from '@/lib/galleria/settings'

export async function GET() {
  try {
    const value = await getGalleryFeedsCinematic()
    return NextResponse.json({ galleryFeedsCinematic: value })
  } catch (err) {
    console.error('[galeria/settings:GET]', err)
    return NextResponse.json({ error: 'Error al leer el ajuste' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    if (typeof body?.galleryFeedsCinematic !== 'boolean') {
      return NextResponse.json({ error: 'galleryFeedsCinematic debe ser boolean' }, { status: 400 })
    }
    await setGalleryFeedsCinematic(body.galleryFeedsCinematic)
    return NextResponse.json({ galleryFeedsCinematic: body.galleryFeedsCinematic })
  } catch (err) {
    console.error('[galeria/settings:PATCH]', err)
    return NextResponse.json({ error: 'Error al guardar el ajuste' }, { status: 500 })
  }
}
