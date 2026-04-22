'use client'

import { motion } from 'framer-motion'
import type { GalleryPhotoData } from '@/lib/galleria/types'

interface Props {
  photo: GalleryPhotoData
  onOpen: () => void
}

export default function PhotoCard({ photo, onOpen }: Props) {
  const isVideo = photo.type === 'video'
  return (
    <motion.button
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      className="relative aspect-square overflow-hidden rounded-2xl bg-rose-100 group"
    >
      {isVideo ? (
        <video
          src={photo.url}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.url} alt={photo.caption || 'Recuerdo'} className="w-full h-full object-cover" />
      )}

      {isVideo && (
        <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 text-xs">
          ▶
        </div>
      )}

      {photo.specialDate && (
        <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-1 text-xs font-bold text-rose-600">
          {photo.specialDate.emoji} {photo.specialDate.title}
        </div>
      )}

      {photo.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {photo.caption}
        </div>
      )}
    </motion.button>
  )
}
