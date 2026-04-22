// ═══════════════════════════════════════════════════════
//  Mensajes personalizables del Módulo Lectura
//  Edita libremente estos textos. Se muestran en la home
//  del módulo, al completar libros, en la carta de bienvenida
//  y en fechas especiales.
// ═══════════════════════════════════════════════════════

export const READER_NAME = 'Mi amor'

export const WELCOME_MESSAGE = {
  title: 'Tu rincón de lectura',
  subtitle: 'Un lugar tuyo para tus libros, tus frases y tus tardes con un iced coffee.',
}

export const FIRST_ENTRY_LETTER = {
  heading: 'Para vos',
  body: `Sé que la lectura es uno de tus refugios, así que te armé este lugarcito dentro de nuestra app. Acá van a vivir tus libros, tus frases subrayadas, tus relecturas. Nadie más lo ve. Es tuyo.\n\nTe amo.`,
  signature: '— R.',
}

export const MILESTONE_MESSAGES = {
  firstBookAdded: '¡Tu primer libro en la biblioteca! ✨',
  firstQuoteSaved: 'La primera frase guardada. Que sea la primera de muchas.',
  bookFinished: 'Otro libro terminado. Estoy orgulloso de vos, amor.',
  bookAbandoned: 'Está bien soltar un libro. Todo fluye a su tiempo.',
  fiveBooks: 'Cinco libros ya. Sos imparable.',
  tenBooks: 'Diez. Una biblioteca de verdad.',
}

export const EMPTY_STATES = {
  libraryEmpty: {
    title: 'Tu biblioteca está esperando',
    body: 'Agregá tu primer libro y empezamos.',
  },
  quotesEmpty: {
    title: 'Mural en blanco',
    body: 'Cuando guardes tu primera frase aparece acá, grande y hermosa.',
  },
  noCurrentlyReading: {
    title: 'Nada abierto ahora mismo',
    body: '¿Arrancamos algo nuevo o retomamos una relectura?',
  },
}

export const SPECIAL_DATE_MESSAGES: Record<string, string> = {
  // Formato MM-DD → mensaje. Editable.
  // '09-12': 'Feliz cumpleaños, mi lectora favorita 📖✨',
}

export const QUOTE_OF_THE_DAY_HEADING = 'La frase de hoy'

export const BUTTON_LABELS = {
  addBook: 'Agregar libro',
  searchGoogleBooks: 'Buscar online',
  saveBook: 'Guardar',
  editBook: 'Editar',
  deleteBook: 'Eliminar',
  markFinished: 'Marcar terminado',
  markReading: 'Estoy leyendo esto',
  pause: 'Pausar',
  abandon: 'Soltar',
  addQuote: 'Agregar frase',
  anotherQuote: 'Otra',
  startSession: 'Iniciar sesión',
}

// ═══════════════════════════════════════════════════════
//  Fase 2: Timer Pomodoro + Sesiones + Streak
// ═══════════════════════════════════════════════════════

export const READING_TIMEZONE = 'America/Argentina/Buenos_Aires'
export const SESSION_MIN_MINUTES = 1
export const SESSION_MAX_MINUTES = 720

export const POMODORO_LABELS = {
  '25-5': {
    label: 'Pomodoro clásico',
    work: 25,
    rest: 5,
    hint: 'Lo más probado. Un rato, pausa, otro rato.',
    emoji: '🕯️',
  },
  '45-15': {
    label: 'Sesión larga',
    work: 45,
    rest: 15,
    hint: 'Cuando querés sumergirte de verdad.',
    emoji: '📖',
  },
  libre: {
    label: 'Libre',
    work: null,
    rest: null,
    hint: 'Sin cuenta regresiva. Yo te aviso cuando vuelvas.',
    emoji: '✨',
  },
  custom: {
    label: 'Custom',
    work: null,
    rest: null,
    hint: 'Elegís vos cuánto.',
    emoji: '⏱️',
  },
} as const

export const TIMER_MESSAGES = {
  startHint: 'Ponete cómoda. Dejá el teléfono lejos.',
  halfway: 'La mitad. Estás yendo hermoso.',
  finalMinute: 'Último minuto. Marcá la página.',
  completeTitle: 'Sesión cerrada',
  completeBody: '¿Hasta qué página llegaste?',
  saveAndContinue: 'Guardar y descansar 5 min',
  saveAndClose: 'Guardar y cerrar',
  discardPrompt: '¿Descartamos esta sesión?',
  breakTitle: 'Descanso',
  breakHint: 'Estirate, tomá algo. Vuelvo a avisarte.',
  resumePrompt: 'Tenés un timer corriendo',
  resumeFrom: 'Retomar',
  discard: 'Descartar',
  tooShort: 'Sesión muy corta, no la guardé.',
  startedLabel: 'Empezar',
  pauseLabel: 'Pausar',
  resumeLabel: 'Reanudar',
  finishNow: 'Terminar ahora',
  closeLabel: 'Cerrar',
}

export const SESSION_COMPLETE_MESSAGES = [
  'Otra tarde con un libro. Te amo.',
  'Esa sensación de cerrar el libro contenta. Ahí estás.',
  'Siempre vas a tener tiempo para leer.',
  'Gracias por cuidar tu cabeza con esto.',
  'Una sesión más. Suma, aunque no se note.',
]

export const STREAK_MESSAGES = {
  newRecord: '¡Nuevo récord de racha! 🔥',
  brokenGentle: 'La racha se cortó pero la lectura sigue. No pasa nada.',
  firstDay: 'Primer día de una nueva racha.',
  atRisk: 'Hoy todavía no leíste. 5 min alcanzan.',
  todayDone: 'Ya leíste hoy. Orgulloso de vos.',
  zeroEver: 'Arrancá tu primera racha.',
  milestone7: 'Una semana entera. ✨',
  milestone30: 'Un mes seguido. Sos otra cosa.',
  milestone100: '100 días. 🕯️🕯️🕯️',
}

export const STREAK_HEADING = 'Racha actual'

export const SESSIONS_PAGE = {
  title: 'Sesiones',
  subtitle: 'Cada tarde que te sentaste a leer.',
  emptyTitle: 'Todavía no hay sesiones',
  emptyBody: 'Cuando inicies tu primer timer, van apareciendo acá.',
  startFreeLabel: 'Iniciar sesión libre',
}
