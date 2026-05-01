import { NextResponse, type NextRequest } from 'next/server'
import { stat, readFile } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-dynamic'

const GALLERY_DIR = path.join(process.cwd(), 'public', 'galeria')

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  mp4: 'video/mp4',
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params

  if (
    !filename ||
    filename.includes('/') ||
    filename.includes('\\') ||
    filename.includes('..')
  ) {
    return NextResponse.json({ error: 'invalid filename' }, { status: 400 })
  }

  const filePath = path.join(GALLERY_DIR, filename)
  try {
    const info = await stat(filePath)
    if (!info.isFile()) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }
    const ext = filename.split('.').pop()?.toLowerCase() ?? ''
    const mime = MIME_BY_EXT[ext] ?? 'application/octet-stream'
    const data = await readFile(filePath)
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Length': String(info.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}
