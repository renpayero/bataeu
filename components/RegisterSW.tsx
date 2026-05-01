'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') return

    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.error('[SW] register failed:', err)
    })
  }, [])

  return null
}
