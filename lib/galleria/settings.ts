import { prisma } from '@/lib/prisma'
import { GALLERY_FEEDS_CINEMATIC_KEY } from './types'

export async function getGalleryFeedsCinematic(): Promise<boolean> {
  const row = await prisma.appSetting.findUnique({ where: { key: GALLERY_FEEDS_CINEMATIC_KEY } })
  return row?.value === 'true'
}

export async function setGalleryFeedsCinematic(value: boolean): Promise<void> {
  const str = value ? 'true' : 'false'
  await prisma.appSetting.upsert({
    where: { key: GALLERY_FEEDS_CINEMATIC_KEY },
    create: { key: GALLERY_FEEDS_CINEMATIC_KEY, value: str },
    update: { value: str },
  })
}
