export interface GoogleBooksResult {
  googleBooksId: string
  title: string
  authors: string[]
  coverUrl: string | null
  isbn: string | null
  pages: number | null
  year: number | null
  genre: string | null
  description: string | null
  language: string | null
}

interface GoogleVolume {
  id?: string
  volumeInfo?: {
    title?: string
    authors?: string[]
    publishedDate?: string
    pageCount?: number
    categories?: string[]
    description?: string
    language?: string
    industryIdentifiers?: Array<{ type?: string; identifier?: string }>
    imageLinks?: {
      thumbnail?: string
      smallThumbnail?: string
      small?: string
      medium?: string
    }
  }
}

interface GoogleSearchResponse {
  items?: GoogleVolume[]
}

function upgradeCoverUrl(raw?: string): string | null {
  if (!raw) return null
  // Google Books devuelve http:// por defecto y con zoom=1.
  // Forzar https + zoom=0 (mejor resolución) y remover edge curl.
  return raw
    .replace(/^http:\/\//, 'https://')
    .replace(/&edge=curl/g, '')
    .replace(/zoom=\d/g, 'zoom=0')
}

function extractIsbn(
  identifiers?: Array<{ type?: string; identifier?: string }>
): string | null {
  if (!identifiers) return null
  const iso13 = identifiers.find((i) => i.type === 'ISBN_13')?.identifier
  if (iso13) return iso13
  const iso10 = identifiers.find((i) => i.type === 'ISBN_10')?.identifier
  return iso10 ?? null
}

function extractYear(publishedDate?: string): number | null {
  if (!publishedDate) return null
  const m = publishedDate.match(/^(\d{4})/)
  return m ? parseInt(m[1], 10) : null
}

export function mapGoogleVolume(v: GoogleVolume): GoogleBooksResult | null {
  const info = v.volumeInfo
  if (!v.id || !info || !info.title) return null
  const coverUrl = upgradeCoverUrl(
    info.imageLinks?.medium ??
      info.imageLinks?.small ??
      info.imageLinks?.thumbnail ??
      info.imageLinks?.smallThumbnail ??
      undefined
  )
  return {
    googleBooksId: v.id,
    title: info.title,
    authors: info.authors ?? [],
    coverUrl,
    isbn: extractIsbn(info.industryIdentifiers),
    pages: info.pageCount ?? null,
    year: extractYear(info.publishedDate),
    genre: info.categories?.[0] ?? null,
    description: info.description ?? null,
    language: info.language?.toLowerCase() ?? null,
  }
}

export function mapGoogleSearch(
  data: GoogleSearchResponse
): GoogleBooksResult[] {
  return (data.items ?? [])
    .map(mapGoogleVolume)
    .filter((r): r is GoogleBooksResult => r !== null)
}
