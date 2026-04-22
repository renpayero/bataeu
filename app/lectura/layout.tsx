'use client'

import { LayoutGroup } from 'framer-motion'
import PaperTexture from '@/components/lectura/PaperTexture'
import TimerRecoveryBanner from '@/components/lectura/TimerRecoveryBanner'

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutGroup id="lectura">
      <div className="reading-scope relative">
        <PaperTexture />
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <TimerRecoveryBanner />
          {children}
        </div>
      </div>
    </LayoutGroup>
  )
}
