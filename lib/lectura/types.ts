export interface BookData {
  id: number
  title: string
  author: string
  coverUrl: string | null
  isbn: string | null
  pages: number | null
  year: number | null
  genre: string | null
  format: string
  status: string
  priority: number
  currentPage: number | null
  location: string | null
  seriesId: number | null
  seriesOrder: number | null
  series: { id: number; name: string; totalBooks: number | null } | null
  startDate: string | null
  endDate: string | null
  rating: number | null
  lentTo: string | null
  lentAt: string | null
  moods: string[]
  abandonReason: string | null
  abandonNote: string | null
  googleBooksId: string | null
  createdAt: string
  updatedAt: string
  quotes?: Array<{ id: number }> | QuoteData[]
}

export interface QuoteData {
  id: number
  bookId: number
  text: string
  page: number | null
  tags: string[]
  createdAt: string
  book?: {
    id: number
    title: string
    author: string
    coverUrl: string | null
  }
}

export interface BookInput {
  title: string
  author: string
  coverUrl?: string | null
  isbn?: string | null
  pages?: number | null
  year?: number | null
  genre?: string | null
  format?: string
  status?: string
  priority?: number
  currentPage?: number | null
  location?: string | null
  seriesName?: string | null
  seriesOrder?: number | null
  startDate?: string | null
  moods?: string[]
  googleBooksId?: string | null
}

export type PomodoroType = '25-5' | '45-15' | 'libre' | 'custom'

export interface ReadingSessionData {
  id: number
  bookId: number | null
  startedAt: string
  endedAt: string
  durationMins: number
  pagesRead: number | null
  startPage: number | null
  endPage: number | null
  pomodoroType: PomodoroType
  customMins: number | null
  note: string | null
  createdAt: string
  book?: {
    id: number
    title: string
    author: string
    coverUrl: string | null
  } | null
}

export interface ReadingSessionInput {
  bookId?: number | null
  startedAt: string
  endedAt: string
  durationMins: number
  pagesRead?: number | null
  startPage?: number | null
  endPage?: number | null
  pomodoroType?: PomodoroType
  customMins?: number | null
  note?: string | null
}

export interface StreakData {
  current: number
  longest: number
  hasSessionToday: boolean
  lastSessionAt: string | null
}

export interface SessionStats {
  today: { mins: number; sessions: number }
  thisWeek: { mins: number; sessions: number; days: number }
  thisMonth: { mins: number; sessions: number; days: number }
  allTime: { mins: number; sessions: number; booksRead: number }
  currentStreak: number
  longestStreak: number
  lastSessionAt: string | null
}
