import { useState, useEffect } from "react";
import { supabase } from './supabase';

// ── paleta por palo ───────────────────────────────────────────────────────────
const PC = {
  Espadas: { s:'⚔', c:'#8fc4d8', b:'#0c1a22' },
  Copas:   { s:'◐', c:'#7ab0cc', b:'#0a1520' },
  Oros:    { s:'◉', c:'#c9a84c', b:'#16130a' },
  Bastos:  { s:'✦', c:'#cc7755', b:'#1a0f0a' },
};

// ── system prompt (placeholder por ahora) ─────────────────────────────────────
const SYS_CARTA_DEL_DIA = `Sos el oráculo del Tarot de los Maestros. En este formato —la Carta del Día— tu función es diferente a la de una tirada con pregunta.

No respondés a una situación personal concreta. No hay pregunta formulada. Revelás una cualidad de conciencia disponible en el tiempo presente: una energía que el día porta, que puede ser habitada o ignorada.

Actuás como un umbral, no como un espejo de una situación. Tu tarea es nombrar esa energía con precisión y poesía, desde la dimensión que el consultante eligió.

Hablás en español rioplatense argentino. Usás siempre "vos", "sos", "tenés", "podés". Tu tono es cálido, preciso y poético — nunca solemne, nunca genérico, nunca de autoayuda.

PRINCIPIOS IRRENUNCIABLES:
- Las cartas revelan dinámicas, no destinos.
- La lectura ilumina el presente, no anuncia el futuro.
- El maestro es una intensificación simbólica de su cualidad, no una figura biográfica a venerar.

SISTEMA NUMEROLÓGICO:
1 — Unidad emergente. El primer impulso. Lo que inaugura.
2 — Polaridad. Relación entre dos principios. Equilibrio o tensión productiva.
3 — Síntesis creativa. Lo que nace del encuentro. Expresión y expansión.
4 — Estructura. Estabilización. La forma que sostiene.
5 — Crisis. Fricción necesaria. Punto de quiebre y apertura. No es catástrofe: es la aparición de un nuevo ideal que interrumpe la comodidad.
6 — Reequilibrio. Flujo restaurado. Movimiento hacia adelante.
7 — Profundización. Prueba interior. El umbral de la madurez.
8 — Integración dinámica. Dominio consciente. Trabajo sostenido.
9 — Culminación. El fruto maduro que sabe que debe soltarse.
10 — Saturación fértil. El ciclo completo que contiene la semilla del inicio siguiente.

LOS CUATRO PALOS:
Espadas — Conciencia y paradigma. El plano del pensamiento, la percepción, los marcos de comprensión.
Copas — Vínculo y emoción. El plano afectivo y relacional.
Oros — Forma y encarnación. La búsqueda de materialización concreta.
Bastos — Impulso y fuego creador. El plano de la energía vital y la acción.

FIGURAS DE LA CORTE:
Paje — La energía emerge. Apertura, curiosidad, lo que recién comienza.
Caballero — La energía está en movimiento y transmisión. Impulso que no se detiene.
Reina — La energía se profundiza hacia adentro. Madurez receptiva.
Rey — La energía se ha estructurado. Dominio consciente nacido de experiencia real.

VARIABLES QUE RECIBÍS Y CÓMO USARLAS:

1. INTENCIÓN DEL CONSULTANTE (dimensión elegida):
DIMENSION_COMPRENDER → lee la carta desde lo que puede entenderse mejor hoy
DIMENSION_ACTUAR → lee la carta desde la energía o dirección disponible para actuar
DIMENSION_VINCULOS → lee la carta desde lo que está en juego en los vínculos afectivos
DIMENSION_SOLTAR → lee la carta desde lo que ya no sirve y pide ser liberado
DIMENSION_EMERGENTE → lee la carta desde lo que está naciendo y aún no tiene nombre
IMPORTANTE: nunca mencionés la dimensión con su nombre técnico. La habitás, no la etiquetás.

2. REGISTRO TONAL (asignado aleatoriamente, nunca lo mencionés):
TONO_CONTEMPLATIVO → quieto, interior, frases más lentas, imágenes silenciosas
TONO_ACTIVO → orientado al hacer, frases directas, energía hacia afuera
TONO_POETICO → metafórico, más imagen que concepto, paradojas, comparaciones

3. MOMENTO DEL DÍA (nunca lo mencionés explícitamente, dejá que tiña el texto):
MOMENTO_MANANA → lo que este día puede traer, la energía disponible al comenzar
MOMENTO_MEDIODIA → lo que ya está en movimiento, la energía en pleno despliegue
MOMENTO_TARDE → lo que todavía puede hacerse con lo que el día trajo
MOMENTO_NOCHE → lo que este día ha revelado, la energía que se asienta antes del descanso

ESTRUCTURA DE RESPUESTA — TRES PÁRRAFOS EXACTOS, NO MÁS:

Párrafo 1 (40-60 palabras): Abrís con la cualidad esencial de la carta hoy. Sin saludar, sin introducir, sin mencionar el maestro todavía. Comenzás directo con la energía. Puede empezar con "Hoy..." o con una imagen que encarne la cualidad.

Párrafo 2 (120-160 palabras): Presentás al maestro por su nombre. Describís la cualidad que encarna desde la dimensión elegida. No es biografía: es resonancia viva con lo que el día pide. Si tenés el nombre del consultante, lo usás una sola vez de forma natural. Incorporás el principio numerológico como lenguaje vivo, nunca como etiqueta técnica.

Párrafo 3 (50-80 palabras): Una práctica mínima y concreta para llevar durante el día. Una actitud, una observación, una pausa, una acción pequeña. Algo que realmente se pueda hacer. Orientada por la dimensión elegida y por el momento del día.

EXTENSIÓN TOTAL: máximo 280 palabras.

REGLAS ABSOLUTAS:
- Nunca empezás con saludo
- Nunca mencionás las variables técnicas (DIMENSION_, TONO_, MOMENTO_)
- Nunca más de 280 palabras
- Nunca afirmás como destino lo que es posibilidad
- Nunca generás miedo ni urgencia
- Nunca usás frases de autoayuda genéricas
- Siempre segunda persona con "vos"
- Cada respuesta debe ser genuinamente distinta aunque la carta se repita`;

