'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { POMODORO_LABELS } from '@/lib/lectura/readingConfig'
import type { PomodoroType } from '@/lib/lectura/types'

interface Props {
  open: boolean
  onClose: () => void
  onPick: (type: PomodoroType, customMins?: number) => void
}

const PRESETS: PomodoroType[] = ['25-5', '45-15', 'libre', 'custom']

export default function PomodoroConfig({ open, onClose, onPick }: Props) {
  const [focused, setFocused] = useState<PomodoroType | null>(null)
  const [customVal, setCustomVal] = useState<string>('30')

  function handleCustomConfirm() {
    const n = parseInt(customVal, 10)
    if (isNaN(n) || n < 1 || n > 180) return
    onPick('custom', n)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-16 md:pt-24"
          style={{
            background: 'rgba(76, 10, 31, 0.45)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="reading-glass-strong rounded-3xl w-full max-w-md p-6 md:p-8"
          >
            <h2
              className="text-2xl font-bold reading-ink-text mb-1"
              style={{ fontFamily: 'var(--font-playfair), serif' }}
            >
              Cómo querés leer
            </h2>
            <p className="text-sm reading-ink-soft-text italic mb-5">
              Elegí el ritmo para esta sesión.
            </p>

            <motion.div
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3"
            >
              {PRESETS.map((key) => {
                const cfg = POMODORO_LABELS[key]
                const isFocused = focused === key
                return (
                  <motion.button
                    key={key}
                    type="button"
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      if (key === 'custom') {
                        setFocused('custom')
                      } else {
                        onPick(key)
                      }
                    }}
                    className="relative p-4 rounded-2xl text-left transition-colors"
                    style={{
                      background: isFocused
                        ? 'rgba(225, 29, 72, 0.12)'
                        : 'rgba(255, 241, 244, 0.6)',
                      border: isFocused
                        ? '1px solid rgba(225, 29, 72, 0.5)'
                        : '1px solid var(--reading-border)',
                    }}
                  >
                    <div className="text-2xl mb-1">{cfg.emoji}</div>
                    <div
                      className="font-bold text-sm reading-ink-text"
                      style={{ fontFamily: 'var(--font-playfair), serif' }}
                    >
                      {cfg.label}
                    </div>
                    <div className="text-[11px] reading-ink-soft-text mt-0.5">
                      {cfg.work !== null ? `${cfg.work}/${cfg.rest} min` : cfg.hint}
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>

            <AnimatePresence>
              {focused === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 overflow-hidden"
                >
                  <label className="block">
                    <span className="block text-xs font-bold uppercase tracking-wider mb-1.5 reading-ink-soft-text">
                      Minutos (1 a 180)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        inputMode="numeric"
                        value={customVal}
                        onChange={(e) => setCustomVal(e.target.value)}
                        min={1}
                        max={180}
                        className="flex-1 reading-glass rounded-xl px-3 py-2 text-sm reading-ink-text focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleCustomConfirm}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-white shimmer-btn"
                        style={{
                          background:
                            'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                        }}
                      >
                        Empezar
                      </motion.button>
                    </div>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-5 flex justify-end">
              <button
                onClick={onClose}
                className="text-xs reading-ink-soft-text hover:opacity-70"
              >
                cancelar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
