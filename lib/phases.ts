import type { Phase } from './cycleLogic'

// ─────────────────────────────────────────────────────────────────────────────
// Mensajes de la mascota (burbuja de diálogo) — escritos en primera persona
// La mascota los dice como si fuera ella hablando
// ─────────────────────────────────────────────────────────────────────────────
export const phaseMessages: Record<Phase, string[]> = {
  1: [
    'Ugh... estoy agotada y súper sensible 😔 Lo único que pido es Netflix, mimos y mi comida favorita. Cero planes locos, por favor.',
    'No me hagas hablar mucho hoy... 😮‍💨 El sofá, una mantita y algo rico. Eso es todo lo que necesito del mundo y de vos.',
    'Estoy en modo supervivencia 🩸 No me juzgues si lloro con una publicidad de perros. Es lo que hay.',
    'Aviso oficial: hoy no tengo energía ni para discutir. Dame mimos y callate un poco. Con amor. 💕',
  ],
  2: [
    '¡Estoy con toda la energía! 🌱 Sácame a pasear, propone algo nuevo, cine, cena, un plan copado. Estoy lista para todo.',
    '¿Plan? ¿Cuál plan? Yo tengo 17 ideas y todas me emocionan 🌟 Vamos a donde quieras, hoy todo me parece bien.',
    'Me siento invencible 💪 Si no salimos a hacer algo esta semana, me invento yo sola las aventuras. Avisado estás.',
    'Energía al tope, humor increíble y te veo muy bien hoy 😏 Aprovechá porque esto dura unos días nomás.',
  ],
  3: [
    '🔥 Pico máximo. Seguridad al 100, líbido a full. Es momento de un plan bien romántico. Todo adentro. 😏',
    'Hoy me siento la mujer más hermosa del universo 😍 Y vos tenés suerte de estar cerca. No lo olvides.',
    'Atención: nivel de seducción en máximos históricos 📈 Planificá algo lindo o me lo planeo yo y vas a tener que seguirme el ritmo.',
    '¿Cenamos a la luz de las velas? ¿O nos saltamos directo al postre? 🕯️😏 Vos decidís. Igual gano yo.',
  ],
  4: [
    '😤 Aviso: tengo poca paciencia y me duele todo. Necesito snacks, mi comida favorita, paciencia infinita y mucho amor. Venís preparado, ¿no?',
    'No es que esté de mal humor... es que TODO me molesta un poco 😤 Empezá por traerme algo rico y después hablamos.',
    'Me duele la panza, tengo sueño, y si me mirás raro te juro que lloro 😭 Pero también te amo. Son las dos cosas a la vez.',
    'Disclaimer: mis respuestas pueden ser más cortantes de lo habitual 📋 No es personal. Bueno, a veces sí. Traé chocolate.',
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSEJOS DEL NOVIO — aparecen en el modal al clickear un día del calendario
// ⬇️ EDITÁ ESTO, acá vas a poner tus tips personales para cada fase ⬇️
// ─────────────────────────────────────────────────────────────────────────────
export const boyfriendTips: Record<Phase, string> = {
  1: 'Modo campo minado. Moverse despacio, hablar poco, traer medialunas. No preguntes "¿qué tenés?" porque YA SABÉS qué tiene. No hagas ruido. Suerte, soldado. 🍩',
  2: 'Está de buen humor y con energía. La única semana donde podés proponer esa película de acción que a ella le parece "meh". Aprovechá o arrepentite para siempre. 🎬',
  3: 'No sé qué hiciste bien estos días, pero seguí haciéndolo. Es tu momento, campeón. No lo arruines diciendo algo raro. En serio. Cerrá la boca y sonreí. 🏆',
  4: 'Bienvenido al modo difícil. Armáte de paciencia, chocolate y respuestas de dos palabras. Esto también pasa. (No se lo digas. Nunca jamás se lo digas.) 🍫',
}

// ─────────────────────────────────────────────────────────────────────────────
// Metadatos de cada fase (nombre, ícono, colores Tailwind)
// ─────────────────────────────────────────────────────────────────────────────
export const phaseInfo: Record<
  Phase,
  { name: string; icon: string; bgColor: string; textColor: string; borderColor: string; bodyColor: string }
> = {
  1: {
    name: 'Menstruación',
    icon: '🩸',
    bgColor: 'bg-red-100',
    textColor: 'text-red-900',
    borderColor: 'border-red-200',
    bodyColor: '#7f1d1d',
  },
  2: {
    name: 'Folicular',
    icon: '🌱',
    bgColor: 'bg-green-50',
    textColor: 'text-green-900',
    borderColor: 'border-green-200',
    bodyColor: '#be123c',
  },
  3: {
    name: 'Ovulación',
    icon: '🔥',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-900',
    borderColor: 'border-pink-200',
    bodyColor: '#9d174d',
  },
  4: {
    name: 'Lútea',
    icon: '😤',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-200',
    bodyColor: '#4c1d95',
  },
}

export const phaseDayColors: Record<Phase, string> = {
  1: 'bg-red-300 hover:bg-red-400',
  2: 'bg-green-200 hover:bg-green-300',
  3: 'bg-pink-400 hover:bg-pink-500',
  4: 'bg-purple-200 hover:bg-purple-300',
}

export const phaseTextColors: Record<Phase, string> = {
  1: 'text-red-900',
  2: 'text-green-900',
  3: 'text-pink-900',
  4: 'text-purple-900',
}
