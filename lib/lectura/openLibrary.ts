import type { GoogleBooksResult } from './googleBooks'

interface OpenLibraryDoc {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  number_of_pages_median?: number
  cover_edition_key?: string
  cover_i?: number
  isbn?: string[]
  subject?: string[]
  language?: string[] // códigos ISO 639-3 (spa, eng, ita…)
}

interface OpenLibraryResponse {
  docs?: OpenLibraryDoc[]
}

function buildCoverUrl(doc: OpenLibraryDoc): string | null {
  if (doc.cover_i) {
    return `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
  }
  if (doc.cover_edition_key) {
    return `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`
  }
  const isbn = doc.isbn?.[0]
  if (isbn) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
  }
  return null
}

// Normaliza códigos ISO 639-3 / 639-1 de Open Library al formato
// 'es' | 'en' | 'it' etc para unificar con Google Books.
const LANG_MAP: Record<string, string> = {
  spa: 'es',
  eng: 'en',
  ita: 'it',
  fre: 'fr',
  fra: 'fr',
  por: 'pt',
  ger: 'de',
  deu: 'de',
}

export function mapOpenLibraryDoc(doc: OpenLibraryDoc): GoogleBooksResult | null {
  if (!doc.title || !doc.key) return null
  const rawLang = doc.language?.[0]?.toLowerCase() ?? null
  const language = rawLang ? LANG_MAP[rawLang] ?? rawLang : null
  return {
    googleBooksId: `ol:${doc.key}`,
    title: doc.title,
    authors: doc.author_name ?? [],
    coverUrl: buildCoverUrl(doc),
    isbn: doc.isbn?.[0] ?? null,
    pages: doc.number_of_pages_median ?? null,
    year: doc.first_publish_year ?? null,
    genre: doc.subject?.[0] ?? null,
    description: null,
    language,
  }
}

export async function searchOpenLibrary(q: string): Promise<GoogleBooksResult[]> {
  const url = new URL('https://openlibrary.org/search.json')
  url.searchParams.set('q', q)
  url.searchParams.set('limit', '12')
  url.searchParams.set('fields', [
    'key',
    'title',
    'author_name',
    'first_publish_year',
    'number_of_pages_median',
    'cover_edition_key',
    'cover_i',
    'isbn',
    'subject',
    'language',
  ].join(','))

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 24 },
    headers: { 'User-Agent': 'BataEu/1.0 (reading module)' },
  })
  if (!res.ok) return []
  const data = (await res.json()) as OpenLibraryResponse
  return (data.docs ?? [])
    .map(mapOpenLibraryDoc)
    .filter((r): r is GoogleBooksResult => r !== null)
}
