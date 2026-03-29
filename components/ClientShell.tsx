'use client'

import NavBar from './NavBar'

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="pb-24 md:pb-0 md:pt-16">
        {children}
      </main>
    </>
  )
}
