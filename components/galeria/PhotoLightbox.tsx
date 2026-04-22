'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GalleryPhotoData } from '@/lib/galleria/types'
import {
  buildMilestoneOptions,
  resolveMilestoneValue,
  type SpecialDateLite,
} from '@/lib/galleria/milestoneOptions'

interface Props {
  photo: GalleryPhotoData | null
  specialDates: SpecialDateLite[]
  onClose: () => void
  onUpdated: (photo: GalleryPhotoData) => void
  onDeleted: (id: number) => void
  onSpecialDatesChanged?: () => void
}

export default function PhotoLightbox({
  photo,
  specialDates,
  onClose,
  onUpdated,
  onDeleted,
  onSpecialDatesChanged,
}: Props) {
  const [caption, setCaption] = useState('')
  const [takenAt, setTakenAt] = useState('')
  const [milestoneValue, setMilestoneValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const milestoneOptions = useMemo(() => buildMilestoneOptions(specialDates), [specialDates])

  useEffect(() => {
    if (!photo) return
    setCaption(photo.caption ?? '')
    setTakenAt(photo.takenAt ? photo.takenAt.slice(0, 10) : '')
    setMilestoneValue(photo.specialDateId ? String(photo.specialDateId) : '')
    setConfirmOpen(false)
  }, [photo])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmOpen) setConfirmOpen(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, confirmOpen])

  async function save() {
    if (!photo || saving) return
    setSaving(true)
    try {
      let resolvedId: number | null = null
      if (milestoneValue) {
        resolvedId = await resolveMilestoneValue(milestoneValue)
        if (resolvedId && milestoneValue.startsWith('auto:')) {
          onSpecialDatesChanged?.()
        }
      }

      const res = await fetch(`/api/galeria/${photo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          takenAt: takenAt || null,
          specialDateId: resolvedId,
        }),
      })
      if (!res.ok) throw new Error()
      const updated = (await res.json()) as GalleryPhotoData
      onUpdated(updated)
      onClose()
    } catch {
      // noop
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!photo || deleting) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/galeria/${photo.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDeleted(photo.id)
      setConfirmOpen(false)
      onClose()
    } catch {
      // noop
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-auto flex flex-col relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black flex items-center justify-center max-h-[60vh]">
              {photo.type === 'video' ? (
                <video src={photo.url} controls className="max-h-[60vh] w-auto" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo.url} alt={photo.caption || 'Recuerdo'} className="max-h-[60vh] w-auto" />
              )}
            </div>

            <div className="p-5 grid gap-3">
              <label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Un recuerdo lindo…"
                className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 focus:border-rose-400 focus:outline-none"
              />

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Fecha</label>
                  <input
                    type="date"
                    value={takenAt}
                    onChange={(e) => setTakenAt(e.target.value)}
                    className="w-full mt-1 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Milestone</label>
                  <select
                    value={milestoneValue}
                    onChange={(e) => setMilestoneValue(e.target.value)}
                    className="w-full mt-1 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 focus:border-rose-400 focus:outline-none"
                  >
                    <option value="">Sin milestone</option>
                    {milestoneOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.emoji} {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-rose-100 mt-2">
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-bold"
                >
                  Eliminar
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-rose-700 font-bold hover:bg-rose-50"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={save}
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 disabled:opacity-60"
                  >
                    {saving ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {confirmOpen && (
                <motion.div
                  className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center p-6 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => !deleting && setConfirmOpen(false)}
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center"
                    initial={{ scale: 0.9, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-4xl mb-3">🗑️</div>
                    <h4 className="font-playfair text-xl font-bold text-rose-700 mb-2">
                      ¿Eliminar esta foto?
                    </h4>
                    <p className="text-sm text-rose-900/70 mb-5">
                      No vas a poder recuperarla después.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setConfirmOpen(false)}
                        disabled={deleting}
                        className="px-5 py-2 rounded-xl text-rose-700 font-bold hover:bg-rose-50 disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmDelete}
                        disabled={deleting}
                        className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-60"
                      >
                        {deleting ? 'Eliminando…' : 'Eliminar'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