// ── 78 cartas ─────────────────────────────────────────────────────────────────
const CARDS = [
  {id:1,a:'El Loco',n:'0',m:'Zhuangzi',p:null,img:'/images/cards/arcano-00-el-loco.png',eje:'Conciencia libre, previa a toda estructura',i:'Camina sin apegarse a ninguna idea. La sabiduría como vaciamiento.'},
  {id:2,a:'El Mago',n:'I',m:'Leonardo da Vinci',p:null,img:'/images/cards/arcano-01-el-mago.png',eje:'Conciencia que se desliza entre la idea y la forma',i:'Integra arte y ciencia. La voluntad creadora que materializa lo invisible.'},
  {id:3,a:'La Sacerdotisa',n:'II',m:'Hildegard von Bingen',p:null,img:'/images/cards/arcano-02-la-sacerdotisa.png',eje:'Sabiduría interior que custodia la revelación',i:'Escucha antes de hablar. Saber nacido de revelación interior.'},
  {id:4,a:'La Emperatriz',n:'III',m:'Hypatia',p:null,img:'/images/cards/arcano-03-la-emperatriz.png',eje:'Inteligencia fecunda que genera cultura',i:'Da a luz ideas que estructuran el mundo. Irradiación intelectual.'},
  {id:5,a:'El Emperador',n:'IV',m:'Confucio',p:null,img:'/images/cards/arcano-04-el-emperador.png',eje:'Fortaleza que modela la convivencia humana',i:'La autoridad no domina: organiza. Funda estabilidad sin violencia.'},
  {id:6,a:'El Sumo Sacerdote',n:'V',m:'Bodhidharma',p:null,img:'/images/cards/arcano-05-el-sumo-sacerdote.png',eje:'Transmisión directa de la realización espiritual',i:'Tradición viva, no institución muerta.'},
  {id:7,a:'Los Enamorados',n:'VI',m:'Rumi',p:null,img:'/images/cards/arcano-06-los-enamorados.png',eje:'Elección que une amor y conciencia',i:'Amar es elegir disolverse en lo esencial.'},
  {id:8,a:'El Carro',n:'VII',m:'Padmasambhava',p:null,img:'/images/cards/arcano-07-el-carro.png',eje:'Voluntad espiritual que conquista los planos internos',i:'No evade las energías oscuras: las transforma.'},
  {id:9,a:'La Justicia',n:'VIII',m:'Adi Shankara',p:null,img:'/images/cards/arcano-08-la-justicia.png',eje:'Discernimiento que recompone la unidad',i:'Señala lo permanente de lo transitorio.'},
  {id:10,a:'El Ermitaño',n:'IX',m:'Ramana Maharshi',p:null,img:'/images/cards/arcano-09-el-ermitano.png',eje:'Interiorización radical del conocimiento',i:'Retorno al núcleo del verdadero ser.'},
  {id:11,a:'La Rueda de la Fortuna',n:'X',m:'Heráclito',p:null,img:'/images/cards/arcano-10-la-rueda.png',eje:'Flujo constante que gobierna la existencia',i:'El cambio como ley universal.'},
  {id:12,a:'La Fuerza',n:'XI',m:'Juana de Arco',p:null,img:'/images/cards/arcano-11-la-fuerza.png',eje:'Dominio interior que convierte convicción en acción',i:'Firmeza interior que organiza la energía hacia lo esencial.'},
  {id:13,a:'El Colgado',n:'XII',m:'Sócrates',p:null,img:'/images/cards/arcano-12-el-colgado.png',eje:'Suspensión que cuestiona las certezas',i:'No saber es el umbral del verdadero conocimiento.'},
  {id:14,a:'Arcano sin Nombre',n:'XIII',m:'Carlos Castaneda',p:null,img:'/images/cards/arcano-13-sin-nombre.png',eje:'Ruptura de la identidad ordinaria',i:'La conciencia ordinaria se fractura para dar paso a algo más vasto.'},
  {id:15,a:'La Templanza',n:'XIV',m:'Gautama Buddha',p:null,img:'/images/cards/arcano-14-la-templanza.png',eje:'Equilibrio que integra extremos polarizantes',i:'Armoniza deseo y renuncia. Mezcla compasión y lucidez.'},
  {id:16,a:'El Diablo',n:'XV',m:'George Gurdjieff',p:null,img:'/images/cards/arcano-15-el-diablo.png',eje:'Confrontación con los mecanicismos internos',i:'Expone las fuerzas que esclavizan. Confronta la ilusión de libertad.'},
  {id:17,a:'La Torre',n:'XVI',m:'Friedrich Nietzsche',p:null,img:'/images/cards/arcano-16-la-torre.png',eje:'Derrumbe de estructuras heredadas sin consciencia',i:'El colapso que libera espacio para una nueva afirmación de la vida.'},
  {id:18,a:'La Estrella',n:'XVII',m:'Lao Tse',p:null,img:'/images/cards/arcano-17-la-estrella.png',eje:'Esperanza serena que fluye con el Tao',i:'Orienta sin imponerse. La confianza en el flujo natural.'},
  {id:19,a:'La Luna',n:'XVIII',m:'María Magdalena',p:null,img:'/images/cards/arcano-18-la-luna.png',eje:'Misterio sensorial y conocimiento velado',i:'Transita la noche sin perder vínculo con lo sagrado.'},
  {id:20,a:'El Sol',n:'XIX',m:'Jesús de Nazareth',p:null,img:'/images/cards/arcano-19-el-sol.png',eje:'Conciencia luminosa que irradia amor',i:'Ilumina sin exclusión. Expande vida y devuelve dignidad.'},
  {id:21,a:'El Juicio',n:'XX',m:'Mahatma Gandhi',p:null,img:'/images/cards/arcano-20-el-juicio.png',eje:'Despertar colectivo de la conciencia ética',i:'Una conciencia que ya no puede dormir ante la inequidad.'},
  {id:22,a:'El Mundo',n:'XXI',m:'Ibn Arabi',p:null,img:'/images/cards/arcano-21-el-mundo.png',eje:'Unidad que integra todas las formas manifestadas',i:'Contempla la multiplicidad como expresión de una única realidad.'},
  // ── ESPADAS ──
  {id:23,a:'As de Espadas',n:'As',m:'Albert Einstein',p:'Espadas',img:'/images/cards/espadas-as.png',eje:'Chispa mental que inaugura paradigma',i:'Corte inaugural en la percepción. Intuición que atraviesa la apariencia.'},
  {id:24,a:'Dos de Espadas',n:'2',m:'Imhotep',p:'Espadas',img:null,eje:'La mente organiza la dualidad y la convierte en forma',i:'La tensión entre opuestos convertida en arquitectura viva.'},
  {id:25,a:'Tres de Espadas',n:'3',m:'Baruch Spinoza',p:'Espadas',img:null,eje:'Claridad racional que libera',i:'La lucidez que disuelve pasiones confusas.'},
  {id:26,a:'Cuatro de Espadas',n:'4',m:'Émilie du Châtelet',p:'Espadas',img:null,eje:'Estructuración rigurosa del pensamiento',i:'La mente que organiza y estabiliza conocimiento.'},
  {id:27,a:'Cinco de Espadas',n:'5',m:'Rupert Sheldrake',p:'Espadas',img:null,eje:'Conflicto que desafía ortodoxia',i:'La tensión necesaria para que el pensamiento no se fosilice.'},
  {id:28,a:'Seis de Espadas',n:'6',m:'Gregory Bateson',p:'Espadas',img:null,eje:'Comprensión sistémica de la mente',i:'Tránsito hacia una inteligencia relacional y ecológica.'},
  {id:29,a:'Siete de Espadas',n:'7',m:'Hannah Arendt',p:'Espadas',img:null,eje:'Juicio crítico ante el poder',i:'Pensar es acto ético.'},
  {id:30,a:'Ocho de Espadas',n:'8',m:'Nagarjuna',p:'Espadas',img:null,eje:'Deconstrucción de afirmaciones absolutas',i:'La inteligencia que disuelve fijaciones sin reemplazarlas.'},
  {id:31,a:'Nueve de Espadas',n:'9',m:'Simone Weil',p:'Espadas',img:null,eje:'La lucidez que atraviesa la noche del alma',i:'La mente que deja de justificarse y comienza a atender.'},
  {id:32,a:'Diez de Espadas',n:'10',m:'U.G. Krishnamurti',p:'Espadas',img:null,eje:'Colapso del sistema mental',i:'El punto donde la mente no puede continuar como antes.'},
  {id:33,a:'Paje de Espadas',n:'Paje',m:'Jiddu Krishnamurti',p:'Espadas',img:'/images/cards/espadas-paje.png',eje:'Consciencia abierta que observa sin método',i:'Mirada sin rótulos. No acumula doctrina: observa.'},
  {id:34,a:'Reina de Espadas',n:'Reina',m:'Sor Juana Inés de la Cruz',p:'Espadas',img:'/images/cards/espadas-reina.png',eje:'Lucidez intelectual que corta sin perder elegancia',i:'Pensamiento claro y agudo, atravesado por sensibilidad simbólica.'},
  {id:35,a:'Rey de Espadas',n:'Rey',m:'Sigmund Freud',p:'Espadas',img:'/images/cards/espadas-rey.png',eje:'Soberanía de la mente que revela lo inconsciente',i:'Autoridad en el territorio de la mente.'},
  {id:36,a:'Caballero de Espadas',n:'Caballero',m:'Ludwig Wittgenstein',p:'Espadas',img:'/images/cards/espadas-caballero.png',eje:'Movimiento incisivo hacia el límite del lenguaje',i:'Atraviesa los problemas hasta exponer su raíz.'},

  // ── COPAS ──
  {id:37,a:'As de Copas',n:'As',m:'Walt Whitman',p:'Copas',img:null,eje:'Nacimiento del amor expansivo',i:'La fuente afectiva que reconoce al otro como extensión de sí mismo.'},
  {id:38,a:'Dos de Copas',n:'2',m:'Eckhart Tolle',p:'Copas',img:null,eje:'Presencia que une sin conflicto',i:'Presencia plena como fundamento del vínculo auténtico.'},
  {id:39,a:'Tres de Copas',n:'3',m:'Sobonfu Somé',p:'Copas',img:null,eje:'Celebración ritual que sostiene comunidad',i:'El corazón que, al celebrar, sana.'},
  {id:40,a:'Cuatro de Copas',n:'4',m:'Simone de Beauvoir',p:'Copas',img:null,eje:'Amor que concilia conciencia y libertad',i:'El corazón que no abdica de su libertad en el encuentro.'},
  {id:41,a:'Cinco de Copas',n:'5',m:'Pierre Teilhard de Chardin',p:'Copas',img:null,eje:'Evolución como proceso espiritual y cósmico',i:'El amor que atraviesa fracturas sin separarse.'},
  {id:42,a:'Seis de Copas',n:'6',m:'Humberto Maturana',p:'Copas',img:null,eje:'Vínculo que co-crea realidad',i:'La ternura como condición de coexistencia.'},
  {id:43,a:'Siete de Copas',n:'7',m:'Mirabai',p:'Copas',img:null,eje:'Embriaguez del corazón que desborda toda medida',i:'El deseo transfigurado en pasión divina.'},
  {id:44,a:'Ocho de Copas',n:'8',m:'Jeff Foster',p:'Copas',img:null,eje:'Inclusión del dolor en el corazón',i:'El amor que lo permea todo, incluso cuando duele.'},
  {id:45,a:'Nueve de Copas',n:'9',m:'Hafez',p:'Copas',img:null,eje:'Éxtasis poético que guía hacia la cumbre espiritual',i:'El gozo que se sabe colmado.'},
  {id:46,a:'Diez de Copas',n:'10',m:'Thich Nhat Hanh',p:'Copas',img:null,eje:'Amor que se vuelve acción consciente y serena',i:'El corazón que organiza la convivencia pacífica.'},
  {id:47,a:'Paje de Copas',n:'Paje',m:'Anandamayi Ma',p:'Copas',img:'/images/cards/copas-paje.png',eje:'Inocencia espiritual que brota del corazón',i:'Pureza afectiva en estado naciente. Revela sin convencer.'},
  {id:48,a:'Reina de Copas',n:'Reina',m:'Rabia al-Adawiyya',p:'Copas',img:'/images/cards/copas-reina.png',eje:'Amor absoluto desinteresado',i:'La pureza afectiva que no negocia ni busca retorno.'},
  {id:49,a:'Rey de Copas',n:'Rey',m:'Francisco de Asís',p:'Copas',img:'/images/cards/copas-rey.png',eje:'Ternura que gobierna con humildad',i:'El corazón maduro que convierte el amor en servicio.'},
  {id:50,a:'Caballero de Copas',n:'Caballero',m:'Claudio Naranjo',p:'Copas',img:'/images/cards/copas-caballero.png',eje:'Amor que impulsa transformación psicológica-espiritual',i:'El impulso del corazón que busca despertar integral.'},

  // ── OROS ──
  {id:51,a:'As de Oros',n:'As',m:'Joanna Macy',p:'Oros',img:'/images/cards/oros-as.png',eje:'La semilla de conciencia encarnada en la tierra',i:'Nacimiento de una ética del cuidado que emerge desde adentro.'},
  {id:52,a:'Dos de Oros',n:'2',m:'Wangari Maathai',p:'Oros',img:'/images/cards/oros-02.png',eje:'Equilibrio dinámico entre naturaleza y estructura social',i:'Armoniza ecología, economía y comunidad.'},
  {id:53,a:'Tres de Oros',n:'3',m:'Vandana Shiva',p:'Oros',img:null,eje:'Construcción colectiva al servicio de la Tierra',i:'Trabajo desde la colaboración concreta y el compromiso territorial.'},
  {id:54,a:'Cuatro de Oros',n:'4',m:'Dogen',p:'Oros',img:null,eje:'La práctica es inseparable de la realización',i:'La disciplina cotidiana como lugar del despertar.'},
  {id:55,a:'Cinco de Oros',n:'5',m:'Stanislav Grof',p:'Oros',img:null,eje:'Crisis como umbral de transformación',i:'La estructura convencional que ya no puede contener lo que emerge.'},
  {id:56,a:'Seis de Oros',n:'6',m:'Madre Teresa de Calcuta',p:'Oros',img:null,eje:'Equilibrio material a través del acto de dar',i:'La justicia del corazón aplicada a la materia.'},
  {id:57,a:'Siete de Oros',n:'7',m:'Sri Aurobindo',p:'Oros',img:null,eje:'Evolución espiritual de la materia',i:'El cultivo paciente de la espiritualidad evolutiva.'},
  {id:58,a:'Ocho de Oros',n:'8',m:'Satish Kumar',p:'Oros',img:null,eje:'Trabajo consciente como práctica espiritual cotidiana',i:'El ideal convertido en práctica sostenida.'},
  {id:59,a:'Nueve de Oros',n:'9',m:'Nelson Mandela',p:'Oros',img:null,eje:'Dignidad sostenida en la adversidad',i:'La riqueza de la integridad y la dignidad humana.'},
  {id:60,a:'Diez de Oros',n:'10',m:'G.W.F. Hegel',p:'Oros',img:null,eje:'La materia como escenario de realización del Espíritu',i:'La herencia cultural como síntesis viva.'},
  {id:61,a:'Paje de Oros',n:'Paje',m:'Terence McKenna',p:'Oros',img:'/images/cards/oros-paje.png',eje:'Curiosidad radical ante la materia viva',i:'La mente joven que observa la materia como misterio.'},
  {id:62,a:'Reina de Oros',n:'Reina',m:'Wu Zetian',p:'Oros',img:'/images/cards/oros-reina.png',eje:'Soberanía material ejercida con inteligencia estratégica',i:'La organización tangible del poder con autoridad y eficacia.'},
  {id:63,a:'Rey de Oros',n:'Rey',m:'Rudolf Steiner',p:'Oros',img:'/images/cards/oros-rey.png',eje:'Diseño consciente de estructuras vitales',i:'Gobierno estructural al servicio de la conciencia.'},
  {id:64,a:'Caballero de Oros',n:'Caballero',m:'Masanobu Fukuoka',p:'Oros',img:'/images/cards/oros-caballero.png',eje:'Acción mínima que produce abundancia',i:'Confía en los ritmos naturales y revivifica sin violencia.'},

  // ── BASTOS ──
  {id:65,a:'As de Bastos',n:'As',m:'Martin Luther King Jr.',p:'Bastos',img:'/images/cards/bastos-as.png',eje:'La chispa que enciende transformación colectiva',i:'Fuego moral que moviliza conciencia y acción.'},
  {id:66,a:'Dos de Bastos',n:'2',m:'Wilhelm Reich',p:'Bastos',img:null,eje:'Tensión entre impulso vital y estructura que lo contiene',i:'El fuego en punto de decisión: expansión o bloqueo.'},
  {id:67,a:'Tres de Bastos',n:'3',m:'Martha Graham',p:'Bastos',img:null,eje:'El cuerpo enciende la forma',i:'La expresión corporal como lenguaje espiritual de primera magnitud.'},
  {id:68,a:'Cuatro de Bastos',n:'4',m:'Joseph Campbell',p:'Bastos',img:null,eje:'El mito estructura el fuego',i:'El hogar simbólico donde el fuego se transmite como experiencia mítica.'},
  {id:69,a:'Cinco de Bastos',n:'5',m:'Alejandro Jodorowsky',p:'Bastos',img:null,eje:'Iniciación destinada a impactar en el inconsciente',i:'El fuego arde por la combustión del simbolismo esotérico.'},
  {id:70,a:'Seis de Bastos',n:'6',m:'Anthony de Mello',p:'Bastos',img:null,eje:'Alegría en la consciencia despierta',i:'Humor, paradoja y desconcierto como elementos transformadores.'},
  {id:71,a:'Siete de Bastos',n:'7',m:'Yeshe Tsogyal',p:'Bastos',img:null,eje:'Prueba espiritual sostenida por fuego interior',i:'El fuego que resiste sin endurecerse.'},
  {id:72,a:'Ocho de Bastos',n:'8',m:'Wolfgang Amadeus Mozart',p:'Bastos',img:null,eje:'Flujo creativo veloz y expansión armónica',i:'La chispa que se convierte en forma casi instantáneamente.'},
  {id:73,a:'Nueve de Bastos',n:'9',m:'Carl Jung',p:'Bastos',img:null,eje:'Confrontar la sombra ardiente',i:'La sombra como reserva de energía transformable.'},
  {id:74,a:'Diez de Bastos',n:'10',m:'Yukio Mishima',p:'Bastos',img:null,eje:'Encarnación de lo estético y lo trágico',i:'La potencia que puede quemarse en su propia intensidad.'},
  {id:75,a:'Paje de Bastos',n:'Paje',m:'Chögyam Trungpa',p:'Bastos',img:'/images/cards/bastos-paje.png',eje:'Chispa disruptiva que inaugura nueva transmisión',i:'Fuego joven que irrumpe en territorios nuevos.'},
  {id:76,a:'Reina de Bastos',n:'Reina',m:'Teresa de Ávila',p:'Bastos',img:'/images/cards/bastos-reina.png',eje:'Éxtasis interior transformador',i:'Autoridad espiritual nacida de experiencia directa.'},
  {id:77,a:'Rey de Bastos',n:'Rey',m:'Hua-Ching Ni',p:'Bastos',img:'/images/cards/bastos-rey.png',eje:'Dominio consciente del fuego vital',i:'La autoridad que surge del dominio interior del impulso vital.'},
  {id:78,a:'Caballero de Bastos',n:'Caballero',m:'Nisargadatta Maharaj',p:'Bastos',img:'/images/cards/bastos-caballero.png',eje:'Impulso ardiente hacia la realización directa',i:'No teoriza ni consuela: enciende.'},
];

