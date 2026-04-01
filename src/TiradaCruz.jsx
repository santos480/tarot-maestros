import { useState } from "react";

// ── paleta por palo ───────────────────────────────────────────────────────────
const PC = {
  Espadas: { s:'⚔', c:'#8fc4d8', b:'#0c1a22' },
  Copas:   { s:'◐', c:'#7ab0cc', b:'#0a1520' },
  Oros:    { s:'◉', c:'#c9a84c', b:'#16130a' },
  Bastos:  { s:'✦', c:'#cc7755', b:'#1a0f0a' },
};

// ── prompt del sistema para la tirada en cruz ────────────────────────────────
const SYS_CRUZ = `Eres el intérprete del Tarot de los Maestros en la Tirada en Cruz de 5 cartas.

PRINCIPIOS: No predices el futuro: iluminas dinámicas presentes y posibilidades de integración. Los maestros encarnan cualidades arquetípicas, no sus biografías. El sentido emerge de la relación entre las cinco cartas y la carta central es el eje de todo. Si el nombre del consultante está disponible, úsalo de forma natural y cálida.

NUMEROLOGÍA: 1=Unidad emergente, primer impulso. 2=Polaridad, relación entre principios. 3=Síntesis creativa, expresión. 4=Estructura, estabilización. 5=Crisis necesaria, fricción, apertura. 6=Reequilibrio, flujo restaurado. 7=Profundización, prueba interior. 8=Integración dinámica, dominio consciente. 9=Culminación, plenitud antes del cierre. 10=Saturación y umbral, anuncia nuevo ciclo.

PALOS: Espadas=mente/paradigma/discernimiento. Copas=emoción/vínculo/amor. Oros=materia/práctica/encarnación. Bastos=energía/acción/fuego creador.

CORTE: Paje=energía naciente. Reina=interiorización y maduración. Rey=estructura madura, autoridad. Caballero=movimiento, transmisión.

LAS 5 POSICIONES DE LA CRUZ:

CARTA CENTRAL — LA ESENCIA: Foco absoluto de la lectura. Estado presente, lección principal, tema que organiza toda la tirada. Toda interpretación debe orbitar en torno a ella. Observa hacia dónde mira el maestro de esta carta: si mira a la izquierda, el consultante puede estar demasiado pendiente de lo inevitable; a la derecha, puede tener exceso de confianza en lo que viene; hacia abajo, puede estar atrapado en emociones; hacia arriba, puede estar ignorando las corrientes subterráneas. Esta observación debe integrarse en la síntesis.

CARTA IZQUIERDA — LA CORRIENTE: Factor externo que ya está en marcha. El consultante no puede evitarlo ni controlarlo completamente. No es necesariamente negativo: es inevitable. Deberá integrarlo y trabajar con ello. Es del plano horizontal: externo y temporal. Interprétala siempre a través de la perspectiva de La Esencia.

CARTA DERECHA — EL HORIZONTE: Lo que probablemente se avecina. Aún no ha ocurrido pero es la dirección probable de los eventos. Las acciones del consultante pueden influir en esto. También del plano horizontal: externo y temporal. Interprétala a través de La Esencia.

CARTA INFERIOR — LA SOMBRA: Lo que opera desde debajo de la superficie: impulsos profundos, emociones no procesadas, sombra. El consultante necesita reconocerlo para adaptarse conscientemente. También del plano vertical: interno. Coexiste simultáneamente con La Conciencia, no es secuencial a ella. Léela antes que La Conciencia para no dejar al final lo que puede ser más difícil de asimilar.

CARTA SUPERIOR — LA CONCIENCIA: Lo que está activo en la mente consciente del consultante. Permite concentrarse y reflexionar intencionalmente. Es una herramienta disponible. Del plano vertical: interno. Interprétala en relación con La Esencia, no secuencialmente con La Sombra. Léela después de La Sombra como recurso integrador.

SÍNTESIS (4-5 párrafos): Integra las 5 cartas respondiendo la pregunta del consultante con profundidad. Considera: (1) la atmósfera general y el tono de la tirada; (2) patrones elementales: ¿qué palo predomina?; (3) patrones numéricos: números bajos indican comienzos, altos indican ajustes finales; (4) la dirección de La Esencia y lo que revela sobre la actitud del consultante; (5) el eje horizontal como trayectoria de eventos externos, el eje vertical como profundidad interna. Concluye siempre volviendo a La Esencia y a la pregunta original.

ESTILO: contemplativo, cálido, preciso. No predices: describes dinámicas y posibilidades. Empodera la autonomía. Responde en español rioplatense argentino: usá vos, sos, ustedes. Nunca uses vosotros, sois ni tuteo.

REGLA CRÍTICA DE AISLAMIENTO: La interpretación individual de cada carta debe referirse ÚNICAMENTE a esa carta. Está estrictamente prohibido mencionar el Maestro, el nombre o el arcano de otra carta dentro de la interpretación individual. Cada interpretación es completamente independiente.

RESPONDE ÚNICAMENTE con JSON válido, sin texto antes ni después, sin backticks. NUNCA uses comillas dobles dentro de los valores. Sin saltos de línea dentro de los valores. El JSON debe tener exactamente estas claves:
{"esencia":"2 párrafos cortos","corriente":"2 párrafos cortos","horizonte":"2 párrafos cortos","conciencia":"2 párrafos cortos","sombra":"2 párrafos cortos","sintesis":"4-5 párrafos que integren todo respondiendo la pregunta"}`;

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

