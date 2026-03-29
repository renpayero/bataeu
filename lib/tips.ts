export interface Tip {
  id: number
  phase: 'menstruacion' | 'folicular' | 'ovulacion' | 'lutea'
  emoji: string
  title: string
  message: string
  minDay?: number  // cycle day mínimo (inclusive) en que este tip tiene sentido
  maxDay?: number  // cycle day máximo (inclusive) en que este tip tiene sentido
}

export const tips: Tip[] = [
  // ─────────────────────────────────────────
  // FASE 1 — MENSTRUACIÓN (días 1-5)
  // ─────────────────────────────────────────
  { id: 1, phase: 'menstruacion', emoji: '🛋️', title: 'Modo bunker activado', message: 'Hoy no salimos. Ni a comprar. Ni a saludar al vecino. Si podés traer la comida sin hacer ruido, sos el héroe del día.' },
  { id: 2, phase: 'menstruacion', emoji: '🎬', title: 'Netflix o muerte', message: 'Preguntale qué quiere ver. Pero en serio, preguntale. No pongas lo que vos querés y esperes que ella diga "dale". Eso no va a terminar bien.' },
  { id: 3, phase: 'menstruacion', emoji: '🌡️', title: 'El termómetro emocional está roto', message: 'Puede estar bien, mal, llorando y riéndose en el mismo minuto. Es normal. No hagas preguntas. Solo abrazala.' },
  { id: 4, phase: 'menstruacion', emoji: '🍫', title: 'El chocolate no es opcional', message: 'No es un capricho. Es medicina. Comprá el que más le gusta y dejalo en el lugar donde siempre está su teléfono. Ella lo va a encontrar.' },
  { id: 5, phase: 'menstruacion', emoji: '🤫', title: 'El silencio es oro', message: 'Si no sabés qué decir, no digas nada. Un mimo en silencio vale más que diez frases bien intencionadas y mal recibidas.' },
  { id: 6, phase: 'menstruacion', emoji: '🛁', title: 'Baño caliente = amor puro', message: 'Prepará un baño con agua bien caliente. Si tenés sales de baño o espuma, usálas. Si no tenés, conseguí. Esto se convierte en leyenda.' },
  { id: 7, phase: 'menstruacion', emoji: '💊', title: 'Ibuprofeno al rescate', message: 'Si tiene cólicos y no tomó nada, acordale el ibuprofeno. Con mucho amor, no como si fuera una prescripción médica.' },
  { id: 8, phase: 'menstruacion', emoji: '🧸', title: 'Modo oso de peluche', message: 'Tu trabajo hoy es ser suave, cálido y no hablar demasiado. Básicamente: ser un peluche gigante con funciones de delivery.' },
  { id: 9, phase: 'menstruacion', emoji: '📵', title: 'Cancelá planes sin drama', message: 'Si había algo planeado, cancelalo vos. Sin hacerla sentir culpable. Un "yo me encargo" hace magia.' },
  { id: 10, phase: 'menstruacion', emoji: '🍜', title: 'Comida caliente, corazón contento', message: 'Preguntale qué le provoca comer. Puede ser algo raro, exótico o muy simple. No juzgues. Ejecutá.' },
  { id: 11, phase: 'menstruacion', emoji: '🌸', title: 'Las flores no son cursi', message: 'Un ramo chico o aunque sea una flor suelta en el día 1 es un gesto que ella va a recordar mucho más tiempo del que creés.' },
  { id: 12, phase: 'menstruacion', emoji: '🧣', title: 'Bolsa de agua caliente > todo', message: 'Una bolsa de agua caliente en la panza para los cólicos. Si no tenés, calentá una toalla en el microondas envuelta en plástico. Improvisación nivel pro.' },
  { id: 13, phase: 'menstruacion', emoji: '🚫', title: 'Hoy no es el día', message: 'Hoy no es el día para hablar de cosas serias, hacer planes grandes, o discutir algo pendiente. Guardalo para la fase 2. Prometido.' },
  { id: 14, phase: 'menstruacion', emoji: '😴', title: 'Dejala dormir', message: 'Si quiere dormir a las 9pm, perfecto. Si quiere dormir hasta las 2pm, también perfecto. No hay horarios esta semana.' },
  { id: 15, phase: 'menstruacion', emoji: '🧴', title: 'Masajes, pero suaves', message: 'Un masaje de espalda o panza (con muy poca presión) puede aliviar bastante. Si no sabés masajear, hacelo igual. La intención cuenta.' },
  { id: 16, phase: 'menstruacion', emoji: '📺', title: 'Series de llorar están permitidas', message: 'Si ella quiere ver algo que la haga llorar, no digas nada. Simplemente alcanzale los pañuelos y no preguntes si está bien.' },
  { id: 17, phase: 'menstruacion', emoji: '🤝', title: 'El pacto del día 1', message: 'Hoy empieza la semana más difícil. Tu misión: mínimo drama, máximo apoyo. Cualquier cosa que salga mal hoy, no es personal.', minDay: 1, maxDay: 1 },
  { id: 18, phase: 'menstruacion', emoji: '🎁', title: 'Sorpresa sin motivo', message: 'Una sorpresa pequeña sin que sea su cumpleaños ni San Valentín en estos primeros días del ciclo es uno de los gestos más lindos que podés hacer.', minDay: 1, maxDay: 2 },
  { id: 19, phase: 'menstruacion', emoji: '🐈', title: 'Energía de gato tranquilo', message: 'Ella necesita tu presencia pero sin presión. Estás ahí, disponible, sin hacer ruido. Como un gato que se queda cerca pero no molesta.' },
  { id: 20, phase: 'menstruacion', emoji: '🧹', title: 'Limpiá sin que te pidan', message: 'Si la casa está un poco desastrosa, ordenala vos sin decir nada. Sin "mirá lo que hice". Sin esperar agradecimiento. Solo hacelo.' },
  { id: 21, phase: 'menstruacion', emoji: '💬', title: 'Escuchá más, hablá menos', message: 'Si ella habla, escuchá. No des soluciones. No digas "pero". No des consejos. Solo escuchá y decí "entiendo" o "qué heavy". Eso alcanza.' },
  { id: 22, phase: 'menstruacion', emoji: '🌙', title: 'La noche del día 1', message: 'La primera noche es la más difícil. Si no puede dormir bien, quedate despierto con ella un rato. No hace falta hacer nada especial.', minDay: 1, maxDay: 1 },
  { id: 23, phase: 'menstruacion', emoji: '🤣', title: 'El humor tiene que ser MUY fino', message: 'Si vas a hacer una broma hoy, que sea de las tuyas que ella ya probó y sabe que son inofensivas. No experimentes chistes nuevos. No.' },
  { id: 24, phase: 'menstruacion', emoji: '☕', title: 'Café o té sin que lo pida', message: 'Aparecer con un café o té caliente cuando ella está en el sillón sin que lo haya pedido es literalmente magia. Hacelo.' },
  { id: 25, phase: 'menstruacion', emoji: '🩹', title: 'No te tomes nada personal', message: 'Si responde cortante, si está de mal humor, si suspira fuerte: no es contra vos. Son las hormonas. Respira. Seguís siendo su persona favorita.' },
  { id: 26, phase: 'menstruacion', emoji: '🎵', title: 'Música ambiente', message: 'Poné música tranquila de fondo. Sin pedirle permiso. Sin hacer una lista colaborativa. Algo suave que ella ya escuchó y le gustó.' },
  { id: 27, phase: 'menstruacion', emoji: '🤗', title: 'El abrazo largo', message: 'Un abrazo de esos que duran más de lo normal, sin que ella tenga que pedir que lo soltés. Eso recarga pilas mejor que cualquier cosa.' },
  { id: 28, phase: 'menstruacion', emoji: '🛒', title: 'El delivery sos vos', message: 'Hoy no sale. Vos sos el Rappi, el PedidosYa y el DHL. Preguntá qué se necesita y traelo sin quejarte.' },
  { id: 29, phase: 'menstruacion', emoji: '💖', title: 'Recordale que la querés', message: 'En estos días a veces se sienten feas, incómodas o pesadas. Un "estás hermosa" o "te quiero un montón" dicho de verdad puede cambiarle el día.' },
  { id: 30, phase: 'menstruacion', emoji: '🏆', title: 'Sobrevivir esto te hace mejor persona', message: 'Si llegás al final de esta fase habiendo sido un buen acompañante, merecés una medalla. Y probablemente algo mucho mejor cuando empiece la fase 2. 😏', minDay: 4, maxDay: 8 },
  { id: 31, phase: 'menstruacion', emoji: '🍕', title: 'Pedí la pizza antes de que lo pida', message: 'Anticiparte a sus antojos es el nivel más alto del novio. Si ya sabés qué le provoca en estos días, pedilo antes. Leyenda desbloqueada.' },
  { id: 32, phase: 'menstruacion', emoji: '😤', title: 'No discutas. Jamás.', message: 'Si sentís que hay una discusión que se puede dar hoy, no la des. Tenés toda la razón del mundo y aun así la vas a perder. Guardá la energía.' },

  // ─────────────────────────────────────────
  // FASE 2 — FOLICULAR (días 6-13)
  // ─────────────────────────────────────────
  { id: 33, phase: 'folicular', emoji: '⚡', title: 'Bienvenido de vuelta', message: 'El estrógeno subió y tu novia volvió. Esa energía que extrañabas esta última semana: ahí está. No la desperdicies.' },
  { id: 34, phase: 'folicular', emoji: '🌱', title: 'Semana de propuestas', message: 'Esta es la semana para proponer planes. Cena nueva, actividad nueva, viaje que tenían pendiente. Ella está receptiva y con ganas. Aprovechá.' },
  { id: 35, phase: 'folicular', emoji: '🎬', title: 'Salgan a algo', message: 'Cine, teatro, exposición, lo que sea. Esta semana tiene energía para salir y lo va a disfrutar. No se queden en casa si pueden evitarlo.' },
  { id: 36, phase: 'folicular', emoji: '💬', title: 'Ahora sí podés hablar', message: 'Esas conversaciones que postergaste durante la menstruación: ahora es el momento. Está receptiva, racional y de buen humor. Dale.' },
  { id: 37, phase: 'folicular', emoji: '🏃', title: 'Si hace ejercicio, acompañala', message: 'Tiene más energía física. Si propone salir a correr, caminar o entrenar: animate a acompañarla. Aunque vos no tengas ganas. El esfuerzo se nota.' },
  { id: 38, phase: 'folicular', emoji: '🍽️', title: 'Restaurant nuevo', message: 'Esta es la semana ideal para probar ese lugar nuevo que ninguno de los dos conoce. Ella va a estar abierta a experimentar. Vos reservá.' },
  { id: 39, phase: 'folicular', emoji: '🧠', title: 'Está en su mejor momento intelectual', message: 'El estrógeno potencia la memoria y la concentración. Si tiene que tomar decisiones importantes esta semana, va a estar afilada. No la interrumpas.' },
  { id: 40, phase: 'folicular', emoji: '🎨', title: 'Propone algo creativo', message: 'Un taller, cocinar algo nuevo juntos, armar algo, explorar un barrio. La creatividad está alta esta semana. Usala.' },
  { id: 41, phase: 'folicular', emoji: '📸', title: 'Sacale fotos', message: 'Está en una etapa donde se siente bien con ella misma. Es el momento de sacarle buenas fotos sin que las pida. Las va a amar.' },
  { id: 42, phase: 'folicular', emoji: '🌞', title: 'Día afuera', message: 'Parque, plaza, playa, lo que haya cerca. Salir al aire libre esta semana va a ser bien recibido. Especialmente si hay sol.' },
  { id: 43, phase: 'folicular', emoji: '💃', title: 'Llevala a bailar', message: 'Si hay alguna oportunidad de bailar esta semana, aprovechala. La energía y el buen humor están en su punto máximo.' },
  { id: 44, phase: 'folicular', emoji: '🛍️', title: 'Paseo de shopping', message: 'No hace falta comprar nada. Pero ella con energía + vidrieras es una combinación ganadora. Andá sin quejarte del tiempo.' },
  { id: 45, phase: 'folicular', emoji: '🚗', title: 'Escapada espontánea', message: 'Propone una escapada de un día a algún lado cercano. Sin planear demasiado. Esta semana le encanta la espontaneidad.' },
  { id: 46, phase: 'folicular', emoji: '🌮', title: 'Street food y aventura', message: 'Salir a comer en algún lugar informal, callejero o raro. Esta semana tiene el estómago y el espíritu para la aventura gastronómica.' },
  { id: 47, phase: 'folicular', emoji: '🏊', title: 'Actividad física juntos', message: 'Bicicleta, natación, tenis, lo que sea. El cuerpo tiene más energía y resistencia. Si propone algo activo, no pongas excusas.' },
  { id: 48, phase: 'folicular', emoji: '🎤', title: 'Karaoke, sí o sí', message: 'La desinhibición está alta. Si hay alguna oportunidad de hacer karaoke esta semana, agénciate. Vas a pasar una noche increíble.' },
  { id: 49, phase: 'folicular', emoji: '🌺', title: 'Cuidado, te va a sorprender', message: 'En esta fase suele estar más romántica, detallista y atenta. Prepárate para recibir algo lindo. Y correspondela.' },
  { id: 50, phase: 'folicular', emoji: '🏕️', title: 'Propone un plan de naturaleza', message: 'Camping, senderismo, picnic en el campo. Esta semana tiene energía para lo que venga. Y lo va a disfrutar el doble si fue idea tuya.' },
  { id: 51, phase: 'folicular', emoji: '🎭', title: 'Cultura', message: 'Museo, galería de arte, obra de teatro. Algo con contenido. Está en su punto más receptivo intelectualmente. Impresionala.' },
  { id: 52, phase: 'folicular', emoji: '🤸', title: 'Energía ilimitada', message: 'Esta semana tiene más energía que vos. Es un hecho. No te quedes atrás. Ponete a tono.' },
  { id: 53, phase: 'folicular', emoji: '☕', title: 'Date coffee', message: 'Llevala a ese café lindo que vieron una vez y nunca fueron. Esta semana es perfecta para ese tipo de planes tranquilos pero con onda.' },
  { id: 54, phase: 'folicular', emoji: '🌃', title: 'Noche en la ciudad', message: 'Cenar afuera y caminar por el centro de noche. Simple, barato y efectivo. Esta semana lo va a amar.' },
  { id: 55, phase: 'folicular', emoji: '🎲', title: 'Juegos de mesa', message: 'Una noche de juegos de mesa con amigos o solos. La competitividad y el humor están altos. Ojo: ella va a ganar.' },
  { id: 56, phase: 'folicular', emoji: '📚', title: 'Ir a una librería juntos', message: 'Si le gusta leer, llevarla a una librería sin apuro es uno de los planes más tranquilos y bien recibidos de la fase 2.' },
  { id: 57, phase: 'folicular', emoji: '🍳', title: 'Cocinen juntos', message: 'Elegí una receta nueva y cocinénla juntos. Con música, con vino, con relax. Esta semana tiene paciencia y ganas para eso.' },
  { id: 58, phase: 'folicular', emoji: '🎡', title: 'Plan de domingo', message: 'Feria artesanal, mercado de pulgas, recorrida por un barrio que no conocen. Planes de domingo sin presión. Esta semana son perfectos.' },
  { id: 59, phase: 'folicular', emoji: '💪', title: 'Apoya sus proyectos', message: 'Si tiene algo que quiere empezar o retomar esta semana, apoyala. Esta fase es donde más motivada está para arrancar cosas nuevas.' },
  { id: 60, phase: 'folicular', emoji: '🌈', title: 'El mejor momento del ciclo', message: 'La fase folicular es básicamente el arcoíris después de la tormenta menstrual. Disfrutalo. No lo desperdicies en el sillón.' },
  { id: 61, phase: 'folicular', emoji: '🎊', title: 'Sorprendela', message: 'Tiene energía para recibir sorpresas. Un plan inesperado, algo que no sepa, una reserva que ella no pidió. Esta semana es la indicada.' },
  { id: 62, phase: 'folicular', emoji: '🧩', title: 'Plan intelectual', message: 'Un escape room, un pub quiz, algo que use el cerebro. Esta semana está en su pico cognitivo. Dale un desafío.' },
  { id: 63, phase: 'folicular', emoji: '🌊', title: 'Agua = buena idea', message: 'Playa, río, lago, pileta. Si hay alguna opción de agua cerca, esta semana es el momento. El cuerpo y el ánimo lo piden.' },

  // ─────────────────────────────────────────
  // FASE 3 — OVULACIÓN (día 14 ± 2 días)
  // ─────────────────────────────────────────
  { id: 64, phase: 'ovulacion', emoji: '🔥', title: 'Houston, estamos en la cúspide', message: 'Esto es el pico. El estrógeno y la testosterona están en su máximo histórico. Es el mejor día del mes para todo. TODO.' },
  { id: 65, phase: 'ovulacion', emoji: '💋', title: 'Está en su mejor versión', message: 'La voz, la piel, la energía, el humor, la confianza: todo está al máximo. No es tu imaginación. Es biología.' },
  { id: 66, phase: 'ovulacion', emoji: '👑', title: 'La reina está en el trono', message: 'Hoy se siente poderosa, atractiva y segura. Reforzá eso. Un piropo sincero hoy vale por diez.' },
  { id: 67, phase: 'ovulacion', emoji: '💑', title: 'Plan romántico de los grandes', message: 'Cena con velas, música, la ropa buena. Este es el momento de hacer ese plan romántico que venías postergando. No lo postergues más.' },
  { id: 68, phase: 'ovulacion', emoji: '🌹', title: 'Flores grandes', message: 'No un ramito. Un ramo grande. Esta semana se lo merece y lo va a apreciar al máximo.' },
  { id: 69, phase: 'ovulacion', emoji: '✨', title: 'Decile lo que sentís', message: 'Si había algo lindo que querías decirle y no encontrabas el momento: este es el momento. Está receptiva, abierta y con el corazón disponible.' },
  { id: 70, phase: 'ovulacion', emoji: '🎯', title: 'Iniciativa masculina requerida', message: 'Esta semana no esperes que ella proponga. Proponé vos. Un plan, un gesto, una sorpresa. El que toma la iniciativa esta semana gana.' },
  { id: 71, phase: 'ovulacion', emoji: '🍷', title: 'Vino y buena compañía', message: 'Una botella de vino rico, música, sin teléfonos. Una noche así esta semana puede ser de las mejores del año.' },
  { id: 72, phase: 'ovulacion', emoji: '🌇', title: 'Salida nocturna con onda', message: 'Esta es la semana para salir de noche y llegar tarde. Tiene energía, ganas y está en su mejor momento. No la desperdicies en casa.' },
  { id: 73, phase: 'ovulacion', emoji: '📝', title: 'Escribile algo', message: 'Un mensaje lindo, una nota en papel, algo escrito a mano. En esta fase le llega muchísimo más que en cualquier otra. Pruébalo.' },
  { id: 74, phase: 'ovulacion', emoji: '🎁', title: 'Regalo sin motivo = 10 puntos', message: 'No hace falta que sea caro. Un detalle inesperado esta semana vale el doble. Bijouterie, su perfume favorito, algo que viste y pensaste en ella.' },
  { id: 75, phase: 'ovulacion', emoji: '💬', title: 'Conversaciones profundas', message: 'Está en su momento más comunicativa y abierta emocionalmente. Si hay algo importante que hablar en la relación, este es el momento ideal.' },
  { id: 76, phase: 'ovulacion', emoji: '🧲', title: 'La atracción está en su pico', message: 'Hay estudios que muestran que en ovulación la atracción mutua es máxima. No hace falta que lo entendas. Solo acompañalo.' },
  { id: 77, phase: 'ovulacion', emoji: '🎶', title: 'Bailá con ella', message: 'No en una disco necesariamente. En la cocina, en el living, donde sea. Ponele una canción que le guste y bailá con ella. Eso es todo.' },
  { id: 78, phase: 'ovulacion', emoji: '🌙', title: 'Una noche para recordar', message: 'Si tenés que elegir una noche del mes para hacer algo especial: es esta. Cualquier cosa que hagas hoy va a quedar grabada.' },
  { id: 79, phase: 'ovulacion', emoji: '🦋', title: 'Está liviana y feliz', message: 'El estrógeno alto hace que todo se sienta más liviano. Aprovechá este estado y no lo contamines con drama o temas pesados.' },
  { id: 80, phase: 'ovulacion', emoji: '📷', title: 'Fotos juntos', message: 'Esta es la semana donde van a quedar las mejores fotos juntos. Sacálas sin excusa. Algún día las van a ver y se van a acordar de este momento.' },
  { id: 81, phase: 'ovulacion', emoji: '🏖️', title: 'Si hay escapada, que sea ahora', message: 'Si podés organizar una escapada de fin de semana este mes, que sea esta semana. El humor, la energía y las ganas de todo están al máximo.' },
  { id: 82, phase: 'ovulacion', emoji: '🌺', title: 'Detallismo que sale de adentro', message: 'Esta semana ella también va a estar más detallista con vos. Fijate. Reconocelo. Devolvelo.' },
  { id: 83, phase: 'ovulacion', emoji: '😍', title: 'Mirala', message: 'A veces la mirada dice más que cualquier palabra. Mirala de verdad esta semana. Sin el teléfono en la mano. Sin distracción. Solo mirala.' },
  { id: 84, phase: 'ovulacion', emoji: '🎠', title: 'Plan de pareja de película', message: 'Esos planes que se ven en las películas de amor y que en la vida real nadie hace: esta semana hacelos. Pícnic de noche, terraza, lo que se te ocurra.' },
  { id: 85, phase: 'ovulacion', emoji: '🏆', title: 'Tu ventana de oro', message: 'Tenés aproximadamente 48 horas de pico máximo. Usálas bien. No en el sillón. No en el teléfono. Con ella.' },
  { id: 86, phase: 'ovulacion', emoji: '🥂', title: 'Brindá por algo', message: 'No hace falta un motivo enorme. Brindar por estar juntos, por algo lindo del mes o por lo que venga. Un brindis simple esta semana tiene mucho peso.' },
  { id: 87, phase: 'ovulacion', emoji: '🌟', title: 'Sé espontáneo', message: 'Esta semana la espontaneidad es bienvenida. Cambiá los planes de último momento hacia algo mejor. Ella va a estar a favor.' },
  { id: 88, phase: 'ovulacion', emoji: '🎪', title: 'Algo que nunca hicieron', message: 'Esta semana es perfecta para probar algo nuevo juntos. Un lugar nuevo, una actividad nueva, algo que nunca se animaron. Hacerlo en el pico es mejor.' },
  { id: 89, phase: 'ovulacion', emoji: '💫', title: 'El universo está a favor', message: 'Todo lo que hagas esta semana con intención y amor va a ser bien recibido. Las hormonas están de tu lado. No la cagues.' },
  { id: 90, phase: 'ovulacion', emoji: '🥰', title: 'Decile que es hermosa', message: 'Simple. Directo. Sin rodeos. "Estás hermosa hoy." En serio. Sin que parezca que querés algo. Porque no hace falta que quieras algo. Solo decilo.' },
  { id: 91, phase: 'ovulacion', emoji: '🎸', title: 'Actuación espontánea', message: 'Si tocás algún instrumento, si cantás aunque sea mal, hacé algo musical para ella. Esta semana le va a llegar de una manera diferente.' },
  { id: 92, phase: 'ovulacion', emoji: '🍓', title: 'Comida romántica en casa', message: 'No hace falta salir. Comprá ingredientes ricos, cocinás algo con onda y la dejás impresionada sin gastar una fortuna.' },
  { id: 93, phase: 'ovulacion', emoji: '🔮', title: 'La mejor semana del mes', message: 'Biológicamente hablando, esta es la semana donde ella se siente mejor. Tu trabajo: estar a la altura.' },

  // ─────────────────────────────────────────
  // FASE 4 — LÚTEA (días 15-28)
  // ─────────────────────────────────────────
  { id: 94, phase: 'lutea', emoji: '🌧️', title: 'Empezó la fase de la paciencia', message: 'El estrógeno cayó y la progesterona subió. El humor puede cambiar rápido. Activá el modo ninja emocional: observá, no reacciones.' },
  { id: 95, phase: 'lutea', emoji: '🛒', title: 'Compra snacks. Ahora.', message: 'Sin esperar que te lo pidan. Chocolate, papas fritas, alfajores, lo que ella ama. Tenelos en casa antes de que los pida. Eso es anticipación nivel pro.' },
  { id: 96, phase: 'lutea', emoji: '😤', title: 'La irritabilidad no es contra vos', message: 'Si hay una explosión de mal humor, respirá. No lo tomés personal. Es la progesterona, no vos. Pero tampoco le respondas mal. Eso sí es un error.' },
  { id: 97, phase: 'lutea', emoji: '🤐', title: 'La frase que no hay que decir', message: 'Si algo te parece exagerado o fuera de proporción: NO LO DIGAS. "Estás sensible" o "son las hormonas" dicho en voz alta es poner la mano en el fuego voluntariamente.' },
  { id: 98, phase: 'lutea', emoji: '🍫', title: 'El chocolate es la respuesta', message: 'Ante la duda: chocolate. Siempre chocolate. Negro, blanco, con leche, con almendras. Cualquier chocolate es mejor que ningún chocolate.' },
  { id: 99, phase: 'lutea', emoji: '💤', title: 'Necesita más sueño', message: 'La progesterona cansa. Si duerme más de lo normal, es normal. No la despiertes sin motivo. No hagas ruido innecesario. Dejala descansar.' },
  { id: 100, phase: 'lutea', emoji: '🎭', title: 'Las emociones vienen en paquete', message: 'Puede llorar con un video de cachorros y enojarse con el tráfico en el mismo viaje. Ambas reacciones son válidas. No preguntes por qué.' },
  { id: 101, phase: 'lutea', emoji: '🏠', title: 'Planes tranquilos', message: 'Esta semana no es para aventuras ni imprevistos. Planes conocidos, lugares seguros, rutinas. La novedad puede generar más estrés del que vale.' },
  { id: 102, phase: 'lutea', emoji: '🧘', title: 'Ella necesita espacio para procesar', message: 'En esta fase el cerebro procesa más las cosas internamente. Si está callada, no significa que algo esté mal. Respetá el silencio.' },
  { id: 103, phase: 'lutea', emoji: '🤝', title: 'Cuestión de equipo', message: 'Esta semana el "nosotros" tiene que estar muy presente. Frases como "lo hacemos juntos", "yo te ayudo" o "lo resolvemos" bajan la ansiedad muchísimo.' },
  { id: 104, phase: 'lutea', emoji: '📱', title: 'Respondé rápido', message: 'En esta fase el silencio del teléfono puede generar más ansiedad de lo normal. No desaparezcas. Respondé los mensajes con algo de velocidad.' },
  { id: 105, phase: 'lutea', emoji: '🧁', title: 'La comida es amor', message: 'Que coma lo que quiera. Sin comentarios. Sin caras. Sin dietas. Esta semana la comida es un mecanismo de bienestar. Respetalo.' },
  { id: 106, phase: 'lutea', emoji: '🎥', title: 'Netflix con mimos', message: 'Quedarse en casa con una peli o serie, tapados, con snacks. Es el plan de la fase 4. No busques nada más complicado.' },
  { id: 107, phase: 'lutea', emoji: '💆', title: 'Masajes sin que te pidan', message: 'Ofrecé masajes de espalda, cuello o pies sin que ella lo pida. En esta fase el cuerpo está más tensionado. Un masaje es medicina.' },
  { id: 108, phase: 'lutea', emoji: '☕', title: 'Ritual de café/té', message: 'Si comparten algún ritual de tomar algo juntos, esta semana mantenelo. La rutina y la estabilidad son reconfortantes en la fase lútea.' },
  { id: 109, phase: 'lutea', emoji: '🚨', title: 'Alerta de conflicto latente', message: 'Esta semana hay más chances de que una discusión chica se haga grande. Si sentís que se viene una, cambiá el tema, hacé un chiste, salí a buscar agua. Lo que sea.' },
  { id: 110, phase: 'lutea', emoji: '🌊', title: 'Dejala que lo largue', message: 'Si necesita desahogarse, dejala. No interrumpas. No des soluciones. Solo escuchá. A veces el desahogo es todo lo que necesita.' },
  { id: 111, phase: 'lutea', emoji: '🛁', title: 'Baño relajante = reset', message: 'Un baño caliente con sales o espuma puede resetear el humor de la fase lútea. Proponeselo sin hacerlo parecer una sugerencia médica.' },
  { id: 112, phase: 'lutea', emoji: '🌙', title: 'Las noches son más difíciles', message: 'La progesterona puede dificultar el sueño o generar sueños intensos. Si está desvelada, no te impacientes. Quedate despierto un rato con ella.' },
  { id: 113, phase: 'lutea', emoji: '🤗', title: 'El abrazo que arregla todo', message: 'A veces no hay nada que decir. Un abrazo largo, sin decir nada, sin preguntar nada, puede cambiar el estado de ánimo de la fase lútea más que cualquier palabra.' },
  { id: 114, phase: 'lutea', emoji: '😇', title: 'Paciencia infinita, modo ON', message: 'Esta es la semana que separa a los novios comunes de los novios legendarios. Paciencia. Más paciencia. Y cuando no te quede más: encontrá más.' },
  { id: 115, phase: 'lutea', emoji: '🎮', title: 'Planes de poco esfuerzo', message: 'Jueguito de mesa, maratón de serie, cocinar algo simple juntos. Planes que no requieran energía ni movimiento. Eso es lo que la fase 4 pide.' },
  { id: 116, phase: 'lutea', emoji: '🌸', title: 'El cuerpo también habla', message: 'Puede tener hinchazón, sensibilidad en la panza o en el pecho. No es el momento para comentarios físicos. Ninguno. Cero.' },
  { id: 117, phase: 'lutea', emoji: '🧇', title: 'El desayuno en cama', message: 'Un desayuno en cama sin que lo pida en la fase 4 puede convertirte en el mejor novio del año en 15 minutos. Costo-beneficio imbatible.' },
  { id: 118, phase: 'lutea', emoji: '🎯', title: 'Validá en vez de resolver', message: 'Si se queja de algo, no saltes a solucionar. Primero decí "entiendo" o "tiene sentido que te moleste". La validación calma más que la solución.' },
  { id: 119, phase: 'lutea', emoji: '⚠️', title: 'Zona de riesgo: últimos días', message: 'Los últimos días antes de la menstruación son los más intensos emocionalmente. Máxima alerta, mínimo ego. La menstruación ya viene, aguantá.', minDay: 22, maxDay: 45 },
  { id: 120, phase: 'lutea', emoji: '💝', title: 'La que más te quiere es la misma', message: 'Aunque esta semana parezca diferente, es la misma persona que te eligió. Las hormonas pasan. El amor queda. Acordáte de eso.' },
  { id: 121, phase: 'lutea', emoji: '🍦', title: 'Helado de emergencia', message: 'Tener helado en el freezer durante la fase lútea no es un lujo. Es una medida de seguridad nacional. Hacelo.' },
  { id: 122, phase: 'lutea', emoji: '🎵', title: 'Música suave de fondo', message: 'No el reggaeton de las 2pm. Algo tranquilo, suave, de fondo. La música correcta puede regular el ambiente emocional mejor que cualquier conversación.' },
  { id: 123, phase: 'lutea', emoji: '🧸', title: 'Modo peluche recargado', message: 'Si en la fase 1 eras un peluche, en la fase 4 tenés que ser el peluche más suave del universo. Blandito, disponible, sin picos.' },
  { id: 124, phase: 'lutea', emoji: '🏁', title: 'Ya falta poco', message: 'La menstruación se acerca y con ella, el reseteo. Ya falta poco. Vos podés. Ella también. Juntos llegan al otro lado del ciclo.', minDay: 22, maxDay: 45 },
  { id: 125, phase: 'lutea', emoji: '🥇', title: 'El que aguanta la fase 4 con amor: gana', message: 'Si pasaste la fase lútea siendo un buen tipo, empático y paciente: ganaste el ciclo. Y en unos días empieza de nuevo. Pero ahora ya sabés cómo.', minDay: 22, maxDay: 45 },
]

export function getRandomTip(phase: Tip['phase'], excludeId?: number, day?: number): Tip {
  const pool = tips.filter(t => {
    if (t.phase !== phase) return false
    if (t.id === excludeId) return false
    if (day !== undefined) {
      if (t.minDay !== undefined && day < t.minDay) return false
      if (t.maxDay !== undefined && day > t.maxDay) return false
    }
    return true
  })
  // fallback: if no tips match the day constraints, ignore day filter
  const source = pool.length > 0 ? pool : tips.filter(t => t.phase === phase && t.id !== excludeId)
  return source[Math.floor(Math.random() * source.length)]
}

export function getRandomTips(phase: Tip['phase'], count: number, day?: number): Tip[] {
  const pool = [...tips.filter(t => {
    if (t.phase !== phase) return false
    if (day !== undefined) {
      if (t.minDay !== undefined && day < t.minDay) return false
      if (t.maxDay !== undefined && day > t.maxDay) return false
    }
    return true
  })]
  const result: Tip[] = []
  while (result.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}