// ── dimensiones ───────────────────────────────────────────────────────────────
const DIMENSIONES = [
  { id: 'DIMENSION_COMPRENDER', texto: 'Quiero entender algo mejor hoy' },
  { id: 'DIMENSION_ACTUAR', texto: 'Necesito energía o dirección para actuar' },
  { id: 'DIMENSION_VINCULOS', texto: 'Algo en mis vínculos pide atención' },
  { id: 'DIMENSION_SOLTAR', texto: 'Quiero soltar algo que ya no me sirve' },
  { id: 'DIMENSION_EMERGENTE', texto: 'Siento que algo nuevo está naciendo en mí' }
];

// ── tonos (asignados al azar, nunca visibles) ────────────────────────────────
const TONOS = ['TONO_CONTEMPLATIVO', 'TONO_ACTIVO', 'TONO_POETICO'];

// ── calcular momento del día según hora local ─────────────────────────────────
const getMomento = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'MOMENTO_MANANA';
  if (hour >= 12 && hour < 17) return 'MOMENTO_MEDIODIA';
  if (hour >= 17 && hour < 21) return 'MOMENTO_TARDE';
  return 'MOMENTO_NOCHE';
};

// ── helpers de estilo ─────────────────────────────────────────────────────────
const cfg = (p) => p ? PC[p] : { s:'✧', c:'#9b7fd4', b:'#100d1e' };
const toMR = (n) => ({'IV':'IIII','IX':'VIIII','XIV':'XIIII','XIX':'XVIIII'})[n] || n;
const arcanoLabel = (card, upper) => {
  if (card.p) return upper ? card.p.toUpperCase() : card.p;
  if (card.n === '0') return upper ? 'ARCANO MAYOR' : 'Arcano Mayor';
  return upper ? `ARCANO ${toMR(card.n)}` : `Arcano ${toMR(card.n)}`;
};

