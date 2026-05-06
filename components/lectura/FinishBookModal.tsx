'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  open: boolean
  bookTitle: string
  initialRating?: number | null
  initialReview?: string | null
  onClose: () => void
  onConfirm: (data: { rating: number | null; reviewText: string | null }) => Promise<void> | void
}

const MAX_REVIEW = 2000

// Colores hardcoded — el modal se renderiza vía portal a document.body,
// así que se escapa del scope `.reading-scope` y no puede usar var(--reading-*).
const PAPER_BG = 'linear-gradient(135deg, #fffaf3 0%, #fef3c7 100%)'
const PAPER_BORDER = 'rgba(180, 83, 9, 0.18)'
const INK_HEADING = '#a16207'
const INK_TITLE = '#451a03'
const INK_BODY = '#7c2d12'
const INK_MUTED = '#92400e'
const ACCENT_FROM = '#e11d48'
const ACCENT_TO = '#9f1239'

export default function FinishBookModal({
  open,
  bookTitle,
  initialRating,
  initialReview,
  onClose,
  onConfirm,
}: Props) {
  const [rating, setRating] = useState<number | null>(initialRating ?? null)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [review, setReview] = useState(initialReview ?? '')
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleSave() {
    if (saving) return
    setSaving(true)
    try {
      await onConfirm({
        rating: rating,
        reviewText: review.trim() || null,
      })
    } finally {
      setSaving(false)
    }
  }

  async function handleSkip() {
    if (saving) return
    setSaving(true)
    try {
      await onConfirm({ rating: null, reviewText: null })
    } finally {
      setSaving(false)
    }
  }

  const displayRating = hoverRating ?? rating ?? 0

  if (!mounted) return null

  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(20, 6, 24, 0.55)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl p-7 md:p-9 shadow-2xl w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto"
            style={{
              background: PAPER_BG,
              border: `1px solid ${PAPER_BORDER}`,
              boxShadow:
                '0 25px 70px rgba(20,6,24,0.45), inset 0 0 80px rgba(225, 29, 72, 0.04)',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-playfair), serif', color: INK_HEADING }}
            >
              Cerrando un libro
            </p>
            <h2
              className="text-2xl mb-1"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontStyle: 'italic',
                color: INK_TITLE,
              }}
            >
              {bookTitle}
            </h2>
            <p className="text-xs mb-6" style={{ color: INK_MUTED }}>
              ¿Qué te llevás de este libro?
            </p>

            {/* Estrellas */}
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map((n) => {
                const active = n <= displayRating
                return (
                  <motion.button
                    key={n}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.92 }}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(rating === n ? null : n)}
                    aria-label={`${n} estrella${n === 1 ? '' : 's'}`}
                    className="text-3xl transition-colors"
                    style={{
                      color: active ? '#f59e0b' : '#d4a373',
                      opacity: active ? 1 : 0.45,
                      filter: active ? 'drop-shadow(0 1px 2px rgba(245,158,11,0.4))' : 'none',
                    }}
                  >
                    ★
                  </motion.button>
                )
              })}
            </div>

            {/* Reseña */}
            <label
              className="block text-xs uppercase tracking-widest mb-2"
              style={{ fontFamily: 'var(--font-playfair), serif', color: INK_HEADING }}
            >
              Tu reseña
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, MAX_REVIEW))}
              placeholder="Lo que te llevás del libro, lo que te marcó, lo que pensaste mientras lo leías…"
              rows={6}
              className="w-full resize-none rounded-xl outline-none transition-colors"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontStyle: 'italic',
                background: 'rgba(255, 255, 255, 0.65)',
                border: `1px solid ${PAPER_BORDER}`,
                color: INK_BODY,
                padding: '14px 16px',
                lineHeight: 1.5,
              }}
            />
            <p className="mt-1 text-right text-[10px]" style={{ color: INK_MUTED, opacity: 0.7 }}>
              {review.length} / {MAX_REVIEW}
            </p>

            {/* Acciones */}
            <div className="mt-6 flex gap-2">
              <motion.button
                type="button"
                onClick={handleSkip}
                disabled={saving}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold disabled:opacity-50 transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.55)',
                  border: `1px solid ${PAPER_BORDER}`,
                  color: INK_BODY,
                }}
              >
                Saltar
              </motion.button>
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={saving}
                whileTap={{ scale: 0.97 }}
                className="flex-[2] py-3 rounded-2xl text-sm font-bold text-white shimmer-btn disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_FROM}, ${ACCENT_TO})`,
                  boxShadow: '0 8px 22px rgba(225, 29, 72, 0.35)',
                }}
              >
                {saving ? 'Guardando…' : 'Guardar reseña'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(overlay, document.body)
}
