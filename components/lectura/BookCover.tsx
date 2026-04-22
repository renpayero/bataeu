'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { readingPalette } from '@/lib/lectura/readingPalette'

interface BookCoverProps {
  title: string
  author: string
  coverUrl: string | null
  layoutId?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const SIZES = {
  sm: { w: 72, h: 108 },
  md: { w: 130, h: 195 },
  lg: { w: 180, h: 270 },
  xl: { w: 280, h: 420 },
} as const

function getInitials(title: string, author: string): string {
  const t = title.trim()[0]?.toUpperCase() ?? '?'
  const a = author.trim().split(/\s+/).pop()?.[0]?.toUpperCase() ?? ''
  return a ? `${t}${a}` : t
}

function hashHue(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h % 360
}

function FallbackCover({
  title,
  author,
  width,
  height,
}: {
  title: string
  author: string
  width: number
  height: number
}) {
  const initials = getInitials(title, author)
  const hue = hashHue(title + author)
  const accent = `hsl(${hue}, 55%, 42%)`
  const accentSoft = `hsl(${hue}, 45%, 78%)`
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ display: 'block', borderRadius: 4 }}
    >
      <defs>
        <linearGradient id={`bg-${hue}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={readingPalette.cream} />
          <stop offset="100%" stopColor={accentSoft} />
        </linearGradient>
        <filter id="g-shadow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>
      <rect width={width} height={height} fill={`url(#bg-${hue})`} />
      <line
        x1={width * 0.1}
        y1={height * 0.18}
        x2={width * 0.9}
        y2={height * 0.18}
        stroke={accent}
        strokeWidth="1"
        opacity="0.35"
      />
      <line
        x1={width * 0.1}
        y1={height * 0.82}
        x2={width * 0.9}
        y2={height * 0.82}
        stroke={accent}
        strokeWidth="1"
        opacity="0.35"
      />
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        fontSize={Math.round(width * 0.42)}
        fill={accent}
        dominantBaseline="middle"
      >
        {initials}
      </text>
      <text
        x="50%"
        y={height * 0.73}
        textAnchor="middle"
        fontFamily="'Nunito', sans-serif"
        fontSize={Math.round(width * 0.08)}
        fill={readingPalette.inkSoft}
      >
        {title.length > 20 ? title.slice(0, 18) + '…' : title}
      </text>
    </svg>
  )
}

export default function BookCover({
  title,
  author,
  coverUrl,
  layoutId,
  size = 'md',
  className = '',
}: BookCoverProps) {
  const { w, h } = SIZES[size]

  const content = coverUrl ? (
    <Image
      src={coverUrl}
      alt={`Portada de ${title}`}
      width={w}
      height={h}
      className="block object-cover"
      style={{
        borderRadius: 4,
        width: '100%',
        height: '100%',
      }}
      unoptimized
    />
  ) : (
    <FallbackCover title={title} author={author} width={w} height={h} />
  )

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative overflow-hidden ${className}`}
      style={{
        width: w,
        height: h,
        boxShadow:
          '0 2px 4px rgba(76,10,31,0.15), 0 8px 20px -4px rgba(76,10,31,0.25), inset 2px 0 0 rgba(0,0,0,0.12), inset -1px 0 0 rgba(255,255,255,0.15)',
        borderRadius: 4,
      }}
    >
      {content}
      {/* Lomo sombreado a la izquierda (efecto libro) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[6%]"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0.02) 60%, transparent)',
        }}
      />
      {/* Brillo suave arriba */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[8%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.22), transparent)',
        }}
      />
    </motion.div>
  )
}
