'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import UploadForm from './UploadForm'
import PhotoCard from './PhotoCard'
import PhotoLightbox from './PhotoLightbox'
import CinematicFeedToggle from './CinematicFeedToggle'
import { BataPhotographer } from '@/components/BataEu'
import WelcomeLetter from '@/components/WelcomeLetter'
import { WELCOME_GALERIA } from '@/lib/welcomeLetters'
import type { GalleryPhotoData } from '@/lib/galleria/types'
import type { SpecialDateLite } from '@/lib/galleria/milestoneOptions'

export default function GaleriaClient() {
  const [photos, setPhotos] = useState<GalleryPhotoData[]>([])
  const [loading, setLoading] = useState(true)
  const [feedEnabled, setFeedEnabled] = useState(false)
  const [lightbox, setLightbox] = useState<GalleryPhotoData | null>(null)
  const [specialDates, setSpecialDates] = useState<SpecialDateLite[]>([])

  const refreshSpecialDates = useCallback(async () => {
    try {
      const res = await fetch('/api/dates')
      if (!res.ok) return
      const data = await res.json()
      if (!Array.isArray(data)) return
      setSpecialDates(
        data.map((d) => ({ id: d.id, title: d.title, emoji: d.emoji, date: d.date })),
      )
    } catch {
      // noop
    }
  }, [])

  useEffect(() => {
    let alive = true
    Promise.all([
      fetch('/api/galeria').then((r) => (r.ok ? r.json() : [])),
      fetch('/api/galeria/settings').then((r) => (r.ok ? r.json() : { galleryFeedsCinematic: false })),
      fetch('/api/dates').then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([list, settings, dates]) => {
        if (!alive) return
        setPhotos(Array.isArray(list) ? list : [])
        setFeedEnabled(Boolean(settings?.galleryFeedsCinematic))
        if (Array.isArray(dates)) {
          setSpecialDates(
            dates.map((d) => ({ id: d.id, title: d.title, emoji: d.emoji, date: d.date })),
          )
        }
        setLoading(false)
      })
      .catch(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  function handleUploaded(photo: GalleryPhotoData) {
    setPhotos((prev) => [photo, ...prev])
  }

  function handleUpdated(photo: GalleryPhotoData) {
    setPhotos((prev) => prev.map((p) => (p.id === photo.id ? photo : p)))
  }

  function handleDeleted(id: number) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <WelcomeLetter content={WELCOME_GALERIA} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4 md:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="w-24 md:w-36 flex-shrink-0"
          >
            <BataPhotographer />
          </motion.div>
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-rose-600 mb-2">
              Nuestra galería
            </h1>
            <p className="text-rose-900/70">
              Nuestros momentos, guardados en un solo lugar.
            </p>
          </div>
        </div>

        <div className="grid gap-5 mb-8">
          <CinematicFeedToggle value={feedEnabled} onChange={setFeedEnabled} />
          <UploadForm
            specialDates={specialDates}
            onUploaded={handleUploaded}
            onSpecialDatesChanged={refreshSpecialDates}
          />
        </div>

        {loading ? (
          <p className="text-rose-700/70 text-center py-10">Cargando…</p>
        ) : photos.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-rose-900/70">
              Todavía no hay fotos. Subí la primera arriba 👆
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {photos.map((p) => (
              <PhotoCard key={p.id} photo={p} onOpen={() => setLightbox(p)} />
            ))}
          </div>
        )}
      </motion.div>

      <PhotoLightbox
        photo={lightbox}
        specialDates={specialDates}
        onClose={() => setLightbox(null)}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
        onSpecialDatesChanged={refreshSpecialDates}
      />
    </div>
  )
}