// ── 5 posiciones de la cruz ───────────────────────────────────────────────────
// deck[0]=esencia(centro) deck[1]=corriente(izq) deck[2]=horizonte(der)
// deck[3]=conciencia(arriba) deck[4]=sombra(abajo)
const POSITIONS = [
  { key:'esencia',    label:'La Esencia',    sub:'Estado presente · La lección · El foco de todo' },
  { key:'corriente',  label:'La Corriente',  sub:'Factor externo · Ya está en marcha · Inevitable' },
  { key:'horizonte',  label:'El Horizonte',  sub:'Dirección probable · Lo que se avecina' },
  { key:'conciencia', label:'La Conciencia', sub:'Mente consciente · Foco intencional disponible' },
  { key:'sombra',     label:'La Sombra',     sub:'Impulso profundo · Opera desde abajo' },
];

// ── helpers ───────────────────────────────────────────────────────────────────
const cfg = (p) => p ? PC[p] : { s:'✧', c:'#9b7fd4', b:'#100d1e' };
const toMR = n => ({'IV':'IIII','IX':'VIIII','XIV':'XIIII','XIX':'XVIIII'})[n] || n;
const arcanoLabel = (card, upper) => {
  if (card.p) return upper ? card.p.toUpperCase() : card.p;
  if (card.n === '0') return upper ? 'ARCANO MAYOR' : 'Arcano Mayor';
  return upper ? `ARCANO ${toMR(card.n)}` : `Arcano ${toMR(card.n)}`;
};

// ── tamaño de carta en la cruz ────────────────────────────────────────────────
const CW = 113;
const CH = 196;

// ── componentes de carta ──────────────────────────────────────────────────────
function CrossCardBack({ posLabel }) {
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',background:'linear-gradient(150deg,#14112a 0%,#0a0810 100%)',border:'1px solid rgba(201,168,76,0.35)',borderRadius:10,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,cursor:'pointer'}}>
      <div style={{position:'absolute',inset:6,border:'1px solid rgba(201,168,76,0.12)',borderRadius:7}}/>
      <div style={{fontSize:20,color:'rgba(201,168,76,0.5)'}}>✦</div>
      <div style={{fontSize:7,letterSpacing:1.5,color:'rgba(201,168,76,0.4)',textAlign:'center',padding:'0 10px',lineHeight:1.4}}>{posLabel}</div>
      <div style={{fontSize:7,color:'rgba(201,168,76,0.2)',fontStyle:'italic'}}>toca para revelar</div>
    </div>
  );
}

