import { randomUUID } from 'node:crypto'
import { writeFile, unlink, mkdir } from 'node:fs/promises'
import path from 'node:path'
import {
  ALLOWED_IMAGE_MIMES,
  ALLOWED_MIMES,
  ALLOWED_VIDEO_MIMES,
  GalleryMediaType,
  MAX_UPLOAD_BYTES,
} from './types'

const GALLERY_DIR = path.join(process.cwd(), 'public', 'galeria')

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
}

export interface SavedFile {
  filename: string
  url: string
  type: GalleryMediaType
}

// Normaliza URLs viejas (`/galeria/foo.jpg`, escritas a public/ que en
// `output: standalone` no se sirven en runtime) al endpoint actual.
export function normalizeGalleryUrl(url: string, filename: string): string {
  if (url.startsWith('/galeria/')) return `/api/galeria/file/${filename}`
  return url
}

export function validateUpload(file: File): { ok: true } | { ok: false; error: string; status: number } {
  if (!file || typeof file.size !== 'number') {
    return { ok: false, error: 'Archivo inválido', status: 400 }
  }
  if (file.size === 0) {
    return { ok: false, error: 'El archivo está vacío', status: 400 }
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `El archivo supera ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB`, status: 413 }
  }
  if (!(ALLOWED_MIMES as readonly string[]).includes(file.type)) {
    return { ok: false, error: `Tipo no soportado: ${file.type || 'desconocido'}`, status: 415 }
  }
  return { ok: true }
}

export async function saveFile(file: File): Promise<SavedFile> {
  await mkdir(GALLERY_DIR, { recursive: true })
  const ext = EXTENSION_BY_MIME[file.type] ?? 'bin'
  const filename = `${randomUUID()}.${ext}`
  const dest = path.join(GALLERY_DIR, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(dest, buffer)
  const type: GalleryMediaType = (ALLOWED_VIDEO_MIMES as readonly string[]).includes(file.type)
    ? 'video'
    : 'photo'
  return { filename, url: `/api/galeria/file/${filename}`, type }
}

export async function deleteFile(filename: string): Promise<void> {
  if (!filename || filename.includes('/') || filename.includes('\\') || filename.includes('..')) return
  try {
    await unlink(path.join(GALLERY_DIR, filename))
  } catch {
    // noop: el archivo puede no existir ya
  }
}

export function inferTypeFromMime(mime: string): GalleryMediaType {
  return (ALLOWED_IMAGE_MIMES as readonly string[]).includes(mime) ? 'photo' : 'video'
}
