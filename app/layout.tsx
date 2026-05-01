import type { Metadata, Viewport } from 'next'
import { Nunito, Playfair_Display } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/ClientShell'
import RegisterSW from '@/components/RegisterSW'

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
  title: 'Bata Eu',
  description: 'Nuestra cápsula',
  applicationName: 'Bata Eu',
  appleWebApp: {
    capable: true,
    title: 'Bata Eu',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#f43f5e',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${nunito.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-nunito antialiased">
        <ClientShell>{children}</ClientShell>
        <RegisterSW />
      </body>
    </html>
  )
}
