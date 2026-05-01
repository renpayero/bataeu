'use client'

import { motion } from 'framer-motion'
import MemoryFrame from '../MemoryFrame'
import { getFirstMemory } from '../memoriesManifest'
import { ORIGIN_TEXTS } from '../cinematicData'

/**
 * Acto 2: Origen
 * - La primera foto entra grande con blur → foco y dolly lento.
 * - Badge "La primera foto juntos" aparece en top-right.
 * - Dos líneas de copy pop-in en bottom-left (stagger) con parallax.
 * - Vignette rosa envuelve los bordes.
 */
export default function Act2Origin() {
  const first = getFirstMemory()

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Foto hero — entra con blur + scale down + leve pan.
          Scale mínimo 1.18 para que aún con el pan no se vea borde negro. */}
      <motion.div
        className="absolute inset-0"
        style={{ willChange: 'transform, opacity' }}
        initial={{ scale: 1.4, filter: 'blur(20px)', opacity: 0 }}
        animate={{
          scale: [1.4, 1.18, 1.22],
          filter: ['blur(20px)', 'blur(0px)', 'blur(0px)'],
          opacity: [0, 1, 1],
          x: ['0%', '-2%', '-3.5%'],
          y: ['0%', '1%', '2%'],
        }}
        transition={{
          duration: 5.5,
          times: [0, 0.28, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <MemoryFrame memory={first} />
      </motion.div>

      {/* Overlay gradient para legibilidad del texto */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,0,8,0.25) 0%, transparent 35%, transparent 55%, rgba(7,0,8,0.85) 100%), linear-gradient(90deg, rgba(7,0,8,0.55) 0%, transparent 50%)',
        }}
      />

      {/* Badge top-right — en mobile usa right-3 para no salir de viewport */}
      <motion.div
        className="absolute top-[10%] right-3 sm:right-[7%] flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: 'rgba(244, 63, 94, 0.18)',
          border: '1px solid rgba(244, 63, 94, 0.5)',
          backdropFilter: 'blur(10px)',
          willChange: 'transform, opacity',
        }}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: 5, delay: 1, times: [0, 0.15, 0.45, 0.9, 1] }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.25em] text-rose-100 whitespace-nowrap">
          {ORIGIN_TEXTS.badge}
        </span>
      </motion.div>

      {/* Día 1 — número gigante en top-left con paralaje leve */}
      <motion.div
        className="absolute top-[10%] left-3 sm:left-[6%] flex flex-col"
        style={{ willChange: 'transform, opacity' }}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: [0, 1, 1, 0], y: 0 }}
        transition={{ duration: 5, delay: 0.8, times: [0, 0.2, 0.85, 1] }}
      >
        <span className="text-[11px] uppercase tracking-[0.3em] text-rose-200/80">
          Día
        </span>
        <span
          className="text-7xl md:text-[112px] font-playfair leading-none text-white"
          style={{ textShadow: '0 6px 40px rgba(0,0,0,0.6)' }}
        >
          1
        </span>
      </motion.div>

      {/* Copy desde bottom-left — pan reducido en mobile */}
      <motion.div
        className="absolute bottom-[12%] left-3 sm:left-[6%] right-3 sm:right-auto max-w-md"
        style={{ willChange: 'transform, opacity' }}
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4.5, delay: 2, times: [0, 0.2, 0.85, 1] }}
      >
        <p
          className="text-2xl md:text-4xl font-playfair italic text-white leading-tight"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}
        >
          {ORIGIN_TEXTS.line1}
        </p>
        <motion.p
          className="mt-2 text-base md:text-xl text-rose-100/80 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.5, delay: 2.8, times: [0, 0.2, 0.85, 1] }}
        >
          {ORIGIN_TEXTS.line2}
        </motion.p>
      </motion.div>
    </div>
  )
}
