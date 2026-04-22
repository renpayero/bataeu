'use client'

import { motion } from 'framer-motion'

/**
 * Bata Eu leyendo — avatar ilustrado (SVG) para la home de Lectura.
 * Gotita sentada, anteojos redondos, libro abierto. Respira, pasa página,
 * los lentes destellan, hay una vela flotante y motas de polvo suspendidas.
 */
interface Props {
  className?: string
}

export default function BataReading({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Glow detrás del personaje */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(225,29,72,0.22), rgba(198,139,90,0.12) 45%, transparent 70%)',
          filter: 'blur(24px)',
        }}
        animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.04, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vela flotante — referencia al 🕯️ de la sección */}
      <motion.div
        className="absolute select-none pointer-events-none text-2xl md:text-3xl"
        style={{ top: '-18px', right: '6%', zIndex: 3 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.span
          className="inline-block"
          animate={{ rotate: [-3, 3, -2, 2, -3], filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1)'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🕯️
        </motion.span>
      </motion.div>

      {/* Motas de polvo / sparkles suspendidos */}
      <Mote x="12%" y="28%" delay={0} />
      <Mote x="88%" y="42%" delay={1.3} />
      <Mote x="18%" y="68%" delay={2.6} />
      <Mote x="78%" y="18%" delay={0.9} />

      {/* Body breathing wrapper */}
      <motion.div
        className="relative"
        animate={{ scale: [1, 0.985, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50% 85%' }}
      >
        <svg
          viewBox="0 0 200 210"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          overflow="visible"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="bataBody" cx="38%" cy="28%" r="75%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="60%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#9f1239" />
            </radialGradient>
            <radialGradient id="bataEye" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fce7f0" />
            </radialGradient>
            <linearGradient id="bookCover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7f1d1d" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
            <linearGradient id="pageLeft" x1="0" y1="0" x2="1" y2="0.2">
              <stop offset="0%" stopColor="#fffaf0" />
              <stop offset="100%" stopColor="#fde8c4" />
            </linearGradient>
            <linearGradient id="pageRight" x1="0" y1="0" x2="1" y2="0.2">
              <stop offset="0%" stopColor="#fde8c4" />
              <stop offset="100%" stopColor="#fffaf0" />
            </linearGradient>
            <linearGradient id="glassTint" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,245,247,0.42)" />
              <stop offset="100%" stopColor="rgba(253,232,244,0.22)" />
            </linearGradient>
            {/* Glint que barre los anteojos */}
            <linearGradient id="lensGlint" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="45%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="55%" stopColor="rgba(255,255,255,0)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            {/* Sombra del conjunto */}
            <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(79, 10, 31, 0.35)" />
              <stop offset="100%" stopColor="rgba(79, 10, 31, 0)" />
            </radialGradient>
            <clipPath id="leftLensClip">
              <circle cx="73" cy="88" r="13.5" />
            </clipPath>
            <clipPath id="rightLensClip">
              <circle cx="127" cy="88" r="13.5" />
            </clipPath>
          </defs>

          {/* Sombra en el suelo */}
          <ellipse cx="100" cy="196" rx="56" ry="8" fill="url(#floorShadow)" />

          {/* ═══ BODY (gotita sentada) ══════════════════════════ */}
          {/* La base es más ancha para lectura "sentada". */}
          <path
            d="M100,14 C132,30 154,72 154,110 C154,144 138,170 100,172 C62,170 46,144 46,110 C46,72 68,30 100,14 Z"
            fill="url(#bataBody)"
          />
          {/* Brillo lateral del cuerpo */}
          <ellipse
            cx="80" cy="48" rx="12" ry="22"
            fill="rgba(255,255,255,0.18)"
            transform="rotate(-18, 80, 48)"
          />
          {/* Highlight inferior */}
          <ellipse cx="100" cy="155" rx="40" ry="8" fill="rgba(255,255,255,0.06)" />

          {/* ═══ PIERNAS CRUZADAS (sentado) ═════════════════════ */}
          <path
            d="M68,168 C68,182 82,188 100,188 C118,188 132,182 132,168"
            stroke="#7f1d1d"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="68" cy="188" rx="9" ry="3.5" fill="#7f1d1d" />
          <ellipse cx="132" cy="188" rx="9" ry="3.5" fill="#7f1d1d" />

          {/* ═══ OJOS (bajos, leyendo) ══════════════════════════ */}
          <circle cx="73" cy="88" r="11" fill="url(#bataEye)" />
          <circle cx="127" cy="88" r="11" fill="url(#bataEye)" />
          {/* Pupilas apuntando hacia abajo (al libro) */}
          <circle cx="73" cy="93" r="4.2" fill="#1f2937" />
          <circle cx="127" cy="93" r="4.2" fill="#1f2937" />
          <circle cx="71.5" cy="91" r="1.4" fill="rgba(255,255,255,0.85)" />
          <circle cx="125.5" cy="91" r="1.4" fill="rgba(255,255,255,0.85)" />

          {/* Pestañas bajas (concentración) */}
          <motion.g
            animate={{ scaleY: [1, 0.15, 1] }}
            transition={{
              duration: 0.22,
              repeat: Infinity,
              repeatDelay: 4.8,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '100px 82px' }}
          >
            <path d="M62,82 Q73,78 84,82" stroke="#1f2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M116,82 Q127,78 138,82" stroke="#1f2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* ═══ CEJAS (concentradas) ══════════════════════════ */}
          <path d="M62,76 Q73,73 84,76" stroke="#3f1d1d" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M116,76 Q127,73 138,76" stroke="#3f1d1d" strokeWidth="2.4" fill="none" strokeLinecap="round" />

          {/* ═══ ANTEOJOS ═══════════════════════════════════════ */}
          {/* Patilla (puente) */}
          <path d="M86,88 Q100,85 114,88" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Patillas laterales */}
          <path d="M60,89 Q50,87 44,91" stroke="#2c1810" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M140,89 Q150,87 156,91" stroke="#2c1810" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Lente izquierdo: relleno tintado */}
          <circle cx="73" cy="88" r="13.5" fill="url(#glassTint)" />
          <circle cx="73" cy="88" r="13.5" fill="none" stroke="#2c1810" strokeWidth="2.2" />
          {/* Lente derecho */}
          <circle cx="127" cy="88" r="13.5" fill="url(#glassTint)" />
          <circle cx="127" cy="88" r="13.5" fill="none" stroke="#2c1810" strokeWidth="2.2" />
          {/* Destello que barre los lentes */}
          <g clipPath="url(#leftLensClip)">
            <motion.rect
              x="-60" y="72" width="40" height="40"
              fill="url(#lensGlint)"
              transform="rotate(30, -40, 92)"
              animate={{ x: [-60, 110] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.8, ease: 'easeInOut' }}
            />
          </g>
          <g clipPath="url(#rightLensClip)">
            <motion.rect
              x="-60" y="72" width="40" height="40"
              fill="url(#lensGlint)"
              transform="rotate(30, -40, 92)"
              animate={{ x: [-5, 170] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.8, ease: 'easeInOut', delay: 0.08 }}
            />
          </g>

          {/* ═══ SONRISA SERENA ════════════════════════════════ */}
          <path
            d="M88,112 Q100,119 112,112"
            stroke="#1f2937"
            strokeWidth="2.3"
            fill="none"
            strokeLinecap="round"
          />

          {/* ═══ BRAZOS sosteniendo el libro ═══════════════════ */}
          <path
            d="M46,118 Q40,132 60,148"
            stroke="#9f1239"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M154,118 Q160,132 140,148"
            stroke="#9f1239"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />

          {/* ═══ LIBRO (abierto, en el regazo) ══════════════════ */}
          <g transform="translate(0, 2)">
            {/* Sombra del libro */}
            <ellipse cx="100" cy="170" rx="48" ry="4" fill="rgba(79,10,31,0.25)" />
            {/* Tapa trasera */}
            <path
              d="M54,144 L100,150 L146,144 L146,168 L100,172 L54,168 Z"
              fill="url(#bookCover)"
            />
            {/* Páginas */}
            <path d="M56,143 L100,149 L100,170 L56,165 Z" fill="url(#pageLeft)" />
            <path d="M144,143 L100,149 L100,170 L144,165 Z" fill="url(#pageRight)" />
            {/* Líneas de texto (página izq) */}
            <g stroke="#b45867" strokeWidth="0.7" strokeLinecap="round" opacity="0.7">
              <line x1="62" y1="150" x2="95" y2="154" />
              <line x1="62" y1="154" x2="93" y2="158" />
              <line x1="62" y1="158" x2="95" y2="162" />
              <line x1="62" y1="162" x2="88" y2="165" />
            </g>
            {/* Líneas de texto (página der) */}
            <g stroke="#b45867" strokeWidth="0.7" strokeLinecap="round" opacity="0.7">
              <line x1="105" y1="154" x2="138" y2="150" />
              <line x1="105" y1="158" x2="136" y2="154" />
              <line x1="105" y1="162" x2="138" y2="158" />
              <line x1="105" y1="165" x2="132" y2="162" />
            </g>
            {/* Página que se "voltea" periódicamente */}
            <motion.path
              d="M100,149 L144,143 L144,165 L100,170 Z"
              fill="url(#pageRight)"
              stroke="rgba(159,18,57,0.25)"
              strokeWidth="0.5"
              style={{ transformOrigin: '100px 149px', transformBox: 'fill-box' }}
              animate={{ rotateY: [0, -165, -165, 0], opacity: [1, 1, 1, 1] }}
              transition={{
                duration: 2.4,
                times: [0, 0.35, 0.5, 1],
                repeat: Infinity,
                repeatDelay: 4.6,
                ease: 'easeInOut',
              }}
            />
            {/* Lomo del libro */}
            <line x1="100" y1="149" x2="100" y2="170" stroke="#7f1d1d" strokeWidth="1.2" />
          </g>

          {/* Marcapáginas colgante */}
          <motion.path
            d="M120,148 L120,178"
            stroke="#c68b5a"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ x: [0, 1.5, 0, -1.2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
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
        width: 4,
        height: 4,
        background: 'rgba(198, 139, 90, 0.55)',
        boxShadow: '0 0 6px rgba(253, 230, 138, 0.6)',
      }}
      animate={{
        y: [0, -14, 0],
        opacity: [0, 0.9, 0],
        scale: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 4.8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}
