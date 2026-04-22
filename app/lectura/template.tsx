'use client'

import { motion } from 'framer-motion'

// Importante: no usar transform/rotate/x/perspective aquí. Framer Motion deja
// transform inline tras animar, y un ancestor con transform rompe position:fixed
// de los modales descendientes (backdrop recortado al área del contenido).
// Fade suave con solo opacity preserva el feel sin romper los modales.
export default function ReadingTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
