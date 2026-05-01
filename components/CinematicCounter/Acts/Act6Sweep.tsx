'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import MemoryFrame from '../MemoryFrame'
import { shuffled } from '../memoriesManifest'
import { SWEEP_TAGLINE, FLOATING_WORDS } from '../cinematicData'

/**
 * Acto 6: Sweep — el tren de memorias.
 * - 6 tarjetas que entran con stagger muy rápido, cada una desde una
 *   dirección distinta; se acomodan en un carrusel abanico y giran.
 * - Palabras flotantes aparecen por detrás con parallax.
 * - Línea diagonal de luz cruza la escena al cierre.
 */
export default function Act6Sweep() {
  const pool = shuffled(23, true).slice(0, 6)

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Direcciones de entrada (x, y, rotate) — más cortas en mobile para no
  // sobreesfuerzo de animación.
  const enters = isMobile
    ? [
        { x: -250, y: -120, rotate: -22 },
        { x: 250, y: -120, rotate: 22 },
        { x: -250, y: 120, rotate: 16 },
        { x: 250, y: 120, rotate: -16 },
        { x: 0, y: -300, rotate: 6 },
        { x: 0, y: 300, rotate: -6 },
      ]
    : [
        { x: -600, y: -200, rotate: -24 },
        { x: 600, y: -200, rotate: 24 },
        { x: -600, y: 200, rotate: 18 },
        { x: 600, y: 200, rotate: -18 },
        { x: 0, y: -500, rotate: 6 },
        { x: 0, y: 500, rotate: -6 },
      ]

  // Posiciones finales en abanico horizontal (x offset en px desde center).
  // Mobile: spread ~270px (cabe en 390px viewport); desktop: spread ~960px.
  const fanPositions = isMobile
    ? [-135, -82, -28, 28, 82, 135]
    : [-480, -285, -92, 92, 285, 480]

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#050007]">
      {/* Palabras flotantes */}
      {FLOATING_WORDS.slice(0, 8).map((w, i) => {
        const top = 10 + ((i * 37) % 80)
        const left = (i * 13 + 5) % 85
        return (
          <motion.span
            key={w}
            className="absolute text-xs md:text-sm uppercase tracking-[0.32em] font-playfair italic text-rose-50 pointer-events-none"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              textShadow: '0 2px 18px rgba(244, 63, 94, 0.7), 0 0 40px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 0.95, 0.95, 0], y: -20 }}
            transition={{
              duration: 5.5,
              delay: 0.3 + (i % 4) * 0.3,
              times: [0, 0.2, 0.8, 1],
            }}
          >
            {w}
          </motion.span>
        )
      })}

      {/* Abanico de fotos */}
      <div className="absolute inset-0 flex items-center justify-center">
        {pool.map((mem, i) => (
          <motion.div
            key={mem.src}
            className="absolute w-[22vw] sm:w-[28vw] max-w-[260px] aspect-[3/4] rounded-xl overflow-hidden"
            style={{
              boxShadow: '0 25px 60px -12px rgba(244,63,94,0.55)',
              willChange: 'transform, opacity',
            }}
            initial={{ x: enters[i].x, y: enters[i].y, rotate: enters[i].rotate, opacity: 0, scale: 0.7 }}
            animate={{
              x: [enters[i].x, fanPositions[i], fanPositions[i] * 1.03, fanPositions[i] * 0.97],
              y: [enters[i].y, 0, -8, 8],
              rotate: [enters[i].rotate, (i - 2.5) * 6, (i - 2.5) * 6 + 2, (i - 2.5) * 6 - 2],
              scale: [0.7, 1, 1, 1],
              opacity: [0, 1, 1, 0.25],
            }}
            transition={{
              duration: 5.5,
              delay: i * 0.08,
              times: [0, 0.25, 0.7, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <MemoryFrame memory={mem} />
          </motion.div>
        ))}
      </div>

      {/* Diagonal light sweep al final */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '-20%',
          right: '-20%',
          bottom: '-20%',
          background:
            'linear-gradient(135deg, transparent 45%, rgba(255,255,255,0.35) 50%, transparent 55%)',
          transformOrigin: 'center',
        }}
        initial={{ x: '-100%', y: '-100%', opacity: 0 }}
        animate={{ x: '100%', y: '100%', opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, delay: 3.5, times: [0, 0.5, 1], ease: 'easeInOut' }}
      />

      {/* Tagline desde bottom-left */}
      <motion.p
        className="absolute bottom-[8%] left-[6%] text-xs md:text-sm uppercase tracking-[0.35em] text-rose-100/80"
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4.5, delay: 0.8, times: [0, 0.2, 0.85, 1] }}
      >
        {SWEEP_TAGLINE}
      </motion.p>
    </div>
  )
}
