import type { Metadata } from 'next'
import { Nunito, Playfair_Display } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/ClientShell'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Hormonitas 🩸',
  description: 'Tu compañera del ciclo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-nunito antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
