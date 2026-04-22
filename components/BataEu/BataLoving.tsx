'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu enamorado — sostiene un corazón latente entre las manos con cara
 * de bobalicón: ojos en forma de corazón, rubor, sonrisa amplia. Alrededor
 * flotan corazones de distintos tamaños. Para la home de Nosotros.
 */
interface Props {
  className?: string
}

export default function BataLoving({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow rosado */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(244,63,94,0.28), rgba(236,72,153,0.14) 45%, transparent 72%)',
          filter: 'blur(26px)',
        }}
        animate={{ opacity: [0.55, 0.95, 0.55], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Corazones flotando alrededor */}
      {[
        { x: '8%', y: '12%', delay: 0, size: 22, rot: -12 },
        { x: '82%', y: '18%', delay: 0.9, size: 16, rot: 10 },
        { x: '14%', y: '72%', delay: 2.2, size: 14, rot: -8 },
        { x: '78%', y: '68%', delay: 1.5, size: 20, rot: 6 },
        { x: '4%', y: '42%', delay: 3, size: 12, rot: 4 },
      ].map((h, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: h.x, top: h.y, fontSize: h.size, lineHeight: 1 }}
          animate={{
            y: [0, -14, 0],
            opacity: [0, 1, 0],
            scale: [0.7, 1.15, 0.7],
            rotate: [h.rot - 4, h.rot + 4, h.rot - 4],
          }}
          transition={{ duration: 3.4, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          💗
        </motion.span>
      ))}

      <svg
        viewBox="0 0 220 220"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="loveBody" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <radialGradient id="bigHeart" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="50%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>
          <radialGradient id="loveFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="110" cy="206" rx="62" ry="6" fill="url(#loveFloor)" />

        {/* ═══ BATA (cuerpo + idle bounce sutil) ════════════ */}
        <motion.g
          animate={{ y: [0, -3, 0], scale: [1, 1.015, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 180px' }}
        >
          {/* Cuerpo gotita */}
          <path
            d="M110,22 C140,40 156,82 156,120 C156,154 136,186 110,188 C84,186 64,154 64,120 C64,82 80,40 110,22 Z"
            fill="url(#loveBody)"
          />
          {/* Brillo lateral */}
          <ellipse cx="88" cy="56" rx="11" ry="20" fill="rgba(255,255,255,0.18)" transform="rotate(-20, 88, 56)" />

          {/* Pies */}
          <ellipse cx="94" cy="198" rx="8" ry="2.8" fill={P.body.deeper} />
          <ellipse cx="126" cy="198" rx="8" ry="2.8" fill={P.body.deeper} />
          <path d="M94,188 L94,196" stroke={P.body.lo} strokeWidth="5" strokeLinecap="round" />
          <path d="M126,188 L126,196" stroke={P.body.lo} strokeWidth="5" strokeLinecap="round" />

          {/* Brazos que sostienen el corazón grande */}
          <path d="M66,118 Q58,134 86,146" stroke={P.body.lo} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <path d="M154,118 Q162,134 134,146" stroke={P.body.lo} strokeWidth="5.5" fill="none" strokeLinecap="round" />

          {/* ═══ OJOS CORAZÓN ═══════════════════════════════ */}
          <motion.g
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '110px 88px' }}
          >
            {/* Ojo izquierdo corazón */}
            <path
              d="M78,82 C73,76 63,78 64,86 C65,94 78,100 78,100 C78,100 91,94 92,86 C93,78 83,76 78,82 Z"
              fill="#e11d48"
            />
            <circle cx="73" cy="83" r="2" fill="rgba(255,255,255,0.9)" />
            {/* Ojo derecho corazón */}
            <path
              d="M142,82 C137,76 127,78 128,86 C129,94 142,100 142,100 C142,100 155,94 156,86 C157,78 147,76 142,82 Z"
              fill="#e11d48"
            />
            <circle cx="137" cy="83" r="2" fill="rgba(255,255,255,0.9)" />
          </motion.g>

          {/* Cejas bobaliconas (arqueadas arriba) */}
          <path d="M64,70 Q78,65 92,70" stroke={P.inkSoft} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M128,70 Q142,65 156,70" stroke={P.inkSoft} strokeWidth="2.3" fill="none" strokeLinecap="round" />

          {/* Rubor (mejillas rosadas) */}
          <motion.g
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="56" cy="112" r="9" fill="rgba(251,113,133,0.45)" />
            <circle cx="164" cy="112" r="9" fill="rgba(251,113,133,0.45)" />
          </motion.g>

          {/* Sonrisa amplia con dientes */}
          <path d="M86,120 Q110,138 134,120 Q110,128 86,120 Z" fill={P.ink} />
          <path d="M92,122 L92,128 M100,124 L100,130 M110,124 L110,131 M120,124 L120,130 M128,122 L128,128" stroke="white" strokeWidth="1.2" opacity="0.5" />
          {/* Lengua */}
          <ellipse cx="110" cy="128" rx="8" ry="3" fill="#fb7185" />
        </motion.g>

        {/* ═══ CORAZÓN GRANDE (latiendo entre las manos) ═══ */}
        <motion.g
          animate={{ scale: [1, 1.14, 1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 150px' }}
        >
          <path
            d="M110,168 C90,152 74,142 76,128 C78,116 92,114 100,120 C105,124 108,128 110,132 C112,128 115,124 120,120 C128,114 142,116 144,128 C146,142 130,152 110,168 Z"
            fill="url(#bigHeart)"
            stroke="#be123c"
            strokeWidth="1"
          />
          {/* Highlight en el corazón */}
          <ellipse cx="96" cy="128" rx="6" ry="8" fill="rgba(255,255,255,0.35)" transform="rotate(-20, 96, 128)" />
          {/* Sparkle en el centro */}
          <motion.circle
            cx="110" cy="138" r="2"
            fill="white"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
