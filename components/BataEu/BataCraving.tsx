'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu antojado — hambre desesperada por chocolate. Chocolate flotando
 * arriba, ojos como espirales hipnotizados, boca abierta con gota de saliva,
 * manos extendidas intentando alcanzarlo. Para la página de Antojos.
 */
interface Props {
  className?: string
}

export default function BataCraving({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow cálido/ansioso */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(236,72,153,0.26), rgba(198,139,90,0.12) 50%, transparent 72%)',
          filter: 'blur(24px)',
        }}
        animate={{ opacity: [0.55, 0.95, 0.55], scale: [1, 1.05, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Emojis de comida orbitando levemente */}
      {[
        { emoji: '🍫', x: '10%', y: '8%', delay: 0, size: 20 },
        { emoji: '🧁', x: '82%', y: '12%', delay: 0.7, size: 18 },
        { emoji: '🍰', x: '88%', y: '62%', delay: 1.4, size: 16 },
        { emoji: '🍩', x: '6%', y: '58%', delay: 2.1, size: 18 },
      ].map((f, i) => (
        <motion.span
          key={i}
          className="absolute select-none pointer-events-none"
          style={{ left: f.x, top: f.y, fontSize: f.size, lineHeight: 1 }}
          animate={{
            y: [0, -8, 0],
            rotate: [-8, 8, -8],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3.2, delay: f.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {f.emoji}
        </motion.span>
      ))}

      <svg
        viewBox="0 0 220 230"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="crvBody" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <linearGradient id="chocBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id="crvFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="110" cy="218" rx="68" ry="7" fill="url(#crvFloor)" />

        {/* ═══ CHOCOLATE FLOTANTE (objeto del deseo) ═════════ */}
        <motion.g
          animate={{ y: [0, -6, 0], rotate: [-10, 8, -10] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 50px' }}
        >
          {/* Envoltorio de aluminio */}
          <rect x="90" y="34" width="44" height="34" rx="2" fill="url(#chocBar)" />
          {/* Textura de cuadraditos */}
          <g stroke="#1f0a01" strokeWidth="0.8" opacity="0.7">
            <line x1="101" y1="34" x2="101" y2="68" />
            <line x1="112" y1="34" x2="112" y2="68" />
            <line x1="123" y1="34" x2="123" y2="68" />
            <line x1="90" y1="45" x2="134" y2="45" />
            <line x1="90" y1="56" x2="134" y2="56" />
          </g>
          {/* Highlights en algunos cuadrados */}
          <rect x="92" y="36" width="8" height="8" rx="1" fill="rgba(255,255,255,0.1)" />
          <rect x="114" y="47" width="8" height="8" rx="1" fill="rgba(255,255,255,0.08)" />
          {/* Resplandor divino alrededor del chocolate */}
          <motion.circle
            cx="112" cy="51" r="36"
            fill="none"
            stroke="rgba(253,230,138,0.4)"
            strokeWidth="1.5"
            animate={{ scale: [0.6, 1.2], opacity: [0.8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Sparkles alrededor */}
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="84" cy="42" r="1.5" fill="#fde68a" />
            <circle cx="140" cy="46" r="1.5" fill="#fde68a" />
            <circle cx="82" cy="62" r="1.2" fill="#fde68a" />
            <circle cx="142" cy="60" r="1.2" fill="#fde68a" />
            <path d="M86,56 L82,60 M82,56 L86,60" stroke="#fde68a" strokeWidth="0.8" strokeLinecap="round" />
          </motion.g>
        </motion.g>

        {/* ═══ BATA temblando de antojo ═══════════════════════ */}
        <motion.g
          animate={{ y: [0, -6, 0, -3, 0], x: [0, 1, -1, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Cuerpo */}
          <path
            d="M110,76 C140,92 156,130 156,164 C156,188 136,202 110,204 C84,202 64,188 64,164 C64,130 80,92 110,76 Z"
            fill="url(#crvBody)"
          />
          <ellipse cx="88" cy="106" rx="11" ry="20" fill="rgba(255,255,255,0.17)" transform="rotate(-20, 88, 106)" />

          {/* Pies */}
          <ellipse cx="94" cy="214" rx="8" ry="3" fill={P.body.deeper} />
          <ellipse cx="126" cy="214" rx="8" ry="3" fill={P.body.deeper} />

          {/* Brazos estirándose hacia arriba (buscar el chocolate) */}
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '68px 150px' }}
          >
            <path d="M68,150 Q52,130 62,98" stroke={P.body.lo} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <circle cx="62" cy="98" r="5.5" fill={P.body.lo} />
            {/* Dedos estirados */}
            <line x1="58" y1="94" x2="56" y2="90" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
            <line x1="62" y1="92" x2="62" y2="86" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
            <line x1="66" y1="94" x2="68" y2="90" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
          </motion.g>
          <motion.g
            animate={{ rotate: [3, -3, 3] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '152px 150px' }}
          >
            <path d="M152,150 Q168,130 158,98" stroke={P.body.lo} strokeWidth="5.5" fill="none" strokeLinecap="round" />
            <circle cx="158" cy="98" r="5.5" fill={P.body.lo} />
            <line x1="154" y1="94" x2="152" y2="90" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
            <line x1="158" y1="92" x2="158" y2="86" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
            <line x1="162" y1="94" x2="164" y2="90" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* ═══ OJOS HIPNOTIZADOS (espirales) ═══════════════ */}
          <circle cx="88" cy="132" r="11" fill="white" />
          <circle cx="132" cy="132" r="11" fill="white" />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '88px 132px' }}
          >
            <path
              d="M88,124 Q96,124 96,132 Q96,138 88,138 Q82,138 82,132 Q82,128 88,128"
              stroke={P.ink}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '132px 132px' }}
          >
            <path
              d="M132,124 Q140,124 140,132 Q140,138 132,138 Q126,138 126,132 Q126,128 132,128"
              stroke={P.ink}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Cejas intensas (arqueadas hacia el deseo) */}
          <path d="M76,118 Q88,112 100,118" stroke={P.inkSoft} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M120,118 Q132,112 144,118" stroke={P.inkSoft} strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Rubor de antojo */}
          <circle cx="64" cy="160" r="10" fill="rgba(251,113,133,0.42)" />
          <circle cx="156" cy="160" r="10" fill="rgba(251,113,133,0.42)" />

          {/* Boca abierta (babeando) */}
          <ellipse cx="110" cy="162" rx="14" ry="10" fill={P.ink} />
          <ellipse cx="110" cy="164" rx="11" ry="8" fill="#4c0519" />
          {/* Lengua colgando */}
          <motion.path
            d="M103,168 Q110,180 117,168 Q115,176 110,178 Q105,176 103,168 Z"
            fill="#fb7185"
            animate={{ scaleY: [1, 1.1, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '110px 168px' }}
          />
          {/* Dientes superiores */}
          <rect x="101" y="156" width="2.5" height="4" fill="white" />
          <rect x="106" y="156" width="2.5" height="4" fill="white" />
          <rect x="111" y="156" width="2.5" height="4" fill="white" />
          <rect x="116" y="156" width="2.5" height="4" fill="white" />

          {/* Gota de saliva cayendo */}
          <motion.path
            d="M120,172 C121,178 124,180 122,184 C120,186 118,184 118,181 C118,178 119,175 120,172 Z"
            fill="#93c5fd"
            opacity={0.85}
            animate={{ y: [0, 14], opacity: [0.9, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, ease: 'easeIn' }}
          />
        </motion.g>
      </svg>
    </div>
  )
}
