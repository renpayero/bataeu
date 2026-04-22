import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Fija el root del workspace: evita que Next elija el package-lock.json de
  // C:\Users\renzo por error (ver warning de dev server) y silencia la
  // recompilación/detección duplicada que contribuía a spawn workers extra.
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'books.google.com' },
      { protocol: 'http', hostname: 'books.google.com' },
      { protocol: 'https', hostname: 'books.googleusercontent.com' },
      { protocol: 'https', hostname: 'covers.openlibrary.org' },
    ],
  },
}

export default nextConfig