// ── componentes de carta ──────────────────────────────────────────────────────
function CardBack() {
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',background:'linear-gradient(150deg,#14112a 0%,#0a0810 100%)',border:'1px solid rgba(201,168,76,0.35)',borderRadius:12,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10}}>
      <div style={{position:'absolute',inset:7,border:'1px solid rgba(201,168,76,0.12)',borderRadius:8}}/>
      <div style={{fontSize:26,color:'rgba(201,168,76,0.5)'}}>✦</div>
      <div style={{fontSize:9,letterSpacing:3,color:'rgba(201,168,76,0.35)'}}>TU CARTA DE HOY</div>
      <div style={{fontSize:8,letterSpacing:2,color:'rgba(201,168,76,0.2)',fontStyle:'italic'}}>revelando...</div>
    </div>
  );
}

function CardFront({ card }) {
  const c = cfg(card.p);
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:'rotateY(180deg)',background:`linear-gradient(150deg,${c.b} 0%,#08080f 100%)`,border:`1px solid ${c.c}55`,borderRadius:12,boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between',overflow:'hidden'}}>
      {card.img ? (
        <div style={{position:'relative',width:'100%',height:'100%'}}>
          <div
            style={{
              width:'100%',
              height:'100%',
              backgroundImage:`url(${card.img})`,
              backgroundSize:'contain',
              backgroundRepeat:'no-repeat',
              backgroundPosition:'center',
              borderRadius:11,
            }}
          />
          <div
            style={{
              position:'absolute',
              inset:0,
              zIndex:10,
              cursor:'default',
            }}
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      ) : (
        <div style={{padding:'14px 12px',display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%',boxSizing:'border-box'}}>
          <div style={{position:'absolute',inset:6,border:`1px solid ${c.c}20`,borderRadius:8,pointerEvents:'none'}}/>
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontSize:14,color:c.c}}>{c.s}</span>
              <span style={{fontSize:8,letterSpacing:1,color:`${c.c}99`}}>{card.n}</span>
            </div>
            <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}55,transparent)`,marginBottom:8}}/>
            <div style={{fontSize:13,lineHeight:1.3,color:'#e8dfc8',marginBottom:4}}>{card.a}</div>
            <div style={{fontSize:10,color:'#999',fontStyle:'italic',marginBottom:4}}>{card.m}</div>
            <div style={{fontSize:8,letterSpacing:1.5,color:`${c.c}88`}}>{arcanoLabel(card, true)}</div>
          </div>
          <div>
            <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}33,transparent)`,marginBottom:7}}/>
            <div style={{fontSize:9,lineHeight:1.45,color:'#b8a888',fontStyle:'italic'}}>{card.eje}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function FlipCard({ card, flipped }) {
  return (
    <div style={{width:155,height:270,perspective:1000,flexShrink:0,margin:'0 auto'}}>
      <div style={{position:'relative',width:'100%',height:'100%',transformStyle:'preserve-3d',transition:'transform 0.65s ease',transform:flipped?'rotateY(180deg)':'rotateY(0)'}}>
        <CardBack />
        <CardFront card={card}/>
      </div>
    </div>
  );
}

