export type GalleryMediaType = 'photo' | 'video'

export interface GalleryPhotoData {
  id: number
  filename: string
  url: string
  type: GalleryMediaType
  caption: string | null
  takenAt: string | null
  specialDateId: number | null
  specialDate?: {
    id: number
    title: string
    date: string
    emoji: string
  } | null
  createdAt: string
}

export const GALLERY_FEEDS_CINEMATIC_KEY = 'gallery_feeds_cinematic'

export const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ALLOWED_VIDEO_MIMES = ['video/mp4'] as const
export const ALLOWED_MIMES = [...ALLOWED_IMAGE_MIMES, ...ALLOWED_VIDEO_MIMES] as const

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024
