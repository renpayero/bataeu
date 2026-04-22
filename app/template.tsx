'use client'

import { motion } from 'framer-motion'

export default function Template({ children }: { children: React.ReactNode }) {
  // No usar transform/y aquí: Framer Motion deja transform inline tras animar,
  // y un ancestor con transform rompe position:fixed de los modales descendientes
  // (los recorta al área del contenido). Solo animamos opacity para preservar el
  // fade sin crear un containing block.
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}
