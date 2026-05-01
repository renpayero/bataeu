// Limpia todo el estado client-side (localStorage) usado por la app:
// cartas de bienvenida, celebraciones de racha, timer activo de lectura,
// preferencias de notificaciones y mute. Usar antes de entregar la app
// al destinatario para que vea todas las pantallas "primera vez".

import { ALL_WELCOME_KEYS } from './welcomeLetters'

const EXACT_KEYS = [
  'reading_onboarded_v1',
  'reading_active_timer_v1',
  'reading_timer_muted_v1',
  'hormonitas-push-label',
  ...ALL_WELCOME_KEYS,
]

const PREFIX_KEYS = ['reading_streak_milestone_', 'welcome_seen_']

export function resetClientState(): { cleared: string[] } {
  if (typeof window === 'undefined') return { cleared: [] }
  const cleared: string[] = []

  for (const key of EXACT_KEYS) {
    if (localStorage.getItem(key) !== null) {
      localStorage.removeItem(key)
      cleared.push(key)
    }
  }

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (!key) continue
    if (PREFIX_KEYS.some((p) => key.startsWith(p))) {
      localStorage.removeItem(key)
      cleared.push(key)
    }
  }

  return { cleared }
}
