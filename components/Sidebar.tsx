'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavTab {
  href: string
  label: string
  icon: string
}

const MAIN_TABS: NavTab[] = [
  { href: '/', label: 'Nosotros', icon: '💕' },
  { href: '/ciclo', label: 'Ciclo', icon: '🩸' },
  { href: '/antojos', label: 'Antojos', icon: '🍫' },
  { href: '/galeria', label: 'Nuestra galería', icon: '📸' },
  { href: '/lectura', label: 'Lectura', icon: '📖' },
]

const LECTURA_SUBTABS: NavTab[] = [
  { href: '/lectura', label: 'Inicio', icon: '🕯️' },
  { href: '/lectura/biblioteca', label: 'Biblioteca', icon: '📚' },
  { href: '/lectura/frases', label: 'Frases', icon: '✒️' },
  { href: '/lectura/sesiones', label: 'Sesiones', icon: '🔥' },
]

function matchActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Cierra el drawer al cambiar de ruta en mobile
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const inLectura = pathname === '/lectura' || pathname.startsWith('/lectura/')
  const activeMain = MAIN_TABS.find((t) => matchActive(pathname, t.href))?.href ?? null

  const sidebarContent = (
    <>
      <div className="px-6 py-6">
        <Link href="/" className="inline-block">
          <motion.span
            className="font-playfair text-2xl font-bold text-rose-700 select-none"
            whileHover={{ scale: 1.04, rotate: -1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            Bata Eu <span className="text-rose-500">🩸</span>
          </motion.span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {MAIN_TABS.map((tab) => {
          const isActive = activeMain === tab.href
          return (
            <div key={tab.href}>
              <Link
                href={tab.href}
                className="relative flex items-center gap-3 px-4 py-3 rounded-2xl group"
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(244, 63, 94, 0.14), rgba(236, 72, 153, 0.1))',
                      border: '1px solid rgba(244, 63, 94, 0.35)',
                      boxShadow: '0 4px 14px rgba(244, 63, 94, 0.12)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 text-xl">{tab.icon}</span>
                <span
                  className={`relative z-10 text-sm font-bold transition-colors ${
                    isActive ? 'text-rose-700' : 'text-gray-500 group-hover:text-rose-600'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>

              {/* Sub-tabs anidados cuando estás en /lectura */}
              <AnimatePresence>
                {tab.href === '/lectura' && inLectura && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="ml-5 pl-3 space-y-0.5 overflow-hidden border-l"
                    style={{ borderColor: 'rgba(244, 63, 94, 0.25)' }}
                  >
                    {LECTURA_SUBTABS.map((sub) => {
                      const isSubActive =
                        sub.href === '/lectura'
                          ? pathname === '/lectura'
                          : pathname.startsWith(sub.href)
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
                          style={{
                            background: isSubActive
                              ? 'rgba(244, 63, 94, 0.08)'
                              : 'transparent',
                          }}
                        >
                          <span className="text-sm">{sub.icon}</span>
                          <span
                            className={`text-xs font-semibold transition-colors ${
                              isSubActive
                                ? 'text-rose-700'
                                : 'text-gray-500 hover:text-rose-600'
                            }`}
                          >
                            {sub.label}
                          </span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </nav>

      <div className="px-6 py-4 text-[10px] text-gray-400 uppercase tracking-wider">
        Hecho con amor
      </div>
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar: siempre visible ≥ md ─────── */}
      <aside
        className="hidden md:flex fixed top-0 left-0 h-screen w-60 z-40 flex-col glass-strong"
        style={{
          background: 'rgba(255, 241, 244, 0.82)',
          borderRight: '1px solid rgba(244, 63, 94, 0.18)',
        }}
      >
        {sidebarContent}
      </aside>

      {/* ── Mobile hamburger button ──────────────────── */}
      <motion.button
        onClick={() => setOpen(true)}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="md:hidden fixed top-4 left-4 z-40 w-11 h-11 rounded-2xl flex items-center justify-center glass-strong"
        aria-label="Abrir menú"
      >
        <span className="flex flex-col gap-[4px]">
          <span className="block w-5 h-[2px] bg-rose-600 rounded-full" />
          <span className="block w-5 h-[2px] bg-rose-600 rounded-full" />
          <span className="block w-5 h-[2px] bg-rose-600 rounded-full" />
        </span>
      </motion.button>

      {/* ── Mobile drawer ────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(159, 18, 57, 0.45)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="md:hidden fixed top-0 left-0 h-full w-72 z-50 flex flex-col glass-strong"
              style={{
                background: 'rgba(255, 241, 244, 0.96)',
                borderRight: '1px solid rgba(244, 63, 94, 0.22)',
                boxShadow: '4px 0 32px rgba(159, 18, 57, 0.18)',
              }}
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl text-rose-600 hover:bg-rose-100/60"
              >
                ✕
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
