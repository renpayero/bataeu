'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu bibliotecario — parado al lado de una pila de libros apilados más
 * altos que él, estirándose en puntitas para alcanzar el tomo de arriba.
 * Detalles: pila se tambalea sutil, mano arriba oscila buscando, anteojos
 * con destello, libro flotante con sparkles, partículas de polvo de papel.
 */
interface Props {
  className?: string
}

export default function BataLibrarian({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow atmosférico */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(225,29,72,0.20), rgba(198,139,90,0.10) 50%, transparent 70%)',
          filter: 'blur(22px)',
        }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Motas de polvo de papel suspendidas */}
      <Mote x="82%" y="14%" delay={0} />
      <Mote x="12%" y="22%" delay={1.6} />
      <Mote x="68%" y="68%" delay={2.9} />
      <Mote x="22%" y="80%" delay={0.6} />

      <svg
        viewBox="0 0 220 240"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="libBody" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <radialGradient id="libEye" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={P.eyeWhite} />
            <stop offset="100%" stopColor={P.eyeWhiteSoft} />
          </radialGradient>
          <linearGradient id="libShelfWood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b3a1b" />
            <stop offset="100%" stopColor="#3d1f0f" />
          </linearGradient>
          <linearGradient id="libGlint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id="libFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
          <clipPath id="libLensL">
            <circle cx="76" cy="84" r="13" />
          </clipPath>
          <clipPath id="libLensR">
            <circle cx="128" cy="84" r="13" />
          </clipPath>
          {/* Libros apilados con gradient por lomo */}
          <linearGradient id="book1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#be185d" />
            <stop offset="100%" stopColor="#831843" />
          </linearGradient>
          <linearGradient id="book2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>
          <linearGradient id="book3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="book4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#166534" />
            <stop offset="100%" stopColor="#052e16" />
          </linearGradient>
          <linearGradient id="book5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7f1d1d" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          {/* Libro flotante arriba — el que busca alcanzar */}
          <linearGradient id="floatBook" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={P.gold} />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* Sombra al suelo */}
        <ellipse cx="110" cy="228" rx="68" ry="7" fill="url(#libFloor)" />

        {/* Estante vertical detrás — insinuado */}
        <g opacity="0.55">
          <rect x="152" y="24" width="52" height="5" fill="url(#libShelfWood)" />
          <rect x="152" y="78" width="52" height="5" fill="url(#libShelfWood)" />
          {/* Libritos mini en el estante */}
          <rect x="156" y="32" width="6" height="45" fill="#be185d" />
          <rect x="163" y="34" width="6" height="43" fill="#a16207" />
          <rect x="170" y="30" width="6" height="47" fill="#4c1d95" />
          <rect x="177" y="36" width="6" height="41" fill="#166534" />
          <rect x="184" y="32" width="6" height="45" fill="#7f1d1d" />
          <rect x="191" y="34" width="6" height="43" fill="#c68b5a" />
        </g>

        {/* ═══ PILA DE LIBROS apilados al costado derecho ═════ */}
        <motion.g
          animate={{ rotate: [-0.4, 0.4, -0.4] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '160px 220px' }}
        >
          <rect x="140" y="198" width="48" height="14" rx="2" fill="url(#book1)" />
          <rect x="145" y="186" width="42" height="12" rx="2" fill="url(#book2)" />
          <rect x="138" y="174" width="52" height="12" rx="2" fill="url(#book3)" />
          <rect x="142" y="162" width="44" height="12" rx="2" fill="url(#book4)" />
          <rect x="146" y="150" width="40" height="12" rx="2" fill="url(#book5)" />
          <rect x="143" y="140" width="44" height="10" rx="2" fill="url(#book2)" />
          {/* Líneas detalle del canto */}
          <line x1="140" y1="202" x2="188" y2="202" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="145" y1="190" x2="187" y2="190" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="138" y1="178" x2="190" y2="178" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
          <line x1="142" y1="166" x2="186" y2="166" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
        </motion.g>

        {/* ═══ LIBRO FLOTANTE (el que quiere alcanzar) ════════ */}
        <motion.g
          animate={{ y: [-2, 3, -2], rotate: [-3, 3, -3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '172px 90px' }}
        >
          <rect x="160" y="76" width="34" height="26" rx="1.5" fill="url(#floatBook)" />
          <line x1="167" y1="76" x2="167" y2="102" stroke="#fde68a" strokeWidth="0.6" opacity="0.7" />
          <line x1="163" y1="82" x2="191" y2="82" stroke="#fde68a" strokeWidth="0.5" opacity="0.5" />
          <line x1="163" y1="96" x2="191" y2="96" stroke="#fde68a" strokeWidth="0.5" opacity="0.5" />
          {/* Sparkles alrededor del libro */}
          <motion.g
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="157" cy="74" r="1.5" fill={P.goldSoft} />
            <circle cx="196" cy="85" r="1.5" fill={P.goldSoft} />
            <circle cx="153" cy="92" r="1.2" fill={P.goldSoft} />
            <circle cx="198" cy="100" r="1.2" fill={P.goldSoft} />
          </motion.g>
        </motion.g>

        {/* ═══ BATA EU parado, estirándose en puntitas ════════ */}
        <motion.g
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Cuerpo gotita */}
          <path
            d="M100,38 C128,54 142,94 142,128 C142,156 124,178 100,178 C76,178 58,156 58,128 C58,94 72,54 100,38 Z"
            fill="url(#libBody)"
          />
          {/* Brillo lateral */}
          <ellipse cx="80" cy="68" rx="10" ry="18" fill="rgba(255,255,255,0.18)" transform="rotate(-20, 80, 68)" />

          {/* Pies en puntitas */}
          <ellipse cx="86" cy="196" rx="8" ry="2.5" fill={P.body.deeper} />
          <ellipse cx="114" cy="196" rx="8" ry="2.5" fill={P.body.deeper} />
          <path d="M86,178 L86,194" stroke={P.body.lo} strokeWidth="5" strokeLinecap="round" />
          <path d="M114,178 L114,194" stroke={P.body.lo} strokeWidth="5" strokeLinecap="round" />
          {/* Pequeño rebote estirando las piernas */}
          <motion.g
            animate={{ scaleY: [1, 1.04, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 196px' }}
          />

          {/* Brazo izquierdo abajo/relajado */}
          <path d="M60,118 Q52,132 58,148" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="149" r="5" fill={P.body.lo} />

          {/* Brazo derecho estirado hacia arriba buscando el libro */}
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '140px 115px' }}
          >
            <path d="M140,115 Q158,100 170,92" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="170" cy="92" r="5.5" fill={P.body.lo} />
            {/* "Dedos" sugiriendo alcance */}
            <line x1="170" y1="86" x2="172" y2="82" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
            <line x1="174" y1="88" x2="177" y2="85" stroke={P.body.lo} strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* ═══ OJOS (mirando hacia arriba) ═════════════════ */}
          <circle cx="76" cy="84" r="10.5" fill="url(#libEye)" />
          <circle cx="128" cy="84" r="10.5" fill="url(#libEye)" />
          {/* Pupilas miran arriba */}
          <circle cx="78" cy="80" r="4" fill={P.ink} />
          <circle cx="130" cy="80" r="4" fill={P.ink} />
          <circle cx="76.5" cy="78" r="1.3" fill="rgba(255,255,255,0.85)" />
          <circle cx="128.5" cy="78" r="1.3" fill="rgba(255,255,255,0.85)" />

          {/* Cejas levemente arqueadas (curiosidad) */}
          <path d="M64,72 Q76,68 88,72" stroke={P.inkSoft} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M116,72 Q128,68 140,72" stroke={P.inkSoft} strokeWidth="2.3" fill="none" strokeLinecap="round" />

          {/* Anteojos */}
          <path d="M89,84 Q100,82 111,84" stroke={P.frame} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M63,85 Q53,83 48,87" stroke={P.frame} strokeWidth="2.1" fill="none" strokeLinecap="round" />
          <path d="M141,85 Q151,83 156,87" stroke={P.frame} strokeWidth="2.1" fill="none" strokeLinecap="round" />
          <circle cx="76" cy="84" r="13" fill="url(#libGlint)" fillOpacity="0.4" />
          <circle cx="76" cy="84" r="13" fill="none" stroke={P.frame} strokeWidth="2.1" />
          <circle cx="128" cy="84" r="13" fill="url(#libGlint)" fillOpacity="0.4" />
          <circle cx="128" cy="84" r="13" fill="none" stroke={P.frame} strokeWidth="2.1" />
          {/* Destello barre */}
          <g clipPath="url(#libLensL)">
            <motion.rect
              x="-60" y="68" width="40" height="40" fill="url(#libGlint)"
              transform="rotate(30, -40, 88)"
              animate={{ x: [-60, 110] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
            />
          </g>
          <g clipPath="url(#libLensR)">
            <motion.rect
              x="-60" y="68" width="40" height="40" fill="url(#libGlint)"
              transform="rotate(30, -40, 88)"
              animate={{ x: [-5, 170] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut', delay: 0.1 }}
            />
          </g>

          {/* Boca — sonrisa curiosa, ligeramente abierta */}
          <ellipse cx="100" cy="112" rx="5" ry="3.5" fill={P.ink} />
          <ellipse cx="100" cy="113" rx="3.5" ry="2" fill="#7f1d1d" />
        </motion.g>
      </svg>
    </div>
  )
}

function Mote({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.span
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 3,
        height: 3,
        background: 'rgba(198, 139, 90, 0.6)',
        boxShadow: '0 0 5px rgba(253, 230, 138, 0.55)',
      }}
      animate={{ y: [0, -12, 0], opacity: [0, 0.85, 0] }}
      transition={{ duration: 4.5, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
