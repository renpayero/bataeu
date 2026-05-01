'use client'

import { motion } from 'framer-motion'
import MemoryFrame from '../MemoryFrame'
import { getFirstMemory, shuffled } from '../memoriesManifest'
import { ANCHOR_QUOTE } from '../cinematicData'

/**
 * Acto 5: Ancla emocional
 * - Una foto llena la pantalla con mucho blur al fondo.
 * - Una cita / mensaje aparece letra por letra en el centro.
 * - Se mantiene quieto unos segundos (respiro narrativo).
 */
export default function Act5Anchor() {
  const pool = shuffled(8, true)
  const bg = pool[0] ?? getFirstMemory()

  const words = ANCHOR_QUOTE.body.split(' ')

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Fondo blureado optimizado: render a baja resolución (200×300) con
          blur(4px), después scale(7) — el blur opera sobre ~60k píxeles en
          vez de 2.4M, es ~100x más cheap. Resultado visual idéntico al
          blur(28px) full-size, pero GPU se queda libre para las palabras. */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ background: '#0b0108' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '200px',
            height: '300px',
            transform: 'translate(-50%, -50%) scale(7) translateZ(0)',
            transformOrigin: 'center',
            filter: 'blur(4px) brightness(0.5) saturate(1.1)',
            willChange: 'transform',
          }}
        >
          <MemoryFrame memory={bg} />
        </div>
      </div>

      {/* Overlay granate */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, transparent 10%, rgba(7,0,8,0.85) 80%)',
        }}
      />

      {/* Cita — palabra por palabra */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <motion.p
            className="text-3xl md:text-5xl font-playfair italic text-white leading-relaxed"
            style={{ textShadow: '0 6px 40px rgba(244, 63, 94, 0.45)' }}
          >
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2"
                style={{ willChange: 'transform, opacity' }}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3 + i * 0.08,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {w}
              </motion.span>
            ))}
          </motion.p>

          {ANCHOR_QUOTE.attribution && (
            <motion.p
              className="mt-5 text-sm text-rose-200/70 tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, delay: 1.5, times: [0, 0.2, 0.85, 1] }}
            >
              — {ANCHOR_QUOTE.attribution}
            </motion.p>
          )}
        </div>
      </div>

      {/* Corner marks: cuatro líneas L en esquinas */}
      {[
        { top: '8%', left: '6%', rotate: 0 },
        { top: '8%', right: '6%', rotate: 90 },
        { bottom: '8%', right: '6%', rotate: 180 },
        { bottom: '8%', left: '6%', rotate: 270 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            ...pos,
            transform: `rotate(${pos.rotate}deg)`,
            width: 32,
            height: 32,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], scale: 1 }}
          transition={{ duration: 5, delay: 0.5 + i * 0.1, times: [0, 0.2, 0.85, 1] }}
        >
          <div className="absolute top-0 left-0 w-full h-[2px] bg-rose-400/70" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-rose-400/70" />
        </motion.div>
      ))}
    </div>
  )
}
