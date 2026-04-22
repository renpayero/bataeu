'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface Props {
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}

export default function CinematicFeedToggle({ value, onChange, disabled }: Props) {
  const [saving, setSaving] = useState(false)

  async function toggle() {
    if (saving || disabled) return
    const next = !value
    setSaving(true)
    try {
      const res = await fetch('/api/galeria/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryFeedsCinematic: next }),
      })
      if (!res.ok) throw new Error('patch failed')
      onChange(next)
    } catch {
      // noop: mantenemos el valor previo
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass-strong rounded-3xl p-5 md:p-6 border-rose-200/70">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-rose-600 mb-1">
            Revivir nuestra historia
          </h3>
          <p className="text-sm text-rose-900/70 leading-relaxed">
            {value
              ? 'Las fotos de la galería ya están apareciendo en la cinemática (la primera foto nunca cambia).'
              : 'Cuando actives esto, las fotos de la galería empezarán a aparecer en "Revivir nuestra historia". La primera foto nunca cambia.'}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={toggle}
          disabled={saving || disabled}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${
            value ? 'bg-rose-500' : 'bg-rose-200'
          } ${saving || disabled ? 'opacity-60' : ''}`}
          aria-pressed={value}
          aria-label="Activar feed cinemático"
        >
          <motion.span
            className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
            animate={{ left: value ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </motion.button>
      </div>
    </div>
  )
}
