'use client'

import Sidebar from './Sidebar'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="md:pl-60 min-h-screen pt-[calc(env(safe-area-inset-top)+5rem)] md:pt-0">
        {children}
      </main>
    </>
  )
}