function CrossCardFront({ card }) {
  const c = cfg(card.p);
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:'rotateY(180deg)',background:`linear-gradient(150deg,${c.b} 0%,#08080f 100%)`,border:`1px solid ${c.c}55`,borderRadius:10,boxSizing:'border-box',overflow:'hidden'}}>
      {card.img ? (
        <img src={card.img} alt={card.a} style={{width:'100%',height:'100%',objectFit:'contain',borderRadius:9,display:'block'}}/>
      ) : (
        <div style={{padding:'10px 9px',display:'flex',flexDirection:'column',justifyContent:'space-between',height:'100%',boxSizing:'border-box'}}>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <span style={{fontSize:12,color:c.c}}>{c.s}</span>
              <span style={{fontSize:7,color:`${c.c}99`}}>{card.n}</span>
            </div>
            <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}55,transparent)`,marginBottom:6}}/>
            <div style={{fontSize:11,lineHeight:1.3,color:'#e8dfc8',marginBottom:3}}>{card.a}</div>
            <div style={{fontSize:9,color:'#999',fontStyle:'italic',marginBottom:3}}>{card.m}</div>
            <div style={{fontSize:7.5,letterSpacing:1,color:`${c.c}88`}}>{arcanoLabel(card,true)}</div>
          </div>
          <div>
            <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}33,transparent)`,marginBottom:5}}/>
            <div style={{fontSize:8,lineHeight:1.4,color:c.c,fontStyle:'italic'}}>{card.eje}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function CrossFlipCard({ card, flipped, onFlip, posLabel }) {
  return (
    <div
      style={{width:CW,height:CH,perspective:1000,cursor:flipped?'default':'pointer',flexShrink:0}}
      onClick={() => !flipped && onFlip()}
    >
      <div style={{position:'relative',width:'100%',height:'100%',transformStyle:'preserve-3d',transition:'transform 0.65s ease',transform:flipped?'rotateY(180deg)':'rotateY(0)'}}>
        <CrossCardBack posLabel={posLabel}/>
        <CrossCardFront card={card}/>
      </div>
    </div>
  );
}

// ── layout de cruz ────────────────────────────────────────────────────────────
function CrossGrid({ deck, rev, onFlip }) {
  const labels = POSITIONS.map(p => p.label);
  const goldTag = (txt, align='center') => (
    <div style={{fontSize:7,letterSpacing:2,color:'#c9a84c',textAlign:align,opacity:.8,marginBottom:4}}>
      {txt.toUpperCase()}
    </div>
  );
  const cellStyle = (gridArea, align='center') => ({
    gridArea,
    display:'flex',
    flexDirection:'column',
    alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-end' : 'flex-start',
    justifyContent:'center',
  });

  return (
    <div style={{
      display:'grid',
      gridTemplateAreas:`". top ." "left center right" ". bottom ."`,
      gridTemplateColumns:`${CW}px ${CW}px ${CW}px`,
      gridTemplateRows:'auto auto auto',
      gap:'10px 8px',
      margin:'0 auto',
      width:'fit-content',
    }}>
      {/* CONCIENCIA — arriba */}
      <div style={cellStyle('top')}>
        {goldTag(labels[3])}
        <CrossFlipCard card={deck[3]} flipped={rev[3]} onFlip={()=>onFlip(3)} posLabel={labels[3]}/>
      </div>

      {/* CORRIENTE — izquierda */}
      <div style={cellStyle('left')}>
        {goldTag(labels[1])}
        <CrossFlipCard card={deck[1]} flipped={rev[1]} onFlip={()=>onFlip(1)} posLabel={labels[1]}/>
      </div>

      {/* ESENCIA — centro */}
      <div style={{...cellStyle('center'),position:'relative'}}>
        {goldTag(labels[0])}
        <div style={{position:'relative'}}>
          <CrossFlipCard card={deck[0]} flipped={rev[0]} onFlip={()=>onFlip(0)} posLabel={labels[0]}/>
          {/* halo sutil para destacar el centro */}
          <div style={{position:'absolute',inset:-4,borderRadius:14,border:'1px solid rgba(201,168,76,0.25)',pointerEvents:'none'}}/>
        </div>
      </div>

      {/* HORIZONTE — derecha */}
      <div style={cellStyle('right')}>
        {goldTag(labels[2])}
        <CrossFlipCard card={deck[2]} flipped={rev[2]} onFlip={()=>onFlip(2)} posLabel={labels[2]}/>
      </div>

      {/* SOMBRA — abajo */}
      <div style={cellStyle('bottom')}>
        <CrossFlipCard card={deck[4]} flipped={rev[4]} onFlip={()=>onFlip(4)} posLabel={labels[4]}/>
        <div style={{marginTop:6}}>{goldTag(labels[4])}</div>
      </div>
    </div>
  );
}

