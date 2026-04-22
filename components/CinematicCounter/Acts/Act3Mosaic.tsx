'use client'

import { motion } from 'framer-motion'
import MemoryFrame from '../MemoryFrame'
import { shuffled } from '../memoriesManifest'
import { MOSAIC_TITLE } from '../cinematicData'

// Cuatro memorias entran desde las 4 esquinas distintas. El título flota en
// el centro mientras los cuadrantes se acomodan.
export default function Act3Mosaic() {
  const pool = shuffled(42, true)
  const cells = [pool[0], pool[1], pool[2], pool[3]].filter(Boolean)

  const corners: Array<{
    initial: { x: number; y: number; rotate: number }
    gridArea: string
    objectPosition: string
  }> = [
    { initial: { x: -300, y: -300, rotate: -12 }, gridArea: '1 / 1 / 2 / 2', objectPosition: 'center 35%' }, // top-left: sube apenas para no cortar la frente
    { initial: { x: 300, y: -300, rotate: 10 }, gridArea: '1 / 2 / 2 / 3', objectPosition: 'center' },       // top-right
    { initial: { x: -300, y: 300, rotate: 8 }, gridArea: '2 / 1 / 3 / 2', objectPosition: 'center 25%' },    // bottom-left: prioriza las caras
    { initial: { x: 300, y: 300, rotate: -6 }, gridArea: '2 / 2 / 3 / 3', objectPosition: 'center 25%' },    // bottom-right: prioriza las caras
  ]

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0108]">
      {/* Grid 2x2 */}
      <div
        className="absolute inset-6 md:inset-12 grid gap-3 md:gap-5"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
        }}
      >
        {cells.map((mem, i) => (
          <motion.div
            key={mem.src}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
              gridArea: corners[i].gridArea,
              boxShadow: '0 20px 60px -10px rgba(244,63,94,0.35)',
            }}
            initial={{ ...corners[i].initial, opacity: 0, scale: 0.8 }}
            animate={{
              x: [corners[i].initial.x, 0, 0, 0],
              y: [corners[i].initial.y, 0, 0, 0],
              rotate: [corners[i].initial.rotate, 0, 0, corners[i].initial.rotate * 0.3],
              scale: [0.8, 1, 1.02, 1],
              opacity: [0, 1, 1, 0.3],
            }}
            transition={{
              duration: 6.5,
              delay: i * 0.12,
              times: [0, 0.2, 0.85, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <MemoryFrame memory={mem} style={{ objectPosition: corners[i].objectPosition }} />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, transparent 60%, rgba(244, 63, 94, 0.25) 100%)',
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Título flotante central — aparece, palpita y se desvanece */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: [0, 0, 1, 1, 0],
          scale: [0.85, 0.85, 1, 1.04, 1.1],
        }}
        transition={{ duration: 6.5, times: [0, 0.25, 0.45, 0.75, 1] }}
      >
        <div
          className="px-6 py-3 rounded-full"
          style={{
            background: 'rgba(7, 0, 8, 0.55)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
          }}
        >
          <span
            className="text-2xl md:text-4xl font-playfair italic text-white"
            style={{ textShadow: '0 4px 30px rgba(244, 63, 94, 0.6)' }}
          >
            {MOSAIC_TITLE}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
