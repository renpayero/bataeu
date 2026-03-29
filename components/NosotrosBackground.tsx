'use client'

import { motion } from 'framer-motion'

function FloatingHeart({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute text-rose-200/40 pointer-events-none select-none"
      style={{ left: x, bottom: '-20px', fontSize: size }}
      animate={{ y: [0, -800], opacity: [0, 0.6, 0], rotate: [0, 20, -10, 0] }}
      transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      ♥
    </motion.div>
  )
}

export default function NosotrosBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Radial base */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 20% 30%, #fecdd388 0%, transparent 60%)' }}
      />

      {/* Blob 1 */}
      <motion.div
        className="absolute rounded-full opacity-30 blur-3xl"
        style={{ width: 480, height: 480, top: '5%', left: '5%' }}
        animate={{ x: [0, 60, -30, 0], y: [0, -80, 40, 0], backgroundColor: '#fda4af' }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute rounded-full opacity-25 blur-3xl"
        style={{ width: 420, height: 420, top: '40%', right: '5%' }}
        animate={{ x: [0, -70, 40, 0], y: [0, 60, -50, 0], backgroundColor: '#f472b6' }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />

      {/* Blob 3 */}
      <motion.div
        className="absolute rounded-full opacity-20 blur-3xl"
        style={{ width: 360, height: 360, bottom: '10%', left: '35%' }}
        animate={{ x: [0, 50, -60, 0], y: [0, -40, 70, 0], backgroundColor: '#fecdd3' }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />

      {/* White overlay */}
      <div className="absolute inset-0 bg-white/40" />

      {/* Floating hearts */}
      <FloatingHeart delay={0} x="10%" size={18} />
      <FloatingHeart delay={2} x="30%" size={14} />
      <FloatingHeart delay={4} x="55%" size={20} />
      <FloatingHeart delay={1} x="75%" size={16} />
      <FloatingHeart delay={3} x="90%" size={12} />
    </div>
  )
}
