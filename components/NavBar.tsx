'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const tabs = [
  { href: '/', label: 'Nosotros', icon: '💕' },
  { href: '/ciclo', label: 'Ciclo', icon: '🩸' },
  { href: '/antojos', label: 'Antojos', icon: '🍕' },
]

export default function NavBar() {
  const pathname = usePathname()

  // Match active tab: exact match for "/" , startsWith for others
  const activeHref = tabs.find((t) =>
    t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
  )?.href ?? '/'

  return (
    <>
      {/* ── Mobile: bottom bar ─────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass-strong rounded-t-3xl px-2 py-2 mx-2 mb-0">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeHref === tab.href
              return (
                <Link key={tab.href} href={tab.href} className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl">
                  {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-rose-100/70 rounded-2xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <motion.span
                    className="text-xl relative z-10"
                    animate={{ scale: isActive ? 1.15 : 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {tab.icon}
                  </motion.span>
                  <span className={`text-[10px] font-bold relative z-10 transition-colors ${isActive ? 'text-rose-600' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* ── Desktop: top bar ───────────────────────────── */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="glass-strong">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <motion.span
              className="font-playfair text-xl font-bold text-rose-700 cursor-default select-none"
              whileHover={{ scale: 1.06, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              Hormonitas 🩸
            </motion.span>

            <div className="flex items-center gap-1">
              {tabs.map((tab) => {
                const isActive = activeHref === tab.href
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="relative flex items-center gap-1.5 px-4 py-2 rounded-xl"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabDesktop"
                        className="absolute inset-0 bg-rose-100/70 rounded-xl"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10">{tab.icon}</span>
                    <span className={`text-sm font-bold relative z-10 transition-colors ${isActive ? 'text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      {tab.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
