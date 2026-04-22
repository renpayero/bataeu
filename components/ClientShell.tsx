'use client'

import Sidebar from './Sidebar'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="md:pl-60 min-h-screen pt-20 md:pt-0">
        {children}
      </main>
    </>
  )
}
