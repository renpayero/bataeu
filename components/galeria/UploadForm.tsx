'use client'

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { GalleryPhotoData } from '@/lib/galleria/types'
import {
  buildMilestoneOptions,
  resolveMilestoneValue,
  type SpecialDateLite,
} from '@/lib/galleria/milestoneOptions'

function todayIso(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

interface Props {
  specialDates: SpecialDateLite[]
  onUploaded: (photo: GalleryPhotoData) => void
  onSpecialDatesChanged?: () => void
}

export default function UploadForm({ specialDates, onUploaded, onSpecialDatesChanged }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [takenAt, setTakenAt] = useState<string>(() => todayIso())
  const [milestoneValue, setMilestoneValue] = useState<string>('')

  const milestoneOptions = useMemo(() => buildMilestoneOptions(specialDates), [specialDates])

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    setProgress({ current: 0, total: files.length })
    try {
      let resolvedId: number | null = null
      if (milestoneValue) {
        resolvedId = await resolveMilestoneValue(milestoneValue)
        if (resolvedId && milestoneValue.startsWith('auto:')) {
          onSpecialDatesChanged?.()
        }
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const form = new FormData()
        form.append('file', file)
        if (caption.trim()) form.append('caption', caption.trim())
        if (takenAt) form.append('takenAt', takenAt)
        if (resolvedId) form.append('specialDateId', String(resolvedId))

        const res = await fetch('/api/galeria', { method: 'POST', body: form })
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body?.error || `Error al subir ${file.name}`)
        }
        const created = (await res.json()) as GalleryPhotoData
        onUploaded(created)
        setProgress({ current: i + 1, total: files.length })
      }

      setCaption('')
      setTakenAt(todayIso())
      setMilestoneValue('')
      if (inputRef.current) inputRef.current.value = ''
      if (cameraInputRef.current) cameraInputRef.current.value = ''
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(null), 1200)
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-5 md:p-6">
      <h3 className="font-playfair text-xl font-bold text-rose-600 mb-4">Agregar recuerdos</h3>

      <div className="grid gap-3 md:grid-cols-3 mb-4">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (opcional)"
          className="px-4 py-2 rounded-xl bg-white/70 border border-rose-200 focus:border-rose-400 focus:outline-none text-sm"
        />
        <input
          type="date"
          value={takenAt}
          onChange={(e) => setTakenAt(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/70 border border-rose-200 focus:border-rose-400 focus:outline-none text-sm"
        />
        <select
          value={milestoneValue}
          onChange={(e) => setMilestoneValue(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/70 border border-rose-200 focus:border-rose-400 focus:outline-none text-sm"
        >
          <option value="">Sin milestone</option>
          {milestoneOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.emoji} {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Hidden inputs — galería y cámara */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*,video/*"
        capture="environment"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-2">
        <motion.button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          whileTap={{ scale: 0.97 }}
          className="py-3 px-4 min-h-[48px] rounded-2xl font-bold text-white bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-sm shadow-md shadow-rose-500/20"
        >
          📁 Galería
        </motion.button>
        <motion.button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={uploading}
          whileTap={{ scale: 0.97 }}
          className="py-3 px-4 min-h-[48px] rounded-2xl font-bold text-rose-700 bg-white/70 hover:bg-white border border-rose-200 disabled:opacity-60 text-sm"
        >
          📸 Tomar foto
        </motion.button>
      </div>

      {progress && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-rose-700"
        >
          Subiendo {progress.current} / {progress.total}…
        </motion.p>
      )}
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