// ── componentes auxiliares ────────────────────────────────────────────────────
function Paras({ text }) {
  return (
    <div>
      {text.split(/\n+/).filter(p=>p.trim()).map((p,i) => (
        <p key={i} style={{margin:'0 0 10px',lineHeight:1.8,color:'#c8bda8',fontSize:14}}>{p}</p>
      ))}
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
export default function TiradaCruz({ onBack }) {
  const [phase, setPhase]     = useState('question');
  const [name, setName]       = useState('');
  const [q, setQ]             = useState('');
  const [deck, setDeck]       = useState([]);
  const [rev, setRev]         = useState([false,false,false,false,false]);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const start = () => {
    if (!q.trim()) return;
    const d = [...CARDS].sort(()=>Math.random()-.5).slice(0,5);
    setDeck(d);
    setRev([false,false,false,false,false]);
    setReading(null);
    setErr('');
    setPhase('reveal');
  };

  const flip = i => {
    if (rev[i]) return;
    setRev(p => { const n=[...p]; n[i]=true; return n; });
  };

  const allRev = rev.every(Boolean);

  const callAPI = async (msg, attempt=1) => {
    const res = await fetch('/api/oracle-cruz', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:16000,
        system:SYS_CRUZ,
        messages:[{role:'user',content:msg}]
      })
    });
    const data = await res.json();
    if ((res.status===529 || data?.error?.type==='overloaded_error') && attempt<=3) {
      await new Promise(r=>setTimeout(r,2000*attempt));
      return callAPI(msg, attempt+1);
    }
    if (!res.ok || data.type==='error') throw new Error(data?.error?.message||`HTTP ${res.status}`);
    return data;
  };

  const consult = async () => {
    setLoading(true); setPhase('loading'); setErr('');
    const nameStr = name.trim() ? `El nombre del consultante es: ${name.trim()}\n` : '';
    const posNames = [
      'ESENCIA (carta central)',
      'CORRIENTE (carta izquierda)',
      'HORIZONTE (carta derecha)',
      'CONCIENCIA (carta superior)',
      'SOMBRA (carta inferior)',
    ];
    const msg = `${nameStr}Pregunta del consultante: "${q}"\n\nTIRADA EN CRUZ — 5 CARTAS:\n\n${
      deck.map((c,i) =>
        `${posNames[i]}: ${c.a} — ${c.m}\nEje arquetípico: ${c.eje}\nCampo: ${c.p||'Arcano Mayor'}\nNúmero: ${c.n}\nIntegración: ${c.i}`
      ).join('\n\n')
    }`;
    try {
      const data = await callAPI(msg);
      const txt = data.content.map(c=>c.text||'').join('');
      const match = txt.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`Respuesta inesperada: "${txt.slice(0,120)}"`);
      let jsonStr = match[0];
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch {
        jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g,' ').replace(/\n/g,' ').replace(/\r/g,' ');
        parsed = JSON.parse(jsonStr);
      }
      const required = ['esencia','corriente','horizonte','conciencia','sombra','sintesis'];
      if (!required.every(k => parsed[k])) throw new Error('Respuesta incompleta del oráculo.');
      setReading(parsed);
      setPhase('result');
    } catch(e) {
      console.error(e);
      setErr(`El oráculo no pudo responder: ${e.message}`);
      setPhase('reveal');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhase('question'); setQ(''); setName(''); setDeck([]);
    setRev([false,false,false,false,false]); setReading(null); setErr('');
  };

  const inputStyle = {width:'100%',background:'rgba(255,255,255,.02)',border:'1px solid rgba(201,168,76,.2)',borderRadius:8,color:'#e8dfc8',fontSize:14,fontFamily:'inherit',padding:'12px 16px',boxSizing:'border-box',transition:'border-color .3s'};

  return (
    <div style={{minHeight:'100vh',background:'#08080f',color:'#e8dfc8',fontFamily:'Georgia,serif',overflowX:'hidden'}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        textarea,input{outline:none}
        textarea::placeholder,input::placeholder{color:rgba(200,185,160,.3)}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#08080f}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,76,.3);border-radius:3px}
      `}</style>

      {/* ── header ── */}
      <header style={{textAlign:'center',padding:'28px 20px 20px',borderBottom:'1px solid rgba(201,168,76,.15)',position:'relative'}}>
        {onBack && (
          <button onClick={onBack}
            style={{position:'absolute',left:20,top:'50%',transform:'translateY(-50%)',background:'transparent',border:'1px solid rgba(201,168,76,.3)',borderRadius:4,color:'rgba(201,168,76,.6)',fontSize:8,letterSpacing:2,padding:'7px 14px',cursor:'pointer',fontFamily:'inherit'}}
            onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(201,168,76,.7)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(201,168,76,.3)'}>
            ← TIRADA DE 3
          </button>
        )}
        <div style={{fontSize:10,letterSpacing:7,color:'#c9a84c',marginBottom:8,opacity:.7}}>✦ ✦ ✦</div>
        <h1 style={{margin:0,fontSize:20,fontWeight:300,letterSpacing:5,color:'#e8dfc8'}}>TAROT DE LOS MAESTROS</h1>
        <p style={{margin:'6px 0 3px',fontSize:9,letterSpacing:3,color:'#555'}}>TIRADA EN CRUZ · 5 CARTAS</p>
        <p style={{margin:0,fontSize:8,letterSpacing:1.5,color:'#3a3a3a',fontStyle:'italic'}}>
          Esencia · Corriente · Horizonte · Conciencia · Sombra
        </p>
      </header>

      <main style={{maxWidth:820,margin:'0 auto',padding:'40px 20px 60px'}}>

        {/* ── FASE PREGUNTA ── */}
        {phase==='question' && (
          <div style={{animation:'fadeUp .5s ease',textAlign:'center'}}>
            <p style={{fontSize:14,lineHeight:2,color:'#b8a888',maxWidth:540,margin:'0 auto 36px',fontStyle:'italic'}}>
              La tirada en cruz revela el estado presente como foco central,<br/>
              la corriente inevitable que llega desde la izquierda,<br/>
              el horizonte que se despliega hacia la derecha,<br/>
              la conciencia disponible arriba y la sombra que opera desde abajo.
            </p>
            <div style={{maxWidth:500,margin:'0 auto',textAlign:'left'}}>
              <div style={{marginBottom:18}}>
                <label style={{display:'block',fontSize:9,letterSpacing:4,color:'#c9a84c',marginBottom:10}}>TU NOMBRE (OPCIONAL)</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="¿Cómo te llamás?…" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor='rgba(201,168,76,.7)'}
                  onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.2)'}/>
              </div>
              <div style={{marginBottom:18}}>
                <label style={{display:'block',fontSize:9,letterSpacing:4,color:'#c9a84c',marginBottom:10}}>TU PREGUNTA</label>
                <textarea value={q} onChange={e=>setQ(e.target.value)}
                  placeholder="¿Qué deseas consultar al oráculo?…" rows={4}
                  style={{...inputStyle,resize:'vertical'}}
                  onFocus={e=>e.target.style.borderColor='rgba(201,168,76,.7)'}
                  onBlur={e=>e.target.style.borderColor='rgba(201,168,76,.2)'}/>
              </div>
              {err && <p style={{color:'#cc6655',fontSize:12,margin:'0 0 12px'}}>{err}</p>}
              <div style={{textAlign:'center'}}>
                <Btn label="TIRAR EL MAZO" onClick={start} disabled={!q.trim()}/>
              </div>
            </div>
          </div>
        )}

        {/* ── FASE REVELAR ── */}
        {phase==='reveal' && (
          <div style={{animation:'fadeUp .5s ease'}}>
            <div style={{textAlign:'center',marginBottom:28}}>
              <p style={{fontSize:9,letterSpacing:4,color:'#555',margin:'0 0 10px'}}>
                {allRev ? 'LA CRUZ HA SIDO REVELADA' : 'REVELÁ LAS CARTAS UNA POR UNA'}
              </p>
              {name.trim() && (
                <p style={{fontSize:10,letterSpacing:2,color:'#c9a84c',margin:'0 0 8px',opacity:.7}}>{name.trim()}</p>
              )}
              <p style={{fontSize:14,fontStyle:'italic',color:'#b8a888',maxWidth:500,margin:'0 auto'}}>"{q}"</p>
            </div>

            {/* cruz con scroll horizontal en pantallas chicas */}
            <div style={{overflowX:'auto',paddingBottom:16,paddingTop:4}}>
              {deck.length > 0 && (
                <CrossGrid deck={deck} rev={rev} onFlip={flip}/>
              )}
            </div>

            {err && (
              <p style={{color:'#cc6655',fontSize:12,textAlign:'center',margin:'16px 0'}}>{err}</p>
            )}
            {allRev && (
              <div style={{textAlign:'center',marginTop:32,animation:'fadeUp .4s ease'}}>
                <Btn label="CONSULTAR EL ORÁCULO" onClick={consult}/>
              </div>
            )}
          </div>
        )}

        {/* ── FASE CARGANDO ── */}
        {phase==='loading' && (
          <div style={{textAlign:'center',padding:'80px 20px',animation:'fadeUp .4s ease'}}>
            <div style={{fontSize:28,color:'#c9a84c',marginBottom:20,display:'inline-block',animation:'spin 3s linear infinite'}}>✦</div>
            <p style={{fontSize:9,letterSpacing:4,color:'#c9a84c',margin:'0 0 10px'}}>EL ORÁCULO MEDITA</p>
            <p style={{fontSize:13,color:'#666',fontStyle:'italic'}}>La cruz revela su mensaje…</p>
          </div>
        )}

        {/* ── FASE RESULTADO ── */}
        {phase==='result' && reading && (
          <div style={{animation:'fadeUp .5s ease'}}>

            {/* encabezado de la lectura */}
            <div style={{textAlign:'center',marginBottom:44}}>
              <div style={{fontSize:8,letterSpacing:5,color:'#c9a84c',marginBottom:10}}>TIRADA EN CRUZ</div>
              {name.trim() && (
                <p style={{fontSize:11,letterSpacing:2,color:'#c9a84c',margin:'0 0 8px',opacity:.8}}>{name.trim()}</p>
              )}
              <p style={{fontSize:15,fontStyle:'italic',color:'#b8a888',maxWidth:520,margin:'0 auto',lineHeight:1.7}}>"{q}"</p>
            </div>

            {/* interpretaciones en orden de lectura:
                esencia primero, luego corriente/horizonte (eje horizontal),
                luego sombra/conciencia (eje vertical — sombra primero) */}
            {[0,1,2,4,3].map((i) => {
  const pos = POSITIONS[i];
              const card = deck[i];
              const c = cfg(card.p);
              return (
                <div key={pos.key} style={{marginBottom:24,padding:'22px 24px',border:`1px solid ${c.c}30`,borderRadius:12,background:`${c.b}60`}}>
                  {/* etiqueta de posición */}
                  <div style={{marginBottom:14}}>
                    <div style={{display:'flex',alignItems:'baseline',gap:14,flexWrap:'wrap',marginBottom:5}}>
                      <span style={{fontSize:8,letterSpacing:3,color:c.c}}>{pos.label.toUpperCase()}</span>
                      <span style={{fontSize:8,color:'#444',fontStyle:'italic'}}>{pos.sub}</span>
                    </div>
                    <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}35,transparent)`}}/>
                  </div>
                  {/* carta + interpretación */}
                  <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                    <div style={{minWidth:130,maxWidth:150,flexShrink:0}}>
                      <div style={{fontSize:9,color:'#555',marginBottom:4}}>{c.s} {arcanoLabel(card,false)}</div>
                      <div style={{fontSize:15,color:'#e8dfc8',marginBottom:3,lineHeight:1.3}}>{card.a}</div>
                      <div style={{fontSize:11,color:'#888',fontStyle:'italic',marginBottom:10}}>{card.m}</div>
                      <div style={{fontSize:9,lineHeight:1.5,color:c.c,padding:'8px 10px',border:`1px solid ${c.c}25`,borderRadius:6,background:`${c.c}0d`}}>
                        {card.eje}
                      </div>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <Paras text={reading[pos.key]}/>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* síntesis */}
            <div style={{marginTop:44,padding:'28px 28px 24px',border:'1px solid rgba(201,168,76,.25)',borderRadius:12,background:'rgba(201,168,76,.03)',position:'relative'}}>
              <div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'#08080f',padding:'0 20px',fontSize:8,letterSpacing:5,color:'#c9a84c'}}>
                SÍNTESIS
              </div>
              <div style={{width:40,height:1,background:'rgba(201,168,76,.3)',margin:'0 auto 20px'}}/>
              <Paras text={reading.sintesis}/>
            </div>

            {/* chips de resumen */}
            <div style={{display:'flex',gap:8,justifyContent:'center',margin:'28px 0',flexWrap:'wrap'}}>
              {POSITIONS.map((pos,i) => {
                const card = deck[i];
                const c = cfg(card.p);
                return (
                  <div key={pos.key} style={{fontSize:10,color:'#888',padding:'5px 12px',border:`1px solid ${c.c}30`,borderRadius:20,textAlign:'center',lineHeight:1.6}}>
                    <span style={{fontSize:7,color:c.c,display:'block',letterSpacing:1}}>{pos.label}</span>
                    {c.s} {card.a}
                  </div>
                );
              })}
            </div>

            {/* acciones */}
            <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
              {onBack && <Btn label="← TIRADA DE 3" onClick={onBack}/>}
              <Btn label="NUEVA CONSULTA" onClick={reset}/>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
