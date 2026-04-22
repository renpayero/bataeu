import { NextResponse } from 'next/server'
import { mapGoogleSearch, type GoogleBooksResult } from '@/lib/lectura/googleBooks'
import { searchOpenLibrary } from '@/lib/lectura/openLibrary'

type Source = 'google' | 'openlibrary' | 'none'

// Re-ordena resultados priorizando el idioma deseado sin descartar los demás.
// Mantiene estable el orden relativo dentro de cada bucket (preserva el
// ranking original de Google/Open Library para relevancia).
function rankByLanguage<T extends { language: string | null }>(
  items: T[],
  preferredLang = 'es'
): T[] {
  const pref: T[] = []
  const rest: T[] = []
  for (const it of items) {
    if (it.language === preferredLang) pref.push(it)
    else rest.push(it)
  }
  return [...pref, ...rest]
}

async function searchGoogle(q: string): Promise<
  | { ok: true; results: GoogleBooksResult[] }
  | { ok: false; rateLimited: boolean }
> {
  const url = new URL('https://www.googleapis.com/books/v1/volumes')
  url.searchParams.set('q', q)
  url.searchParams.set('maxResults', '16')
  url.searchParams.set('printType', 'books')
  // NOTA: no uso langRestrict para que cualquier búsqueda devuelva libros.
  // El preferred language se aplica en el re-ranking posterior.
  const key = process.env.GOOGLE_BOOKS_API_KEY
  if (key) url.searchParams.set('key', key)

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 * 24 },
  })

  if (res.status === 429 || res.status === 403) {
    return { ok: false, rateLimited: true }
  }
  if (!res.ok) return { ok: false, rateLimited: false }
  const data = await res.json()
  return { ok: true, results: mapGoogleSearch(data) }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim()

    if (!q) {
      return NextResponse.json(
        { error: 'q es requerido' },
        { status: 400 }
      )
    }

    // 1) Google Books primero.
    const g = await searchGoogle(q)
    if (g.ok && g.results.length > 0) {
      return NextResponse.json({
        results: rankByLanguage(g.results, 'es'),
        source: 'google' as Source,
      })
    }

    // 2) Fallback a Open Library (no requiere API key).
    try {
      const olResults = await searchOpenLibrary(q)
      if (olResults.length > 0) {
        return NextResponse.json({
          results: rankByLanguage(olResults, 'es'),
          source: 'openlibrary' as Source,
        })
      }
    } catch {
      // Open Library falló también
    }

    // 3) Nada encontrado.
    return NextResponse.json({
      results: [],
      source: 'none' as Source,
      rateLimited: !g.ok && g.rateLimited,
    })
  } catch (err) {
    console.error('[GET /api/lectura/google-books/search]', err)
    return NextResponse.json(
      { error: 'search_failed', results: [] },
      { status: 200 }
    )
  }
}
