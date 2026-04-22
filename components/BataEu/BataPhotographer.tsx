'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu fotógrafo — sostiene una cámara vintage con dos manos, un ojo
 * cerrado enfocando, correa al cuello, flash que dispara periódicamente,
 * polaroid revelándose al costado. Para la página de Galería.
 */
interface Props {
  className?: string
}

export default function BataPhotographer({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow cálido */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 40% 50%, rgba(225,29,72,0.22), rgba(253,230,138,0.12) 50%, transparent 72%)',
          filter: 'blur(24px)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Destello del flash como halo exterior */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6), transparent 25%)',
        }}
        animate={{ opacity: [0, 0, 1, 0, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.48, 0.55, 1], ease: 'easeInOut' }}
      />

      <svg
        viewBox="0 0 220 230"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="photoBody" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <linearGradient id="camBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <linearGradient id="camLeather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#3d1f0f" />
          </linearGradient>
          <radialGradient id="lensInner" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="40%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#0a0f1f" />
          </radialGradient>
          <radialGradient id="lensShine" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="photoFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
        </defs>

        {/* Sombra */}
        <ellipse cx="110" cy="218" rx="70" ry="7" fill="url(#photoFloor)" />

        {/* ═══ BATA parado ═══════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -1.5, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M110,30 C140,46 156,86 156,124 C156,156 136,188 110,192 C84,188 64,156 64,124 C64,86 80,46 110,30 Z"
            fill="url(#photoBody)"
          />
          <ellipse cx="88" cy="60" rx="11" ry="20" fill="rgba(255,255,255,0.17)" transform="rotate(-20, 88, 60)" />

          {/* Pies */}
          <ellipse cx="92" cy="204" rx="8" ry="3" fill={P.body.deeper} />
          <ellipse cx="128" cy="204" rx="8" ry="3" fill={P.body.deeper} />
          <path d="M92,192 L92,202" stroke={P.body.lo} strokeWidth="5" strokeLinecap="round" />
          <path d="M128,192 L128,202" stroke={P.body.lo} strokeWidth="5" strokeLinecap="round" />

          {/* Correa de la cámara (al cuello) */}
          <path d="M72,88 Q88,120 110,128 Q132,120 148,88" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Ojo izquierdo (entrecerrado para enfocar) */}
          <path d="M78,90 Q86,86 94,90" stroke={P.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Ojo derecho (normal, mirando cámara) */}
          <circle cx="134" cy="92" r="10" fill="white" />
          <circle cx="134" cy="92" r="4" fill={P.ink} />
          <circle cx="132.5" cy="90" r="1.3" fill="rgba(255,255,255,0.85)" />

          {/* Cejas concentradas */}
          <path d="M70,78 Q82,75 94,78" stroke={P.inkSoft} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M122,78 Q134,75 146,78" stroke={P.inkSoft} strokeWidth="2.3" fill="none" strokeLinecap="round" />

          {/* Boca — sonrisa pequeña de concentración */}
          <path d="M100,140 Q110,144 120,140" stroke={P.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Brazos sosteniendo la cámara */}
          <path d="M70,144 Q68,152 80,158" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M150,144 Q152,152 140,158" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
        </motion.g>

        {/* ═══ CÁMARA VINTAGE ═══════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -1, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '110px 155px' }}
        >
          {/* Cuerpo rectangular */}
          <rect x="72" y="142" width="76" height="38" rx="4" fill="url(#camBody)" />
          {/* Franja de cuero */}
          <rect x="72" y="156" width="76" height="12" fill="url(#camLeather)" />
          {/* Visor arriba */}
          <rect x="96" y="134" width="28" height="10" rx="1.5" fill="url(#camBody)" />
          {/* Flash arriba a la izquierda */}
          <rect x="78" y="134" width="14" height="10" rx="1.5" fill="#d1d5db" />
          <motion.rect
            x="78" y="134" width="14" height="10" rx="1.5"
            fill="white"
            animate={{ opacity: [0, 0, 1, 0.3, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.48, 0.55, 1], ease: 'easeInOut' }}
          />
          {/* Botón disparador rojo */}
          <circle cx="138" cy="139" r="3.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.8" />
          {/* Lente externo */}
          <circle cx="110" cy="161" r="16" fill="#1f2937" />
          <circle cx="110" cy="161" r="13" fill="url(#lensInner)" />
          <circle cx="110" cy="161" r="9" fill="#0a0f1f" />
          <circle cx="110" cy="161" r="9" fill="url(#lensShine)" />
          {/* Reflejo brillante en el lente */}
          <ellipse cx="106" cy="156" rx="3" ry="2" fill="rgba(255,255,255,0.7)" />
          {/* Anillo dorado del lente */}
          <circle cx="110" cy="161" r="16" fill="none" stroke={P.gold} strokeWidth="1" opacity="0.6" />
        </motion.g>

        {/* ═══ POLAROID revelándose al costado ═══════════════ */}
        <motion.g
          animate={{ y: [0, -8, 0], rotate: [-6, -3, -6] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '180px 100px' }}
        >
          {/* Marco blanco */}
          <rect x="164" y="76" width="38" height="44" rx="1" fill="#fffaf0" stroke="#e5e7eb" strokeWidth="0.5" />
          {/* Foto que se revela de oscuro a claro */}
          <motion.rect
            x="167" y="79" width="32" height="30"
            animate={{ fill: ['#1f2937', '#9f1239', '#be185d'] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Simular un corazón en la foto que aparece */}
          <motion.path
            d="M183,92 C179,88 173,89 174,95 C175,101 183,106 183,106 C183,106 191,101 192,95 C193,89 187,88 183,92 Z"
            fill="#fb7185"
            animate={{ opacity: [0, 0, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.6, 1], ease: 'easeInOut' }}
          />
          {/* Caption abajo */}
          <line x1="170" y1="115" x2="194" y2="115" stroke="#be185d" strokeWidth="0.6" opacity="0.5" />
        </motion.g>

        {/* Sparkles del flash */}
        <motion.g
          animate={{ opacity: [0, 0, 1, 0, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.48, 0.6, 1], ease: 'easeInOut' }}
        >
          <circle cx="62" cy="100" r="1.5" fill="white" />
          <circle cx="68" cy="94" r="1" fill="white" />
          <circle cx="74" cy="106" r="1.2" fill="white" />
          <path d="M60,110 L64,114 M64,110 L60,114" stroke="white" strokeWidth="1" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  )
}
