// Cartas de bienvenida que aparecen la primera vez que se entra a cada módulo.
// Editá estos textos libremente. Las claves de localStorage se borran con el
// botón "Resetear pantallas de bienvenida" en la home.

export interface WelcomeLetterContent {
  storageKey: string
  heading: string
  body: string
  signature: string
  buttonLabel: string
  seal: string
  envelope: { from: string; via: string; to: string }
  buttonGradient: { from: string; to: string }
}

export const WELCOME_NOSOTROS: WelcomeLetterContent = {
  storageKey: 'welcome_seen_nosotros_v1',
  heading: 'Para vos, mi vida',
  body: `Hace un año que estás conmigo y todavía no me cae la ficha de que sea verdad. Cada mañana que me despierto al lado tuyo me acuerdo de la suerte que tengo.

Sé que no soy bueno para escribirte cartas, pero dentro de esta aplicación vas a encontrar muchas cartitas. Y detrás de todo esto hay más de diez mil líneas de código que escribí para vos 🤍.

Vos sabés que lo mío no son las palabras lindas, pero quería que tuvieras algo que sea solo nuestro. Un rinconcito al que entres y te acuerdes de todo lo que somos.

Gracias por aguantarme. Por reírte conmigo, por bancarme los días raros, por elegirme cada mañana de nuevo.

Te amo más que ayer y menos que mañana.`,
  signature: '— Tuyo, R.',
  buttonLabel: 'Entrar a lo nuestro',
  seal: 'R',
  envelope: { from: '#fbcfe8', via: '#f43f5e', to: '#9f1239' },
  buttonGradient: { from: '#f43f5e', to: '#be123c' },
}

export const WELCOME_CICLO: WelcomeLetterContent = {
  storageKey: 'welcome_seen_ciclo_v1',
  heading: 'Cómo arrancó todo esto',
  body: `Todo empezó con un posteo de Instagram que me mandaste un día. Ese que explicaba cómo tratarte según el día de tu ciclo. Lo guardé. Lo leí varias veces, para entenderte un poco mejor.

De ahí salió la idea. Pensé en armar un calendarito chiquito, nada más. Pero después fui sumando cosas y se fue convirtiendo en algo más lindo.

Ahora es nuestro.`,
  signature: '— R.',
  buttonLabel: 'Ver mi ciclo',
  seal: 'R',
  envelope: { from: '#fecdd3', via: '#f472b6', to: '#9d174d' },
  buttonGradient: { from: '#ec4899', to: '#9d174d' },
}

export const WELCOME_ANTOJOS: WelcomeLetterContent = {
  storageKey: 'welcome_seen_antojos_v1',
  heading: 'Para que no me olvide',
  body: `Sé que mi memoria es un desastre. Me decís algo un martes y para el viernes ya lo perdí.

Por eso te armé esto. Cuando se te antoje algo, anotalo acá. Yo lo voy a ver y no se me va a escapar.

Ojo, los antojos se borran solos a las 24 horas. Así que estate atenta a cargarlos a tiempo.`,
  signature: '— R.',
  buttonLabel: 'Anotar mis antojos',
  seal: 'R',
  envelope: { from: '#fde68a', via: '#f59e0b', to: '#b45309' },
  buttonGradient: { from: '#f59e0b', to: '#b45309' },
}

export const WELCOME_GALERIA: WelcomeLetterContent = {
  storageKey: 'welcome_seen_galeria_v1',
  heading: 'Nuestros momentos',
  body: `Esto es para no dejar morir nada de lo que vivimos juntos. Las fotos que se nos pierden en mil carpetas, los videos que mandamos por WhatsApp y después se borran solos, todo eso.

Acá vamos a armarnos un álbum compartido. Nuestro, que crezca con nosotros.`,
  signature: '— R.',
  buttonLabel: 'Abrir el álbum',
  seal: 'R',
  envelope: { from: '#ddd6fe', via: '#a78bfa', to: '#5b21b6' },
  buttonGradient: { from: '#a78bfa', to: '#5b21b6' },
}

export const ALL_WELCOME_KEYS = [
  WELCOME_NOSOTROS.storageKey,
  WELCOME_CICLO.storageKey,
  WELCOME_ANTOJOS.storageKey,
  WELCOME_GALERIA.storageKey,
]