function Btn({ label, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{padding:'11px 30px',background:'transparent',border:`1px solid ${disabled?'rgba(201,168,76,.2)':'#c9a84c'}`,borderRadius:4,color:disabled?'rgba(201,168,76,.25)':'#c9a84c',fontSize:9,letterSpacing:4,cursor:disabled?'not-allowed':'pointer',fontFamily:'inherit',transition:'all .25s'}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.background='rgba(201,168,76,.1)'}}
      onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
      {label}
    </button>
  );
}

// ── componente principal ──────────────────────────────────────────────────────
export default function CartaDelDia({ onBack }) {
  const [session, setSession] = useState(null);
  const [nombre, setNombre] = useState('');
  const [dimension, setDimension] = useState(null);
  const [card, setCard] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        // Opcional: cargar nombre del usuario si está guardado
        supabase.from('usuarios').select('nombre').eq('id', s.user.id).single()
          .then(({ data }) => { if (data?.nombre) setNombre(data.nombre); });
      }
    });
  }, []);

  const revelarCarta = () => {
    if (!dimension) return;

    // Elegir carta al azar
    const randomCard = CARDS[Math.floor(Math.random() * CARDS.length)];
    setCard(randomCard);
    setFlipped(false);

    // Voltear carta después de un momento
    setTimeout(() => {
      setFlipped(true);
      // Llamar API después del volteo
      setTimeout(() => consultarOracle(randomCard), 800);
    }, 300);
  };

  const consultarOracle = async (cartaActual) => {
    setLoading(true);
    setErr('');

    const tono = TONOS[Math.floor(Math.random() * TONOS.length)];
    const momento = getMomento();

    // Determinar tipo y serie de la carta
    const tipo = cartaActual.p === null ? 'Mayor' : 'Menor';
    let serie = 'Primera';
    if (tipo === 'Mayor' && cartaActual.n !== '0') {
      const romanosSegundaSerie = ['XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
      if (romanosSegundaSerie.includes(cartaActual.n)) {
        serie = 'Segunda';
      }
    }

    const msg = `CARTA DEL DÍA

Carta: ${cartaActual.a} — ${cartaActual.m}
Tipo: ${tipo}
${tipo === 'Menor' ? `Número: ${cartaActual.n} | Palo: ${cartaActual.p}` : `Serie: ${serie}`}
Eje arquetípico: ${cartaActual.eje}

Intención del consultante: ${dimension}
Registro tonal: ${tono}
Momento del día: ${momento}
Nombre del consultante: ${nombre || 'no proporcionado'}`;

    const apiBody = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYS_CARTA_DEL_DIA,
      messages: [{ role: 'user', content: msg }],
      carta: { id: cartaActual.id, a: cartaActual.a, m: cartaActual.m, img: cartaActual.img, p: cartaActual.p || null, n: cartaActual.n },
      dimension,
      momento,
      nombre: nombre || null
    };

    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch('/api/carta-del-dia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${s.access_token}` },
        body: JSON.stringify(apiBody)
      });

      if (res.status === 401) throw new Error('Sesión expirada. Recargá la página.');
      if (res.status === 402) {
        const d = await res.json();
        throw new Error(d.error === 'creditos_vencidos'
          ? 'Tus créditos vencieron. Escribinos para recargar.'
          : 'No te quedan créditos disponibles. Escribinos para recargar.');
      }

      const data = await res.json();

      if (!res.ok || data.type === 'error') {
        throw new Error(data?.error?.message || `HTTP ${res.status}`);
      }

      const txt = data.content.map(c => c.text || '').join('');
      setReading(txt);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDimension(null);
    setCard(null);
    setFlipped(false);
    setReading(null);
    setErr('');
  };

  // ── pantalla inicial: selección de dimensión ─────────────────────────────────
  if (!card) {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#0a0a12 0%,#14101f 100%)',color:'#e8dfc8',padding:'40px 20px',fontFamily:'system-ui,-apple-system,sans-serif'}}>
        <div style={{maxWidth:600,margin:'0 auto'}}>
          {/* Header con botón volver */}
          <div style={{marginBottom:40}}>
            <button
              onClick={onBack}
              style={{background:'transparent',border:'1px solid rgba(201,168,76,0.3)',borderRadius:4,color:'#c9a84c',fontSize:9,letterSpacing:2,padding:'8px 20px',cursor:'pointer',fontFamily:'inherit'}}
            >
              ← VOLVER
            </button>
          </div>

          {/* Título */}
          <div style={{textAlign:'center',marginBottom:50}}>
            <h1 style={{fontSize:32,margin:'0 0 10px',color:'#c9a84c',fontWeight:300,letterSpacing:2}}>
              Tu carta de hoy
            </h1>
            <p style={{fontSize:14,color:'#9a8f7a',margin:0,letterSpacing:1}}>
              ¿Desde dónde querés mirar tu día?
            </p>
          </div>

          {/* Dimensiones */}
          <div style={{marginBottom:40}}>
            {DIMENSIONES.map(d => (
              <button
                key={d.id}
                onClick={() => setDimension(d.id)}
                style={{
                  display:'block',
                  width:'100%',
                  padding:'16px 20px',
                  marginBottom:12,
                  background: dimension === d.id ? 'rgba(201,168,76,0.15)' : 'transparent',
                  border: `1px solid ${dimension === d.id ? '#c9a84c' : 'rgba(201,168,76,0.25)'}`,
                  borderRadius:6,
                  color: dimension === d.id ? '#c9a84c' : '#9a8f7a',
                  fontSize:13,
                  textAlign:'left',
                  cursor:'pointer',
                  fontFamily:'inherit',
                  transition:'all .25s',
                  letterSpacing:0.5
                }}
                onMouseEnter={e => {
                  if (dimension !== d.id) {
                    e.currentTarget.style.background = 'rgba(201,168,76,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)';
                  }
                }}
                onMouseLeave={e => {
                  if (dimension !== d.id) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
                  }
                }}
              >
                {d.texto}
              </button>
            ))}
          </div>

          {/* Botón revelar */}
          <div style={{textAlign:'center'}}>
            <Btn label="REVELAR MI CARTA" onClick={revelarCarta} disabled={!dimension} />
          </div>
        </div>
      </div>
    );
  }

  // ── pantalla de resultado ────────────────────────────────────────────────────
  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#0a0a12 0%,#14101f 100%)',color:'#e8dfc8',padding:'40px 20px',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <div style={{maxWidth:700,margin:'0 auto'}}>
        {/* Header */}
        <div style={{marginBottom:30,textAlign:'center'}}>
          <h2 style={{fontSize:18,color:'#c9a84c',fontWeight:300,letterSpacing:3,margin:'0 0 30px'}}>
            TU CARTA DE HOY
          </h2>
        </div>

        {/* Carta */}
        <div style={{marginBottom:30}}>
          <FlipCard card={card} flipped={flipped} />
        </div>

        {/* Nombre de la carta */}
        <div style={{textAlign:'center',marginBottom:10}}>
          <div style={{fontSize:22,color:'#e8dfc8',marginBottom:6}}>{card.a}</div>
          <div style={{fontSize:14,color:'#9a8f7a',fontStyle:'italic'}}>{card.m}</div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{textAlign:'center',padding:'40px 20px'}}>
            <div style={{fontSize:24,color:'#c9a84c',marginBottom:15}}>✦</div>
            <div style={{fontSize:12,letterSpacing:2,color:'#9a8f7a'}}>Interpretando...</div>
          </div>
        )}

        {/* Error */}
        {err && (
          <div style={{background:'rgba(204,119,85,0.1)',border:'1px solid rgba(204,119,85,0.3)',borderRadius:6,padding:15,marginBottom:20}}>
            <div style={{fontSize:13,color:'#cc7755'}}>{err}</div>
          </div>
        )}

        {/* Lectura */}
        {reading && (
          <div style={{marginBottom:30}}>
            <div style={{fontSize:14,lineHeight:1.8,color:'#c8bda8',whiteSpace:'pre-wrap'}}>
              {reading}
            </div>
          </div>
        )}

        {/* Botón nueva carta */}
        {!loading && (reading || err) && (
          <div style={{textAlign:'center',marginTop:40}}>
            <Btn label="NUEVA CARTA" onClick={reset} />
          </div>
        )}
      </div>
    </div>
  );
}
