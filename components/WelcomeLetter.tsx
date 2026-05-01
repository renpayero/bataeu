'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WelcomeLetterContent } from '@/lib/welcomeLetters'

interface Props {
  content: WelcomeLetterContent
}

export default function WelcomeLetter({ content }: Props) {
  const [open, setOpen] = useState(false)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem(content.storageKey)
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 500)
        return () => clearTimeout(t)
      }
    } catch {
      // SSR / privado
    }
  }, [content.storageKey])

  function close() {
    try {
      localStorage.setItem(content.storageKey, new Date().toISOString())
    } catch {
      // ignore
    }
    setOpen(false)
  }

  const envelopeBg = `linear-gradient(145deg, ${content.envelope.from}, ${content.envelope.via}, ${content.envelope.to})`
  const sealBg = `radial-gradient(circle, ${content.envelope.via} 0%, ${content.envelope.to} 80%)`
  const buttonBg = `linear-gradient(135deg, ${content.buttonGradient.from}, ${content.buttonGradient.to})`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4"
          style={{ background: 'rgba(20, 6, 24, 0.55)', backdropFilter: 'blur(10px)' }}
        >
          <motion.button
            onClick={() => !opened && setOpened(true)}
            className="relative w-full max-w-md text-left"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <AnimatePresence mode="wait">
              {!opened ? (
                <motion.div
                  key="envelope"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[3/2] rounded-2xl overflow-hidden"
                  style={{
                    background: envelopeBg,
                    boxShadow:
                      '0 18px 48px rgba(20,6,24,0.45), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                  whileHover={{ scale: 1.02, rotate: -1 }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 50%)',
                      clipPath: 'polygon(0 0, 100% 0, 50% 55%)',
                    }}
                  />
                  <div
                    className="absolute bottom-[32%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: sealBg,
                      color: 'white',
                      fontFamily: 'var(--font-playfair), serif',
                      fontSize: 28,
                      fontWeight: 700,
                      border: '2px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    {content.seal}
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
                  className="rounded-2xl shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, #fffaf3 0%, #fef3c7 100%)',
                    border: '1px solid rgba(180, 83, 9, 0.15)',
                    boxShadow:
                      '0 25px 70px rgba(20,6,24,0.4), inset 0 0 80px rgba(225, 29, 72, 0.05)',
                  }}
                >
                  <div className="overflow-y-auto overscroll-contain px-8 md:px-10 pt-8 md:pt-10 pb-2">
                    <p
                      className="text-xs uppercase tracking-widest mb-3"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        color: '#a16207',
                      }}
                    >
                      {content.heading}
                    </p>
                    <p
                      className="text-base md:text-lg leading-relaxed whitespace-pre-line"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontStyle: 'italic',
                        color: '#451a03',
                      }}
                    >
                      {content.body}
                    </p>
                    <p
                      className="mt-6 text-right"
                      style={{
                        fontFamily: 'var(--font-playfair), serif',
                        fontSize: 22,
                        color: '#451a03',
                      }}
                    >
                      {content.signature}
                    </p>
                  </div>

                  <div className="px-8 md:px-10 pb-8 md:pb-10 pt-4 shrink-0">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        close()
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 rounded-2xl font-bold text-sm shimmer-btn"
                      style={{
                        background: buttonBg,
                        color: 'white',
                      }}
                    >
                      {content.buttonLabel}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
