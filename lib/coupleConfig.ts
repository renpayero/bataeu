export const COUPLE_START_DATE = new Date('2025-05-04T12:00:00.000Z')
export const COUPLE_NAMES = { name1: 'Renzo', name2: 'Camila' }
export const COUPLE_NICKNAMES = { name1: 'Ren', name2: 'Cami' }

// Quién es el "owner" del ciclo (recibe notifs del ciclo).
// Usá 'name1' o 'name2' según quien lo siga.
export const CYCLE_OWNER: 'name1' | 'name2' = 'name2'

export function getCycleOwnerName(): string {
  return COUPLE_NICKNAMES[CYCLE_OWNER]
}
