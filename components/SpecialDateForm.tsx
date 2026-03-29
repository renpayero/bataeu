'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface SpecialDateData {
  id: number
  title: string
  date: string
  emoji: string
  createdAt: string
}

interface SpecialDateFormProps {
  dateId?: number
  initialTitle?: string
  initialDate?: string
  initialEmoji?: string
  onSuccess: (date: SpecialDateData) => void
  onCancel: () => void
}

const SUGGESTED_EMOJIS = ['💕', '🥂', '🎂', '🌹', '✈️', '🎄', '🏠', '💍', '📸', '🎵', '🍝', '🎬', '⛰️', '🏖️', '🎁', '🐶']

export default function SpecialDateForm({
  dateId,
  initialTitle = '',
  initialDate = '',
  initialEmoji = '💕',
  onSuccess,
  onCancel,
}: SpecialDateFormProps) {
  const isEdit = dateId !== undefined
  const [title, setTitle] = useState(initialTitle)
  const [date, setDate] = useState(initialDate)
  const [emoji, setEmoji] = useState(initialEmoji)
  const [showPicker, setShowPicker] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !date) return
    setLoading(true)
    setError(false)
    try {
      const url = isEdit ? `/api/dates/${dateId}` : '/api/dates'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, emoji }),
      })
      if (res.ok) {
        const data: SpecialDateData = await res.json()
        onSuccess(data)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl px-5 py-5 space-y-3"
      style={{
        background: 'rgba(255,255,255,0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      {error && (
        <p className="text-xs text-red-400 font-semibold">No se pudo guardar. Intentá de nuevo.</p>
      )}

      {/* Emoji picker */}
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/60 transition-colors"
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
              className="absolute top-12 left-0 z-20 rounded-2xl p-3 shadow-xl grid grid-cols-4 gap-1 max-w-[240px]"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.7)',
              }}
            >
              {SUGGESTED_EMOJIS.map((e) => (
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

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej: Primer beso"
        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-300"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}
        maxLength={120}
        autoFocus
      />

      {/* Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <motion.button
          type="submit"
          disabled={loading || !title.trim() || !date}
          className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-5 py-3 min-h-[48px] rounded-2xl transition-colors text-sm shimmer-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? '...' : isEdit ? '✓ Guardar' : '💾 Agregar'}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 font-bold px-4 py-3 rounded-2xl transition-colors text-sm"
          whileTap={{ scale: 0.93 }}
        >
          ✕
        </motion.button>
      </div>
    </motion.form>
  )
}
