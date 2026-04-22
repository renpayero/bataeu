'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FIRST_ENTRY_LETTER, READER_NAME } from '@/lib/lectura/readingConfig'

const STORAGE_KEY = 'reading_onboarded_v1'

export default function WelcomeLetter() {
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY)
      if (!seen) {
        setTimeout(() => setOpen(true), 500)
      }
    } catch {
      // SSR / privado
    }
  }, [])

  function close() {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString())
    } catch {
      // ignore
    }
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ background: 'rgba(76, 10, 31, 0.55)', backdropFilter: 'blur(10px)' }}
        >
          <motion.button
            onClick={() => !opened && setOpened(true)}
            className="relative w-full max-w-md text-left"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            {/* Sobre cerrado */}
            <AnimatePresence mode="wait">
              {!opened ? (
                <motion.div
                  key="envelope"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[3/2] rounded-2xl overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(145deg, #f5c987, #d97706, #b45309)',
                    boxShadow:
                      '0 18px 48px rgba(76,10,31,0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                  whileHover={{ scale: 1.02, rotate: -1 }}
                >
                  {/* Solapa triangular */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(190, 18, 60, 0.9) 0%, rgba(190, 18, 60, 0) 50%)',
                      clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                    }}
                  />
                  {/* Sello */}
                  <div
                    className="absolute bottom-[32%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: 'radial-gradient(circle, #b45867 0%, #831843 80%)',
                      color: 'white',
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: 28,
                      fontWeight: 700,
                      border: '2px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    R
                  </div>
                  <p
                    className="absolute bottom-5 left-0 right-0 text-center text-white/90 text-xs tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    Tocá para abrir
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, rotateX: -40, y: -60 }}
                  animate={{ opacity: 1, rotateX: 0, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  className="reading-paper-bg rounded-2xl p-8 md:p-10 shadow-2xl"
                  style={{
                    border: '1px solid var(--reading-border)',
                    boxShadow:
                      '0 25px 70px rgba(76,10,31,0.4), inset 0 0 80px rgba(225, 29, 72, 0.05)',
                  }}
                >
                  <p
                    className="text-xs uppercase tracking-widest reading-ink-faded mb-3"
                    style={{ fontFamily: 'var(--font-playfair), serif' }}
                  >
                    {FIRST_ENTRY_LETTER.heading}
                  </p>
                  <p
                    className="text-lg reading-ink-text leading-relaxed whitespace-pre-line"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontStyle: 'italic',
                    }}
                  >
                    {FIRST_ENTRY_LETTER.body.replace('{name}', READER_NAME)}
                  </p>
                  <p
                    className="mt-6 text-right reading-ink-text"
                    style={{
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: 22,
                    }}
                  >
                    {FIRST_ENTRY_LETTER.signature}
                  </p>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      close()
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-8 w-full py-3 rounded-2xl font-bold text-sm shimmer-btn"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--reading-accent), var(--reading-accent-deep))',
                      color: 'white',
                    }}
                  >
                    Entrar a mi rincón
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
