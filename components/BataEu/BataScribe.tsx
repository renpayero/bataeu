'use client'

import { motion } from 'framer-motion'
import { bataPalette as P } from './palette'

/**
 * Bata Eu escriba — sentado frente a un pergamino, pluma de ave en la mano
 * derecha trazando caligrafía. Tintero dorado al costado. Anteojos, sonrisa
 * concentrada. Animaciones: pluma escribiendo (arco), gotitas de tinta,
 * caligrafía que aparece (stroke-dash), comillas tipográficas flotando.
 */
interface Props {
  className?: string
}

export default function BataScribe({ className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* Halo cálido */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(198,139,90,0.22), rgba(225,29,72,0.10) 50%, transparent 72%)',
          filter: 'blur(24px)',
        }}
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Comillas tipográficas flotando arriba */}
      <motion.span
        className="absolute font-serif select-none pointer-events-none"
        style={{
          top: '-4%', left: '6%', fontSize: '44px', lineHeight: 1,
          color: 'rgba(159,18,57,0.22)',
        }}
        animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5], rotate: [-3, 0, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        “
      </motion.span>
      <motion.span
        className="absolute font-serif select-none pointer-events-none"
        style={{
          top: '2%', right: '8%', fontSize: '38px', lineHeight: 1,
          color: 'rgba(159,18,57,0.22)',
        }}
        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5], rotate: [2, -2, 2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        ”
      </motion.span>

      <svg
        viewBox="0 0 220 230"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        overflow="visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="scribeBody" cx="40%" cy="28%" r="78%">
            <stop offset="0%" stopColor={P.body.hi} />
            <stop offset="60%" stopColor={P.body.mid} />
            <stop offset="100%" stopColor={P.body.lo} />
          </radialGradient>
          <radialGradient id="scribeEye" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor={P.eyeWhite} />
            <stop offset="100%" stopColor={P.eyeWhiteSoft} />
          </radialGradient>
          <linearGradient id="parchment" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff6de" />
            <stop offset="100%" stopColor="#e7d1a0" />
          </linearGradient>
          <linearGradient id="inkpot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c68b5a" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="scribeGlint" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="45%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <linearGradient id="feather" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor="#fce7f0" />
            <stop offset="50%" stopColor="#fbcfe8" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
          <radialGradient id="scribeFloor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={P.shadow} />
            <stop offset="100%" stopColor="rgba(79,10,31,0)" />
          </radialGradient>
          <clipPath id="scribeLensL">
            <circle cx="76" cy="86" r="12.5" />
          </clipPath>
          <clipPath id="scribeLensR">
            <circle cx="124" cy="86" r="12.5" />
          </clipPath>
        </defs>

        {/* Sombra al suelo */}
        <ellipse cx="110" cy="218" rx="72" ry="7" fill="url(#scribeFloor)" />

        {/* ═══ BATA EU SENTADO ══════════════════════════════ */}
        <motion.g
          animate={{ scale: [1, 0.985, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '100px 160px' }}
        >
          {/* Cuerpo */}
          <path
            d="M100,26 C128,42 142,84 142,120 C142,154 126,180 100,182 C74,180 58,154 58,120 C58,84 72,42 100,26 Z"
            fill="url(#scribeBody)"
          />
          <ellipse cx="80" cy="58" rx="11" ry="20" fill="rgba(255,255,255,0.17)" transform="rotate(-20, 80, 58)" />

          {/* Piernas cruzadas */}
          <path d="M72,178 C72,192 86,196 100,196 C114,196 128,192 128,178" stroke={P.body.deeper} strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <ellipse cx="72" cy="196" rx="8" ry="3" fill={P.body.deeper} />
          <ellipse cx="128" cy="196" rx="8" ry="3" fill={P.body.deeper} />

          {/* Ojos concentrados (mirada baja hacia el pergamino) */}
          <circle cx="76" cy="86" r="10" fill="url(#scribeEye)" />
          <circle cx="124" cy="86" r="10" fill="url(#scribeEye)" />
          <circle cx="76" cy="90" r="3.8" fill={P.ink} />
          <circle cx="124" cy="90" r="3.8" fill={P.ink} />
          <circle cx="74.5" cy="88" r="1.3" fill="rgba(255,255,255,0.85)" />
          <circle cx="122.5" cy="88" r="1.3" fill="rgba(255,255,255,0.85)" />

          {/* Cejas concentradas */}
          <path d="M64,74 Q76,71 88,74" stroke={P.inkSoft} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M112,74 Q124,71 136,74" stroke={P.inkSoft} strokeWidth="2.4" fill="none" strokeLinecap="round" />

          {/* Anteojos */}
          <path d="M88,86 Q100,83 112,86" stroke={P.frame} strokeWidth="2.3" fill="none" strokeLinecap="round" />
          <path d="M63,87 Q53,85 48,89" stroke={P.frame} strokeWidth="2.1" fill="none" strokeLinecap="round" />
          <path d="M137,87 Q147,85 152,89" stroke={P.frame} strokeWidth="2.1" fill="none" strokeLinecap="round" />
          <circle cx="76" cy="86" r="12.5" fill={P.tint} />
          <circle cx="76" cy="86" r="12.5" fill="none" stroke={P.frame} strokeWidth="2.1" />
          <circle cx="124" cy="86" r="12.5" fill={P.tint} />
          <circle cx="124" cy="86" r="12.5" fill="none" stroke={P.frame} strokeWidth="2.1" />
          <g clipPath="url(#scribeLensL)">
            <motion.rect x="-60" y="70" width="40" height="40" fill="url(#scribeGlint)"
              transform="rotate(30, -40, 90)"
              animate={{ x: [-60, 110] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 4.2, ease: 'easeInOut' }}
            />
          </g>
          <g clipPath="url(#scribeLensR)">
            <motion.rect x="-60" y="70" width="40" height="40" fill="url(#scribeGlint)"
              transform="rotate(30, -40, 90)"
              animate={{ x: [-5, 170] }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 4.2, ease: 'easeInOut', delay: 0.12 }}
            />
          </g>

          {/* Boca — sonrisa concentrada (casi linea recta con curva sutil) */}
          <path d="M91,110 Q100,114 109,110" stroke={P.ink} strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Brazo izquierdo sosteniendo el pergamino */}
          <path d="M58,128 Q48,142 58,156" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="59" cy="157" r="5" fill={P.body.lo} />

          {/* Brazo derecho sosteniendo la pluma (se mueve escribiendo) */}
          <motion.g
            animate={{ rotate: [-3, 3, -1, 2, -3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '142px 130px' }}
          >
            <path d="M142,130 Q158,144 150,158" stroke={P.body.lo} strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="150" cy="159" r="5" fill={P.body.lo} />
          </motion.g>
        </motion.g>

        {/* ═══ PERGAMINO sobre el regazo ═══════════════════════ */}
        <g>
          {/* Rollo izquierdo del pergamino */}
          <path d="M42,156 Q38,168 46,178 L60,178 L60,156 Z" fill="#c68b5a" />
          {/* Hoja */}
          <path d="M50,154 L150,154 Q158,168 150,180 L50,180 Q42,168 50,154 Z" fill="url(#parchment)" />
          {/* Rollo derecho */}
          <path d="M150,154 Q162,168 154,180 L140,180 L140,154 Z" fill="#c68b5a" />

          {/* Texto escrito (caligrafía que aparece con stroke-dash) */}
          <motion.path
            d="M62,162 Q72,160 82,163 Q92,166 102,162 Q112,158 122,163 Q132,167 140,162"
            stroke="#3f1d1d"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="120"
            animate={{ strokeDashoffset: [120, 0, 0, 120] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.85, 1], ease: 'easeInOut' }}
          />
          <motion.path
            d="M62,170 Q72,168 82,171 Q92,174 102,170 Q112,166 122,171"
            stroke="#3f1d1d"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="90"
            animate={{ strokeDashoffset: [90, 0, 0, 90] }}
            transition={{ duration: 6, repeat: Infinity, times: [0, 0.6, 0.9, 1], ease: 'easeInOut', delay: 0.5 }}
          />
        </g>

        {/* ═══ PLUMA DE AVE (escribiendo) ════════════════════ */}
        <motion.g
          animate={{ rotate: [-8, 2, -4, 0, -8], x: [0, 8, 4, 10, 0], y: [0, -1, 2, 0, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '150px 160px' }}
        >
          {/* Barba de la pluma */}
          <path
            d="M148,160 Q142,138 152,108 Q158,118 168,138 Q170,148 165,158 Z"
            fill="url(#feather)"
            stroke="#9f1239"
            strokeWidth="0.5"
          />
          {/* Raquis */}
          <line x1="151" y1="155" x2="158" y2="118" stroke="#831843" strokeWidth="1" />
          {/* Barbillas */}
          <g stroke="#db2777" strokeWidth="0.45" opacity="0.7">
            <line x1="152" y1="150" x2="146" y2="152" />
            <line x1="153" y1="145" x2="147" y2="146" />
            <line x1="154" y1="140" x2="148" y2="140" />
            <line x1="155" y1="135" x2="149" y2="134" />
            <line x1="156" y1="130" x2="150" y2="129" />
            <line x1="154" y1="150" x2="162" y2="154" />
            <line x1="155" y1="145" x2="164" y2="148" />
            <line x1="156" y1="140" x2="166" y2="142" />
            <line x1="157" y1="135" x2="167" y2="136" />
          </g>
          {/* Punta entintada */}
          <path d="M146,160 L148,164 L150,160 Z" fill="#1f2937" />
        </motion.g>

        {/* ═══ TINTERO DORADO ═══════════════════════════════ */}
        <g transform="translate(166, 160)">
          <ellipse cx="10" cy="22" rx="12" ry="3" fill="#3d1f0f" opacity="0.4" />
          <path d="M0,6 Q10,0 20,6 L18,22 Q10,26 2,22 Z" fill="url(#inkpot)" />
          <ellipse cx="10" cy="6" rx="10" ry="2.8" fill="#1f2937" />
          <ellipse cx="10" cy="6" rx="7" ry="1.8" fill="#0a0f1f" />
          {/* Reflejo */}
          <ellipse cx="7" cy="5" rx="2" ry="0.8" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* ═══ GOTITA DE TINTA cayendo periódicamente ════════ */}
        <motion.g
          animate={{ y: [0, 38], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3.5, ease: 'easeIn' }}
        >
          <path d="M148,166 C149,170 152,172 150,174 C148,176 146,174 146,171 C146,169 147,167 148,166 Z" fill="#1f2937" />
        </motion.g>
      </svg>
    </div>
  )
}
