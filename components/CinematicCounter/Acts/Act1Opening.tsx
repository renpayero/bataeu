'use client'

import { motion } from 'framer-motion'
import { COUPLE_NAMES } from '@/lib/coupleConfig'
import { OPENING_LABEL } from '../cinematicData'

/**
 * Acto 1: Apertura
 * - Negro total, un hairline cruza la pantalla de izquierda a derecha.
 * - El "kicker" aparece desde top-left con slide horizontal.
 * - Los nombres caen desde arriba al centro, con separador "&" que gira.
 */
export default function Act1Opening() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#070008' }}>
      {/* Hairline horizontal */}
      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(244,63,94,0.9) 50%, transparent 100%)',
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4, times: [0, 0.35, 0.75, 1], ease: 'easeInOut' }}
      />

      {/* Kicker desde top-left */}
      <motion.p
        className="absolute top-[14%] left-[8%] text-sm md:text-base uppercase tracking-[0.4em] font-semibold text-rose-50"
        style={{
          textShadow:
            '0 2px 18px rgba(244, 63, 94, 0.85), 0 0 32px rgba(0,0,0,0.9)',
        }}
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3.5, delay: 0.6, times: [0, 0.2, 0.8, 1] }}
      >
        {OPENING_LABEL.kicker}
      </motion.p>

      {/* Fecha pequeña desde bottom-right */}
      <motion.p
        className="absolute bottom-[14%] right-[8%] text-xs md:text-sm uppercase tracking-[0.3em] font-medium text-rose-100"
        style={{
          textShadow:
            '0 2px 14px rgba(244, 63, 94, 0.7), 0 0 24px rgba(0,0,0,0.85)',
        }}
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3.5, delay: 1, times: [0, 0.3, 0.85, 1] }}
      >
        un relato en imágenes
      </motion.p>

      {/* Nombres al centro — caen desde arriba con stagger */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="flex items-baseline gap-4 md:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.8, delay: 0.8, times: [0, 0.18, 0.85, 1] }}
        >
          <motion.span
            className="text-5xl md:text-7xl font-playfair text-white"
            initial={{ y: -60, filter: 'blur(18px)' }}
            animate={{ y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ textShadow: '0 4px 40px rgba(244, 63, 94, 0.45)' }}
          >
            {COUPLE_NAMES.name1}
          </motion.span>
          <motion.span
            className="text-3xl md:text-5xl text-rose-400"
            initial={{ rotate: -180, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.4, ease: 'backOut' }}
            style={{ fontFamily: 'var(--font-playfair), serif', fontStyle: 'italic' }}
          >
            &
          </motion.span>
          <motion.span
            className="text-5xl md:text-7xl font-playfair text-white"
            initial={{ y: -60, filter: 'blur(18px)' }}
            animate={{ y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ textShadow: '0 4px 40px rgba(244, 63, 94, 0.45)' }}
          >
            {COUPLE_NAMES.name2}
          </motion.span>
        </motion.div>
      </div>

      {/* Gradient vignette que se expande desde el centro */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 0%, rgba(7,0,8,0.7) 80%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.3, 1] }}
      />
    </div>
  )
}
