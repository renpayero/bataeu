'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MemoryFrame from '../MemoryFrame'
import { shuffled } from '../memoriesManifest'
import { CRESCENDO_TITLE } from '../cinematicData'

interface SpecialDate {
  id: number
  title: string
  date: string
  emoji: string
}

// Acto 4: barrido horizontal tipo "ticker cinematográfico". Cada 1.2s
// entra una memoria desde derecha con un título que viene desde izquierda.
// Usa la API /api/dates para tomar special dates reales.
export default function Act4Crescendo() {
  const pool = shuffled(17, true)
  const [dates, setDates] = useState<SpecialDate[]>([])

  useEffect(() => {
    fetch('/api/dates')
      .then((r) => r.json())
      .then((d: SpecialDate[]) => setDates(Array.isArray(d) ? d : []))
      .catch(() => setDates([]))
  }, [])

  const BEAT_MS = 1500
  const visibleCount = 4 // cuántos "beats" caben en el acto (6000/1500)
  const beats = Array.from({ length: visibleCount }, (_, i) => i)

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0108]">
      {/* Título en top-left — entra desde la izquierda con un dot rosa
          pulsante al lado, después flota suavemente con un breathing leve. */}
      <motion.div
        className="absolute top-[8%] left-3 sm:left-[7%] right-3 sm:right-auto flex items-center gap-2 z-10"
        style={{ willChange: 'transform, opacity' }}
        initial={{ opacity: 0, x: -40 }}
        animate={{
          opacity: 1,
          x: 0,
          y: [0, -2, 0, 2, 0],
        }}
        transition={{
          opacity: { duration: 0.8 },
          x: { duration: 0.8 },
          y: { duration: 5, ease: 'easeInOut', repeat: Infinity, delay: 0.8 },
        }}
      >
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
        />
        <motion.p
          className="text-xs uppercase tracking-[0.35em] text-rose-200/80"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
        >
          {CRESCENDO_TITLE}
        </motion.p>
      </motion.div>

      <AnimatePresence mode="sync">
        {beats.map((beatIndex) => {
          const mem = pool[beatIndex % pool.length]
          const special = dates[beatIndex % Math.max(dates.length, 1)] as SpecialDate | undefined

          return (
            <motion.div
              key={`beat-${beatIndex}`}
              className="absolute inset-0 flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{
                duration: BEAT_MS / 1000,
                delay: beatIndex * (BEAT_MS / 1000),
                times: [0, 0.1, 0.75, 1],
              }}
            >
              {/* Memoria entra desde derecha */}
              <motion.div
                className="relative w-[55vw] max-w-[560px] aspect-[4/3] rounded-xl overflow-hidden ml-auto mr-[8%]"
                style={{
                  boxShadow: '0 30px 80px -12px rgba(244,63,94,0.5)',
                }}
                initial={{ x: 600, rotate: 6, scale: 0.9 }}
                animate={{ x: 0, rotate: 0, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: beatIndex * (BEAT_MS / 1000),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {mem && <MemoryFrame memory={mem} />}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(7,0,8,0.75) 0%, transparent 40%)',
                  }}
                />
              </motion.div>

              {/* Título desde la izquierda */}
              <motion.div
                className="absolute left-[8%] max-w-[40vw]"
                initial={{ x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: beatIndex * (BEAT_MS / 1000) + 0.3,
                }}
              >
                {special ? (
                  <>
                    <span className="text-4xl md:text-5xl">{special.emoji}</span>
                    <p
                      className="mt-1 text-xl md:text-3xl font-playfair italic text-white leading-tight"
                      style={{ textShadow: '0 3px 20px rgba(0,0,0,0.8)' }}
                    >
                      {special.title}
                    </p>
                  </>
                ) : (
                  <p
                    className="text-xl md:text-3xl font-playfair italic text-rose-100 leading-tight"
                    style={{ textShadow: '0 3px 20px rgba(0,0,0,0.8)' }}
                  >
                    Un momento más
                  </p>
                )}
              </motion.div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
