'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu dormido — acurrucado sobre un libro cerrado que hace de almohada.
 * Para empty states, loading states o pantallas "todavía sin nada". Respira
 * lento, los ZZZ flotan, pestañas cerradas.
 */
interface Props {
  className?: string
}

export default function BataSleepy({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Halo tenue */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 55%, rgba(225,29,72,0.16), rgba(198,139,90,0.08) 50%, transparent 72%)',
          filter: 'blur(22px)',
        }}
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ZZZ flotando — tres con delays */}
      {[
        { x: '58%', y: '8%', delay: 0, size: 26 },
        { x: '68%', y: '18%', delay: 1.2, size: 20 },
        { x: '76%', y: '28%', delay: 2.4, size: 16 },
      ].map((z, i) => (
        <motion.span
          key={i}
          className="absolute font-bold select-none pointer-events-none"
          style={{
            left: z.x, top: z.y,
            fontSize: z.size,
            color: 'rgba(159,18,57,0.55)',
            fontFamily: 'var(--font-playfair), serif',
          }}
          animate={{
            y: [0, -16, -22],
            opacity: [0, 1, 0],
            x: [0, 4, 8],
          }}
          transition={{ duration: 3.6, delay: z.delay, repeat: Infinity, ease: 'easeOut' }}
        >
          Z
        </motion.span>
      ))}

      <svg
        viewBox="0 0 220 180"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="slBody" cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <linearGradient id="slBook" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
          <radialGradient id="slFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="110" cy="168" rx="80" ry="6" fill="url(#slFloor)" />

        {/* ═══ LIBRO como almohada ════════════════════════════ */}
        <g>
          <ellipse cx="110" cy="158" rx="72" ry="4" fill="rgba(79,10,31,0.3)" />
          {/* Cuerpo del libro cerrado (perspectiva leve) */}
          <path d="M38,128 L182,128 L182,158 L38,158 Z" fill="url(#slBook)" />
          {/* Páginas del canto */}
          <rect x="38" y="128" width="144" height="3" fill="#fde8c4" />
          <line x1="38" y1="130" x2="182" y2="130" stroke="#c68b5a" strokeWidth="0.5" />
          {/* Lomo vertical con emboss de título */}
          <rect x="110" y="128" width="2" height="30" fill={P.body.deepest} opacity="0.5" />
          {/* Título simulado en la tapa */}
          <rect x="80" y="142" width="60" height="1" fill={P.gold} opacity="0.6" />
          <rect x="90" y="148" width="40" height="1" fill={P.gold} opacity="0.5" />
        </g>

        {/* ═══ BATA acurrucado ════════════════════════════════ */}
        <motion.g
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 118px' }}
        >
          {/* Cuerpo achatado lateralmente (posición fetal) */}
          <path
            d="M60,94 C60,72 80,60 100,60 C138,60 170,74 172,98 C174,118 160,128 130,128 L80,128 C62,128 58,114 60,94 Z"
            fill="url(#slBody)"
          />
          {/* Brillo */}
          <ellipse cx="92" cy="78" rx="14" ry="8" fill="rgba(255,255,255,0.16)" transform="rotate(-12, 92, 78)" />

          {/* Cola/punta de gota replegada */}
          <path d="M168,96 Q180,90 176,104 Q170,108 168,96 Z" fill={P.body.lo} />

          {/* Brazos cruzados bajo la cabeza */}
          <path d="M72,118 Q90,126 110,122" stroke={P.body.deeper} strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M76,124 Q94,128 112,126" stroke={P.body.deeper} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity="0.7" />

          {/* Ojos cerrados con arcos ">" — profundo sueño */}
          <motion.g
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '95px 94px' }}
          >
            <path d="M82,94 Q90,100 98,94" stroke={P.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M112,94 Q120,100 128,94" stroke={P.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Cejas relajadas arriba de los ojos */}
          <path d="M82,86 Q90,84 98,86" stroke={P.inkSoft} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M112,86 Q120,84 128,86" stroke={P.inkSoft} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8" />

          {/* Rubor del sueño */}
          <circle cx="74" cy="104" r="5" fill="rgba(251,113,133,0.28)" />
          <circle cx="136" cy="104" r="5" fill="rgba(251,113,133,0.28)" />

          {/* Boca levemente abierta (suspiro) */}
          <motion.ellipse
            cx="105" cy="114" rx="3.5" ry="2"
            fill={P.ink}
            animate={{ ry: [2, 2.5, 2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
