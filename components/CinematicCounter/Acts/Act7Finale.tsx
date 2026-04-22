'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COUPLE_START_DATE, COUPLE_NAMES } from '@/lib/coupleConfig'
import MemoryFrame from '../MemoryFrame'
import { getFirstMemory } from '../memoriesManifest'
import { FINALE_TEXTS, getTodayEasterEgg } from '../cinematicData'

function daysTogetherNow(): number {
  const start = new Date(COUPLE_START_DATE).getTime()
  const now = Date.now()
  const ms = Math.max(0, now - start)
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

/**
 * Acto 7: Finale
 * - Corte a blanco breve. Fade al negro con primera foto detrás.
 * - Contador "roll" rápido desde 0 hasta N días reales.
 * - Nombres reaparecen abrazando al número.
 * - Confetti desde las 4 esquinas.
 */
export default function Act7Finale() {
  const finalDays = daysTogetherNow()
  const [count, setCount] = useState(0)
  const first = getFirstMemory()
  const easterEgg = getTodayEasterEgg()

  // Roll del contador
  useEffect(() => {
    const rollDurationMs = 2800
    const start = performance.now()
    let raf = 0
    const tick = () => {
      const t = Math.min(1, (performance.now() - start) / rollDurationMs)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(eased * finalDays))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [finalDays])

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Flash blanco entrante */}
      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, times: [0, 0.1, 1] }}
      />

      {/* Primera foto de fondo muy oscurecida */}
      <motion.div
        className="absolute inset-0"
        style={{ filter: 'brightness(0.3) saturate(1.2)' }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 4 }}
      >
        <MemoryFrame memory={first} />
      </motion.div>

      {/* Overlay rosa vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(244,63,94,0.1) 0%, rgba(7,0,8,0.85) 80%)',
        }}
      />

      {/* Contenido central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <motion.p
          className="text-xs uppercase tracking-[0.4em] text-rose-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {FINALE_TEXTS.kicker}
        </motion.p>

        <motion.div
          className="mt-4 flex items-baseline gap-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-8xl md:text-[160px] font-playfair font-bold text-white leading-none tabular-nums"
            style={{ textShadow: '0 10px 50px rgba(244, 63, 94, 0.55)' }}
          >
            {count}
          </span>
        </motion.div>

        <motion.p
          className="mt-2 text-lg md:text-2xl font-playfair italic text-rose-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.6 }}
        >
          {FINALE_TEXTS.daysLabel(finalDays).replace(`${finalDays} `, '')}
        </motion.p>

        {/* Nombres grandes con corazón */}
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-2xl md:text-3xl font-playfair text-white"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            {COUPLE_NAMES.name1}
          </span>
          <motion.span
            className="text-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {FINALE_TEXTS.heartSymbol}
          </motion.span>
          <span
            className="text-2xl md:text-3xl font-playfair text-white"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.6)' }}
          >
            {COUPLE_NAMES.name2}
          </span>
        </motion.div>

        <motion.p
          className="mt-6 text-sm md:text-base text-rose-200/80 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ duration: 2.5, delay: 5, times: [0, 0.3, 1] }}
        >
          {FINALE_TEXTS.closingLine}
        </motion.p>

        {/* Easter egg overlay — solo si hoy es fecha especial */}
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 5.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-full"
            style={{
              background:
                'linear-gradient(135deg, rgba(244, 63, 94, 0.22), rgba(251, 191, 36, 0.18))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              boxShadow: '0 6px 30px rgba(244, 63, 94, 0.35)',
            }}
          >
            <span className="text-[10px] uppercase tracking-[0.35em] text-rose-100">
              {easterEgg.kicker}
            </span>
            <span
              className="font-playfair italic text-sm md:text-base text-white"
              style={{ textShadow: '0 2px 16px rgba(251, 191, 36, 0.6)' }}
            >
              {easterEgg.message}
            </span>
          </motion.div>
        )}
      </div>

      {/* Confetti desde 4 esquinas */}
      <AnimatePresence>
        {Array.from({ length: 28 }, (_, i) => {
          // 7 por esquina
          const corner = i % 4
          const variance = Math.floor(i / 4)
          const origins = [
            { x: 0, y: 0, vx: [0, 300 + variance * 30, 800], vy: [0, -150 + variance * 20, 250] },
            { x: '100%', y: 0, vx: [0, -300 - variance * 30, -800], vy: [0, -150 + variance * 20, 250] },
            { x: 0, y: '100%', vx: [0, 300 + variance * 30, 800], vy: [0, -300 - variance * 20, -150] },
            { x: '100%', y: '100%', vx: [0, -300 - variance * 30, -800], vy: [0, -300 - variance * 20, -150] },
          ]
          const o = origins[corner]
          const emojis = ['💕', '✨', '🌟', '⭐', '💞', '🎀']
          const emoji = emojis[i % emojis.length]
          return (
            <motion.span
              key={`c-${i}`}
              className="absolute text-2xl pointer-events-none select-none"
              style={{ left: o.x, top: o.y }}
              initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.6 }}
              animate={{
                x: o.vx,
                y: o.vy,
                opacity: [0, 1, 0],
                rotate: corner % 2 === 0 ? 360 : -360,
                scale: [0.6, 1.1, 0.8],
              }}
              transition={{
                duration: 2.6 + variance * 0.2,
                delay: 3 + (i % 4) * 0.1 + variance * 0.15,
                times: [0, 0.5, 1],
                ease: 'easeOut',
              }}
            >
              {emoji}
            </motion.span>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
