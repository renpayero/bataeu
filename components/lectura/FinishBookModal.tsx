'use client'

import { useState } from 'react'
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(76, 10, 31, 0.55)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="reading-paper-bg rounded-2xl p-7 md:p-9 shadow-2xl w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto"
            style={{
              border: '1px solid var(--reading-border)',
              boxShadow:
                '0 25px 70px rgba(76,10,31,0.4), inset 0 0 80px rgba(225, 29, 72, 0.05)',
            }}
          >
            <p
              className="text-xs uppercase tracking-widest reading-ink-faded mb-2"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Cerrando un libro
            </p>
            <h2
              className="text-2xl reading-ink-text mb-1"
              style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}
            >
              {bookTitle}
            </h2>
            <p className="text-xs reading-ink-soft-text mb-6">
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
                      color: active ? '#f59e0b' : '#d1d5db',
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
              className="block text-xs uppercase tracking-widest reading-ink-faded mb-2"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Tu reseña
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value.slice(0, MAX_REVIEW))}
              placeholder="Lo que te llevás del libro, lo que te marcó, lo que pensaste mientras lo leías…"
              rows={6}
              className="reading-input w-full resize-none"
              style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}
            />
            <p className="mt-1 text-right text-[10px] reading-ink-soft-text">
              {review.length} / {MAX_REVIEW}
            </p>

            {/* Acciones */}
            <div className="mt-6 flex gap-2">
              <motion.button
                type="button"
                onClick={handleSkip}
                disabled={saving}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold reading-ink-soft-text bg-white/40 border border-rose-200/50 hover:bg-white/60 disabled:opacity-50"
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
                  background:
                    'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
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
}
