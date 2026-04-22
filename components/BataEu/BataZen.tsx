'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu zen — meditando en posición de loto, ojos cerrados, con un reloj
 * de arena al lado donde la arena cae animada. Anillos de aura expanden
 * desde su alrededor. Respiración marcada, leve flotar, pequeños símbolos
 * "✧" de foco orbitando la cabeza como partículas de concentración.
 */
interface Props {
  className?: string
}

export default function BataZen({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Halo aura concéntrico */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(225,29,72,0.22), rgba(198,139,90,0.12) 45%, transparent 72%)',
          filter: 'blur(26px)',
        }}
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Anillos de aura que expanden */}
      {[0, 1.2, 2.4].map((delay) => (
        <motion.div
          key={delay}
          className="absolute inset-0 -z-10 rounded-full border pointer-events-none"
          style={{ borderColor: 'rgba(225, 29, 72, 0.25)' }}
          animate={{ scale: [0.6, 1.35], opacity: [0.7, 0] }}
          transition={{ duration: 3.6, delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {/* Partículas de concentración orbitando */}
      <motion.span
        className="absolute text-xs select-none pointer-events-none"
        style={{ color: 'rgba(198,139,90,0.8)', top: '8%', left: '50%' }}
        animate={{ rotate: 360, scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ display: 'inline-block', transform: 'translate(-50%, -50%) translateY(-32px)' }}>
          ✧
        </span>
      </motion.span>
      <motion.span
        className="absolute text-xs select-none pointer-events-none"
        style={{ color: 'rgba(198,139,90,0.6)', top: '50%', left: '8%' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        <span style={{ display: 'inline-block', transform: 'translate(-50%, -50%) translateX(-36px)' }}>
          ✦
        </span>
      </motion.span>

      <svg
        viewBox="0 0 220 210"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="zenBody" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <linearGradient id="hourglassWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#3d1f0f" />
          </linearGradient>
          <linearGradient id="sandTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#c68b5a" />
          </linearGradient>
          <linearGradient id="sandBot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c68b5a" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <radialGradient id="zenFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="110" cy="196" rx="80" ry="7" fill="url(#zenFloor)" />

        {/* Cojín / almohadón bajo Bata */}
        <ellipse cx="110" cy="188" rx="58" ry="10" fill="#7f1d1d" />
        <ellipse cx="110" cy="186" rx="58" ry="10" fill="#9f1239" />
        <path d="M58,186 Q62,176 74,180 M146,186 Q142,176 158,180" stroke="#4c0519" strokeWidth="1.5" fill="none" opacity="0.4" />
        {/* Borlas del cojín */}
        <circle cx="56" cy="186" r="3" fill={P.gold} />
        <circle cx="164" cy="186" r="3" fill={P.gold} />

        {/* ═══ BATA en posición loto — respiración pronunciada ═══ */}
        <motion.g
          animate={{ scale: [1, 1.03, 1], y: [0, -2, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 170px' }}
        >
          {/* Cuerpo achatado (sentado estable en loto) */}
          <path
            d="M110,40 C138,56 152,96 152,138 C152,168 134,184 110,184 C86,184 68,168 68,138 C68,96 82,56 110,40 Z"
            fill="url(#zenBody)"
          />
          <ellipse cx="90" cy="70" rx="11" ry="18" fill="rgba(255,255,255,0.17)" transform="rotate(-20, 90, 70)" />

          {/* Piernas cruzadas (loto completo — visibles) */}
          <path
            d="M72,162 Q88,174 110,172 Q132,174 148,162 Q146,178 128,182 L92,182 Q74,178 72,162 Z"
            fill={P.body.deeper}
          />
          <path d="M86,168 Q98,172 110,172 Q122,172 134,168" stroke={P.body.deepest} strokeWidth="1" fill="none" opacity="0.6" />

          {/* Brazos en mudra (manos juntas en el regazo, palmas arriba) */}
          <path d="M78,128 Q68,148 96,156" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M142,128 Q152,148 124,156" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Manos (palmas) */}
          <ellipse cx="110" cy="156" rx="14" ry="4" fill={P.body.lo} />
          <ellipse cx="110" cy="155" rx="12" ry="3" fill={P.body.mid} />

          {/* Ojos cerrados — meditando */}
          <path d="M88,92 Q96,88 104,92" stroke={P.ink} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M116,92 Q124,88 132,92" stroke={P.ink} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          {/* Pestañas debajo */}
          <line x1="93" y1="94" x2="91" y2="96" stroke={P.ink} strokeWidth="1" strokeLinecap="round" />
          <line x1="98" y1="94" x2="98" y2="96.5" stroke={P.ink} strokeWidth="1" strokeLinecap="round" />
          <line x1="121" y1="94" x2="121" y2="96.5" stroke={P.ink} strokeWidth="1" strokeLinecap="round" />
          <line x1="127" y1="94" x2="129" y2="96" stroke={P.ink} strokeWidth="1" strokeLinecap="round" />

          {/* Cejas neutras */}
          <path d="M84,82 Q96,80 108,82" stroke={P.inkSoft} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M112,82 Q124,80 136,82" stroke={P.inkSoft} strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Tercer ojo — bindi de concentración */}
          <motion.circle
            cx="110" cy="72" r="2" fill={P.gold}
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Boca — sonrisa serena */}
          <path d="M100,115 Q110,120 120,115" stroke={P.ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* ═══ RELOJ DE ARENA al costado ═══════════════════════ */}
        <g transform="translate(178, 128)">
          {/* Sombra base */}
          <ellipse cx="14" cy="60" rx="16" ry="3" fill={P.shadow} />
          {/* Base inferior */}
          <rect x="0" y="54" width="28" height="6" rx="1.5" fill="url(#hourglassWood)" />
          {/* Base superior */}
          <rect x="0" y="0" width="28" height="6" rx="1.5" fill="url(#hourglassWood)" />
          {/* Vidrio — dos campanas */}
          <path d="M4,6 L24,6 Q22,20 14,28 Q6,20 4,6 Z" fill="rgba(253,232,196,0.25)" stroke="#78350f" strokeWidth="0.8" />
          <path d="M4,54 L24,54 Q22,40 14,32 Q6,40 4,54 Z" fill="rgba(253,232,196,0.25)" stroke="#78350f" strokeWidth="0.8" />

          {/* Arena arriba (se vacía) */}
          <motion.path
            d="M5,6 L23,6 Q22,16 14,26 Q6,16 5,6 Z"
            fill="url(#sandTop)"
            animate={{ scaleY: [1, 0.18, 1], d: undefined }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '14px 6px', transformBox: 'fill-box' }}
          />
          {/* Arena abajo (se llena) */}
          <motion.path
            d="M5,54 L23,54 Q22,44 14,34 Q6,44 5,54 Z"
            fill="url(#sandBot)"
            animate={{ scaleY: [0.22, 1, 0.22] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '14px 54px', transformBox: 'fill-box' }}
          />
          {/* Arena cayendo (hilito) */}
          <motion.line
            x1="14" y1="28" x2="14" y2="34"
            stroke="#c68b5a" strokeWidth="1.2" strokeLinecap="round"
            animate={{ opacity: [0.9, 0.95, 0.9] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          {/* Granitos sueltos */}
          <motion.circle
            cx="14" cy="28" r="0.6" fill="#fde68a"
            animate={{ y: [0, 6] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          />
        </g>

        {/* Flor de loto decorativa al costado izquierdo */}
        <g transform="translate(16, 170)" opacity="0.8">
          <path d="M10,10 Q4,4 10,-2 Q16,4 10,10 Z" fill="#fbcfe8" />
          <path d="M4,14 Q-4,12 -2,4 Q8,6 4,14 Z" fill="#f9a8d4" />
          <path d="M16,14 Q24,12 22,4 Q12,6 16,14 Z" fill="#f9a8d4" />
          <circle cx="10" cy="10" r="2" fill={P.gold} />
        </g>
      </svg>
    </div>
  )
}
