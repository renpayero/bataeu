'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AntojoData {
  id: number
  content: string
  emoji: string
  createdAt: string
}

interface AntojoFormProps {
  /** If provided, the form edits an existing antojo (PUT). Otherwise creates (POST). */
  antojoId?: number
  initialContent?: string
  initialEmoji?: string
  onSuccess: (antojo: AntojoData) => void
  onCancel?: () => void
  submitLabel?: string
}

// 20 emojis — 5 por estado de humor según fase
export const MOOD_EMOJIS = [
  // Fase 1 — Cansada, necesita mimos
  '🛋️', '😴', '🧸', '🫂', '🩹',
  // Fase 2 — Energética, feliz
  '⚡', '🌱', '😊', '💃', '🎉',
  // Fase 3 — Romántica, fogosa
  '🔥', '🫦', '💖', '✨', '😍',
  // Fase 4 — Moody, antojo de comfort
  '😤', '🍫', '🌧️', '😭', '🧁',
]

const CONFETTI_EMOJIS = ['🍕', '🍫', '🧁', '🌮', '🍟', '🍰', '🥐', '🍩', '🍜', '🫔', '🥗', '🍦']

function ConfettiParticle({ emoji, vx, vy }: { emoji: string; vx: number; vy: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none select-none text-2xl z-[100]"
      style={{ left: '50%', top: '40%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: vx, y: vy, opacity: 0, scale: 0.5 }}
      transition={{ duration: 1.4, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  )
}

export default function AntojoForm({
  antojoId,
  initialContent = '',
  initialEmoji = '🍕',
  onSuccess,
  onCancel,
  submitLabel,
}: AntojoFormProps) {
  const isEdit = antojoId !== undefined
  const [content, setContent] = useState(initialContent)
  const [emoji, setEmoji] = useState(initialEmoji)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; vx: number; vy: number }>>([])

  function launchConfetti() {
    const particles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
      vx: (Math.random() - 0.5) * 300,
      vy: -(Math.random() * 200 + 80),
    }))
    setConfetti(particles)
    setTimeout(() => setConfetti([]), 1800)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError(false)
    try {
      const url = isEdit ? `/api/antojos/${antojoId}` : '/api/antojos'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, emoji }),
      })
      if (res.ok) {
        const antojo: AntojoData = await res.json()
        onSuccess(antojo)
        if (!isEdit) {
          setContent('')
          setEmoji('🍕')
          launchConfetti()
        }
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const label = submitLabel ?? (isEdit ? '✓ Guardar' : '💾 Guardar')

  return (
    <>
      {/* Confetti particles */}
      <AnimatePresence>
        {confetti.map((p) => (
          <ConfettiParticle key={p.id} emoji={p.emoji} vx={p.vx} vy={p.vy} />
        ))}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-2">
        {error && (
          <p className="text-xs text-red-400 font-semibold">No se pudo guardar. Intentá de nuevo.</p>
        )}

        {/* Emoji picker trigger */}
        <div className="relative">
          <motion.button
            type="button"
            onClick={() => setShowPicker(v => !v)}
            className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-colors"
            title="Elegir emoji"
            whileTap={{ scale: 0.88 }}
          >
            {emoji}
          </motion.button>

          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-12 left-0 z-20 rounded-2xl p-3 shadow-xl grid grid-cols-5 gap-1 max-w-[280px]"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.7)',
                }}
              >
                {/* Labels */}
                <p className="col-span-5 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-1">¿Cómo te sentís?</p>
                {MOOD_EMOJIS.map((e) => (
                  <motion.button
                    key={e}
                    type="button"
                    onClick={() => { setEmoji(e); setShowPicker(false) }}
                    className={`text-xl w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${emoji === e ? 'bg-rose-100 ring-2 ring-rose-300' : 'hover:bg-rose-50'}`}
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.15 }}
                  >
                    {e}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input + submit */}
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ej: medialunas con dulce de leche 🥐"
            className="flex-1 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
            style={{
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.7)',
            }}
            maxLength={280}
            autoFocus={isEdit}
          />
          <motion.button
            type="submit"
            disabled={loading || !content.trim()}
            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-5 py-3 min-h-[48px] rounded-2xl transition-colors text-sm whitespace-nowrap shimmer-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.93 }}
          >
            {loading ? '...' : label}
          </motion.button>
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 font-bold px-3 py-3 rounded-2xl transition-colors text-sm"
              whileTap={{ scale: 0.93 }}
            >
              ✕
            </motion.button>
          )}
        </div>
      </form>
    </>
  )
}
