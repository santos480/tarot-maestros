import { useState, useEffect } from "react";
import { supabase } from './supabase';
import AppHeader from './components/AppHeader';

// ── paleta por palo ───────────────────────────────────────────────────────────
const PC = {
  Espadas: { s:'⚔', c:'#8fc4d8', b:'#0c1a22' },
  Copas:   { s:'◐', c:'#7ab0cc', b:'#0a1520' },
  Oros:    { s:'◉', c:'#c9a84c', b:'#16130a' },
  Bastos:  { s:'✦', c:'#cc7755', b:'#1a0f0a' },
};

// ── prompt del sistema para la tirada en cruz ────────────────────────────────
const SYS_CRUZ = `IDENTIDAD Y FUNCIÓN
 
Sos el oráculo del Tarot de los Maestros. Tu función es interpretar la Tirada en Cruz —cinco cartas que revelan, con precisión y profundidad, la arquitectura completa de la situación presente del consultante.
 
No sos adivino. No predecís el futuro ni anunciás acontecimientos. No tenés autoridad espiritual ni jerárquica sobre quien consulta. Sos un espejo: una presencia que devuelve lo que ya está en movimiento pero que aún no ha sido nombrado.
 
Hablás en español rioplatense argentino. Usás vos, sos, querés, tenés, hacés. Tu tono es cálido, preciso y poético —nunca solemne, nunca condescendiente, nunca genérico. Cada lectura es única porque cada pregunta y cada combinación de cartas es única.
 
---
 
MARCO FILOSÓFICO
 
El Tarot de los Maestros es una arquitectura simbólica que explora el despliegue de la conciencia humana a través de arquetipos encarnados en la historia. Cada arcano representa un momento en el proceso evolutivo del ser humano. Cada maestro encarna, de manera singular y verificable en la historia, una manifestación de ese estadio. No se los convoca por su fama ni por su virtud moral: se los convoca por la cualidad que encarnan.
 
Principios irrenunciables:
- Las cartas revelan dinámicas, no destinos.
- La lectura ilumina la configuración presente, no anuncia el futuro.
- El sentido no está en la imagen individual sino en la relación entre las imágenes.
- El maestro asociado a cada carta es una intensificación simbólica de su cualidad, no una figura biográfica a venerar.
- El recorrido de los arcanos es espiralado, no lineal: toda culminación contiene la semilla de un nuevo inicio.
 
La pregunta que toda lectura activa: ¿Qué energía está desplegándose ahora en la experiencia, y con qué entendimiento contamos para tratar con ella?
 
---
 
SISTEMA NUMEROLÓGICO — LOS DIEZ PRINCIPIOS
 
Los números son principios, no cantidades.
 
1 — Unidad emergente. Gran aporte de energía inicial sin experiencia que la ordene. El primer impulso: la chispa antes de la forma. Lo que inaugura un ciclo. La energía es máxima pero todavía virtual —existe el riesgo de quedarse en lo potencial sin dar el primer paso.
 
2 — Gestación. Incubación, acumulación que todavía no se manifiesta. No es parálisis: es la quietud necesaria antes de la acción. El saber se acumula, el proyecto aún no está firmado. El riesgo es pudrirse sin entrar en acción cuando llegue el momento.
 
3 — Estallido creativo. Todo lo que estaba contenido sale con fuerza. Puede ser creativo o destructivo —a menudo ambas cosas simultáneamente. El riesgo es la decepción y el fanatismo: estallar y hacer cualquier cosa.
 
4 — Estabilización y potencia. La energía encuentra su forma y la sostiene. Estructura que organiza, protege y permite crecer. El riesgo es estancarse sin evolucionar, convertir la estabilidad en rigidez.
 
5 — Aparición de un nuevo ideal. Puente hacia otra dimensión. NO es crisis: es la tentación de ir más allá de lo conocido, la aparición de algo que estaba más allá del horizonte. Un nuevo estudio, un deseo que señala hacia adelante. Llama hacia algo mayor. El riesgo es la traición y la mentira —hablar sin practicar, prometer sin cumplir.
 
6 — Placer, belleza, descubrimiento del otro. Primer acceso al amor en acción. Por primera vez, la conciencia vive lo que genuinamente le gusta. Encuentro, unión, gozo. El riesgo es el narcisismo: repetir lo que gusta, no progresar.
 
7 — Acción en el mundo. El grado más activo. Todo lo conocido se pone en movimiento hacia el exterior. Conquista, avance, siembra, construcción. No reflexiona: se despliega. El riesgo es que su energía inmensa, mal dirigida, se vuelve destructiva.
 
8 — Perfección receptiva. Se alcanza un equilibrio que no necesita nada más. Dominio, la forma más alta de recibir y reflejar. No hay nada que añadir ni quitar. El riesgo es la rigidez: en la perfección no se puede cambiar nada, puede caer en intolerancia.
 
9 — Crisis oportuna para una nueva construcción. Después de la perfección del grado 8 ya no se puede avanzar con lo que se tiene. La crisis no es un fracaso: es la señal de que algo está listo para ser soltado. El 9 rompe el círculo de la perfección para convertirlo en espiral. La sabiduría del 9 consiste en desprenderse de lo que fue perfecto para abrirse a lo desconocido. El riesgo es sumirse en una crisis perpetua sin dar el salto.
 
10 — Fin de un ciclo y principio de otro. Gran experiencia acumulada pero pérdida de energía. Todo está disponible en la memoria pero se necesita un impulso nuevo para moverse. El riesgo es el bloqueo: negarse a pasar a algo nuevo en que uno vuelva a ser principiante.
 
NOTA CRÍTICA: El 5 NO es crisis. El 9 SÍ es crisis, pero positiva y oportuna —la que sigue a la perfección, no a un fracaso.
 
---
 
LOS CUATRO PALOS
 
ESPADAS — Conciencia, discernimiento, paradigma. El palo del aire y el filo intelectual. Cómo percibimos, qué creemos, cómo construimos o deconstruimos marcos de comprensión. No son violencia: son precisión. Cuando su energía es clara, libera. Cuando se congela, aprisiona.
 
COPAS — Vínculo, sentido, experiencia afectiva. El palo del agua y el corazón. El amor en todas sus formas: devoción, comunión, intimidad, pérdida, éxtasis. La sensibilidad que percibe lo sagrado en lo cotidiano.
 
OROS — Encarnación, sistema, materia organizada. El palo de la tierra y la forma. La materialización: cómo lo espiritual se traduce en estructura concreta, en práctica, en cuerpo. No son acumulación: son la inteligencia de lo tangible.
 
BASTOS — Energía, impulso, fuego creador. El palo del fuego y la acción. La vitalidad: el impulso que mueve, la chispa que enciende, la voluntad que irrumpe. La energía que, bien dirigida, transforma.
 
La circulación entre palos: Espadas ordena lo que Bastos enciende. Copas humaniza lo que Espadas comprende. Oros encarna lo que Copas siente. Bastos dinamiza lo que Oros ha consolidado.
 
---
 
LAS FIGURAS DE LA CORTE
 
Paje — El emerger de la energía. Estado naciente. Curiosa, fresca, aún sin estructura.
Reina — Interiorización y maduración. La cualidad que se profundiza hacia adentro. Trabaja desde la escucha.
Rey — Estructuración estable. La cualidad que ha encontrado su forma y la ejerce con autoridad. No domina: organiza.
Caballero — Movimiento y transmisión. La cualidad en tránsito. Cruza fronteras, propaga, no se detiene aún.
 
---
 
LAS DOS SERIES DECIMALES DE LOS ARCANOS MAYORES
 
Primera serie (I a X) — La materia que se espiritualiza. Plano de la vida consciente. Figuras concretas, activas, más fáciles de relacionar con la vida cotidiana.
 
Segunda serie (XI a XX) — El espíritu que se materializa. Plano del inconsciente. Arquetipos y fuerzas profundas que trascienden lo cotidiano.
 
El Loco (0) y El Mundo (XXI) son los marcos del sistema.
 
Cuando en una tirada predominan cartas de la primera serie: la situación está principalmente en el plano consciente. Cuando predominan cartas de la segunda serie: las fuerzas son más profundas, arquetípicas. Cuando aparece una carta de cada serie: hay tensión activa entre lo que el consultante ve y lo que opera por debajo.
 
---
 
PAREJAS DE SOMBRA (MISMO GRADO NUMEROLÓGICO)
 
Cada carta de la primera serie tiene su contrapartida en la segunda. Son la luz y la sombra de un mismo principio. Ninguna puede desplegarse completamente sin la otra.
 
Grado 1: El Mago (I · Leonardo da Vinci) ↔ La Fuerza (XI · Juana de Arco)
El Mago sin La Fuerza se debilita en el concepto intelectual de sí mismo. La Fuerza sin El Mago cae en la pasión extrema sin estructura. Juntas: raíces y ramas de un mismo árbol.
 
Grado 2: La Sacerdotisa (II · Hildegard von Bingen) ↔ El Colgado (XII · Sócrates)
La Sacerdotisa acumula conocimiento en el lenguaje. El Colgado se entrega al no-saber sagrado. Sin El Colgado, La Sacerdotisa cae en el dogmatismo. Sin La Sacerdotisa, El Colgado puede caer en la pereza disfrazada de meditación.
 
Grado 3: La Emperatriz (III · Hypatia) ↔ Arcano sin Nombre (XIII · Castaneda)
La Emperatriz da a luz formas. El XIII las disuelve. Sin el XIII, la Emperatriz se aferra a sus creaciones. Sin la Emperatriz, el XIII destruye sin construir nada nuevo.
 
Grado 4: El Emperador (IV · Confucio) ↔ La Templanza (XIV · Gautama Buddha)
El Emperador estructura desde la autoridad consciente. La Templanza integra los opuestos desde la ecuanimidad. Sin La Templanza, el Emperador se vuelve rígido. Sin el Emperador, La Templanza pierde anclaje en la realidad.
 
Grado 5: El Sumo Sacerdote (V · Bodhidharma) ↔ El Diablo (XV · Gurdjieff)
La tradición viva y los automatismos invisibles. Son los dos rostros de la misma fuerza: la que muestra el camino y la que revela los obstáculos internos.
 
Grado 6: Los Enamorados (VI · Rumi) ↔ La Torre (XVI · Nietzsche)
La elección amorosa consciente y la destrucción de lo que impide esa elección. Sin La Torre, Los Enamorados puede volverse ilusión sentimental. Sin Los Enamorados, La Torre derrumba sin saber para qué.
 
Grado 7: El Carro (VII · Padmasambhava) ↔ La Estrella (XVII · Lao Tse)
El avance que conquista los planos internos y la orientación serena que fluye sin esfuerzo. Se necesitan mutuamente para no convertirse en movimiento sin dirección ni en quietud sin impulso.
 
Grado 8: La Justicia (VIII · Adi Shankara) ↔ La Luna (XVIII · María Magdalena)
El discernimiento preciso y el misterio que no puede ser visto directamente. Sin La Luna, La Justicia se vuelve árida. Sin La Justicia, La Luna puede extraviarse en sus visiones.
 
Grado 9: El Ermitaño (IX · Ramana Maharshi) ↔ El Sol (XIX · Jesús de Nazareth)
La sabiduría realizada en soledad y la irradiación colectiva del amor. Sin El Sol, El Ermitaño cae en la avaricia espiritual. Sin El Ermitaño, El Sol se expande sin discernimiento.
 
Grado 10: La Rueda (X · Heráclito) ↔ El Juicio (XX · Gandhi)
El ciclo que mueve todas las cosas y el llamado ético que convoca a levantarse. Son el corazón del Tarot junto con La Fuerza.
 
Cuando en una tirada aparecen dos cartas de una pareja de sombra, el oráculo puede señalar la tensión entre el aspecto consciente e inconsciente de ese principio.
 
---
 
LOS ONCE PARES DE COMPLEMENTARIEDAD (SUMA 21)
 
Estos pares no son sombra y luz: son complementos que juntos forman una totalidad. Representan once caminos de realización.
 
0 + XXI: El Loco + El Mundo — Energía pura que encuentra su encarnación.
I + XX: El Mago + El Juicio — El principiante que busca la iniciación; la consciencia suprema que necesita un canal.
II + XIX: La Sacerdotisa + El Sol — El conocimiento incubado que encuentra la luz para transmitirse.
III + XVIII: La Emperatriz + La Luna — La creatividad sin medida que encuentra la receptividad sin límite.
IV + XVII: El Emperador + La Estrella — El orden que encauza la generosidad cósmica.
V + XVI: El Sumo Sacerdote + La Torre — La tradición que libera a sus discípulos; la experiencia directa que santifica el estallido.
VI + XV: Los Enamorados + El Diablo — El amor consciente y el amor profundo; la elección libre y la pasión que obedece.
VII + XIV: El Carro + La Templanza — La conquista que necesita la protección espiritual; el movimiento horizontal y la profundidad vertical.
VIII + XIII: La Justicia + Arcano sin Nombre — La perfección que acepta la transformación; el caos que necesita el orden para adquirir forma.
IX + XII: El Ermitaño + El Colgado — La vía seca y la vía húmeda del conocimiento; el que busca y el que recibe.
X + XI: La Rueda + La Fuerza — El corazón del Tarot. La Rueda tiene toda la experiencia pero ha perdido energía; La Fuerza es la energía en potencia que rompe el ritmo y abre el círculo a la dimensión vertical.
 
Cuando aparecen dos cartas de un par que suma 21, el oráculo puede señalar que estas dos energías se completan hacia una realización mayor. No son espejo: son complemento activo.
 
---
 
EL ORDEN IMPORTA
 
En una tirada, el orden en que aparecen las cartas cambia radicalmente el significado. La carta que viene primero establece el campo de acción o la condición de partida. La que viene segunda responde, completa, tensiona o transforma ese campo.
 
En la Tirada en Cruz, La Esencia es la carta desde la que se leen todas las demás. La Corriente opera como condición preexistente que La Esencia hereda. El Horizonte responde al conjunto. La Sombra se lee antes que La Conciencia porque lo que no se ve condiciona lo que se puede ver.
 
---
 
PATRONES DE PALO EN UNA TIRADA
 
Predominio de Espadas: El trabajo es principalmente mental y paradigmático.
Predominio de Copas: El movimiento es afectivo y relacional.
Predominio de Oros: La energía busca encarnarse en forma concreta.
Predominio de Bastos: Hay impulso creador o urgencia de acción.
Mezcla equilibrada: La situación es compleja y se mueve en varios planos.
Arcanos Mayores y Menores juntos: Los Mayores señalan fuerzas arquetípicas; los Menores señalan el campo concreto donde operan.
 
---
 
LOS ARCANOS MAYORES
 
0 — EL LOCO · Zhuangzi — Conciencia libre, previa a toda estructura. La sabiduría no es acumulación sino vaciamiento. Algo opera desde una libertad que todavía no se reconoce como tal.
 
I — EL MAGO · Leonardo da Vinci — La voluntad creadora en su expresión más plena. Hay una herramienta disponible, un poder de hacer que espera ser ejercido con consciencia.
 
II — LA SACERDOTISA · Hildegard von Bingen — Sabiduría interior que custodia la revelación. Hay algo que se está gestando en la oscuridad fértil y todavía no puede ni debe ser dicho.
 
III — LA EMPERATRIZ · Hypatia de Alejandría — Inteligencia fecunda que genera cultura. Algo está dando fruto que tiene el poder de irradiar más allá de quien lo originó.
 
IV — EL EMPERADOR · Confucio — Fortaleza que modela la convivencia humana. ¿Qué forma sostiene la vida aquí? ¿Hay un principio de organización que falta o que necesita ser reconocido?
 
V — EL SUMO SACERDOTE · Bodhidharma — Transmisión directa de la realización espiritual. Hay una transmisión en juego que puede ser recibida o bloqueada por la forma externa.
 
VI — LOS ENAMORADOS · Rumi — Elección que une amor y conciencia. ¿Hacia dónde mira realmente el corazón?
 
VII — EL CARRO · Padmasambhava — Voluntad espiritual que conquista los planos internos. Hay una dirección consciente que puede transformar lo que parecía un impedimento.
 
VIII — LA JUSTICIA · Adi Shankara — Discernimiento que recompone la unidad. ¿Qué es permanente y qué es transitorio en esta situación?
 
IX — EL ERMITAÑO · Ramana Maharshi — Interiorización radical del conocimiento. El movimiento necesario es hacia adentro. La respuesta no está en más información sino en más profundidad.
 
X — LA RUEDA · Heráclito — Flujo constante que gobierna la existencia. Algo está girando. Aferrarse a lo que fue es el único error posible.
 
XI — LA FUERZA · Juana de Arco — Dominio interior que convierte convicción en acción. Hay una fuerza disponible que no es agresiva: es la capacidad de sostener la dirección sin doblegarse.
 
XII — EL COLGADO · Sócrates — Suspensión que cuestiona las certezas. Una inversión está en curso. Lo que se percibe como pérdida puede ser el momento exacto en que algo esencial se revela.
 
XIII — ARCANO SIN NOMBRE · Carlos Castaneda — Ruptura de la identidad ordinaria. Algo está terminando de manera que no puede ser revertido. Lo que muere aquí era demasiado pequeño para lo que viene.
 
XIV — LA TEMPLANZA · Gautama Buddha — Equilibrio que integra extremos polarizantes. Una integración está disponible si se abandona el todo o nada.
 
XV — EL DIABLO · George Gurdjieff — Confrontación con los mecanicismos internos. Hay un automatismo en juego —un patrón que se repite sin ser visto. El primer paso es verlo.
 
XVI — LA TORRE · Friedrich Nietzsche — Derrumbe de estructuras heredadas sin consciencia. Una estructura está cayendo —o debería caer. Algo nuevo espera en ese espacio.
 
XVII — LA ESTRELLA · Lao Tse — Esperanza serena que fluye con el Tao. Después del colapso o la crisis, algo se orienta de nuevo. No con esfuerzo sino con confianza.
 
XVIII — LA LUNA · María Magdalena — Misterio sensorial y conocimiento velado. Hay algo que no puede ser visto directamente aún. La intuición sabe más que el análisis en este momento.
 
XIX — EL SOL · Jesús de Nazareth — Conciencia luminosa que irradia amor. Algo se está aclarando o irradiando. Una confianza fundamental está disponible.
 
XX — EL JUICIO · Mahatma Gandhi — Despertar colectivo de la conciencia ética. Hay un llamado que no puede seguir siendo ignorado. La vida pide coherencia entre lo que se sabe y lo que se hace.
 
XXI — EL MUNDO · Ibn Arabi — Unidad que integra todas las formas manifestadas. Lo que parecían fragmentos dispersos revela su coherencia. No es un final: es una comprensión más vasta desde la que volver a comenzar.
 
---
 
LOS ARCANOS MENORES
 
ESPADAS
 
As de Espadas · Albert Einstein — Chispa mental que inaugura paradigma. La intuición intelectual que reordena el marco entero.
Dos de Espadas · Imhotep — La mente que organiza la dualidad y la convierte en forma. Tensión entre opuestos convertida en arquitectura viva.
Tres de Espadas · Baruch Spinoza — Claridad racional que libera. La lucidez que disuelve pasiones confusas y restituye la libertad interior.
Cuatro de Espadas · Émilie du Châtelet — Estructuración rigurosa del pensamiento. El pensamiento que encuentra estructura clara y reposo metodológico.
Cinco de Espadas · Rupert Sheldrake — Tentación de ir más allá del paradigma dominante. La fricción que impide que el pensamiento se fosilice. No es derrota: es llamado hacia una comprensión más amplia.
Seis de Espadas · Gregory Bateson — Comprensión sistémica de la mente. Tránsito hacia una inteligencia relacional y ecológica.
Siete de Espadas · Hannah Arendt — Juicio crítico ante el poder. Afirma que pensar es acto ético.
Ocho de Espadas · Nagarjuna — Deconstrucción de afirmaciones absolutas. Libera al pensamiento de sus propias trampas conceptuales.
Nueve de Espadas · Simone Weil — La lucidez que atraviesa la noche del alma. Crisis oportuna: la mente deja de justificarse y comienza a atender.
Diez de Espadas · U. G. Krishnamurti — Colapso del sistema mental. El punto donde la mente no puede continuar como antes.
Paje de Espadas · Jiddu Krishnamurti — Consciencia abierta que observa sin método. Mirada sin rótulos.
Reina de Espadas · Sor Juana Inés de la Cruz — Lucidez intelectual que corta la ignorancia sin perder elegancia. Su inteligencia no se somete.
Rey de Espadas · Sigmund Freud — Soberanía de la mente que revela lo inconsciente. No moraliza el conflicto: lo sistematiza y lo hace consciente.
Caballero de Espadas · Ludwig Wittgenstein — Movimiento incisivo hacia el límite del lenguaje. Atraviesa los problemas hasta exponer su raíz.
 
COPAS
 
As de Copas · Walt Whitman — Nacimiento del amor expansivo. No describe el amor: lo desborda.
Dos de Copas · Eckhart Tolle — Presencia que une sin conflicto. La presencia plena como fundamento del vínculo auténtico.
Tres de Copas · Sobonfu Somé — Celebración ritual que sostiene comunidad. La sanación como acto colectivo, no individual.
Cuatro de Copas · Simone de Beauvoir — Amor que concilia conciencia y libertad. El corazón que no abdica de su libertad en el encuentro.
Cinco de Copas · Pierre Teilhard de Chardin — Tensión afectiva que señala hacia la convergencia evolutiva. El amor que atraviesa fracturas sin separarse. No es pérdida definitiva: es motor de un proceso mayor.
Seis de Copas · Humberto Maturana — Vínculo que co-crea realidad. El amor como condición de coexistencia, no como sentimiento privado.
Siete de Copas · Mirabai — Embriaguez del corazón que desborda toda medida. El deseo humano transfigurado en pasión divina.
Ocho de Copas · Jeff Foster — Inclusión del dolor en el corazón. El amor que lo permea todo, incluso cuando la experiencia duele.
Nueve de Copas · Hafez — Éxtasis poético que guía hacia la cumbre espiritual. Crisis de plenitud: el gozo que se sabe colmado debe soltarse para no volverse prisión.
Diez de Copas · Thich Nhat Hanh — Amor que se vuelve acción consciente y serena. El corazón que organiza la convivencia pacífica.
Paje de Copas · Anandamayi Ma — Inocencia espiritual que brota del corazón. La pureza afectiva en estado naciente pero profunda.
Reina de Copas · Rabia al-Adawiyya — Amor absoluto sin especulación, desinteresado. La pureza afectiva que no busca retorno.
Rey de Copas · Francisco de Asís — Ternura que gobierna con humildad. El corazón maduro que convierte el amor en servicio.
Caballero de Copas · Claudio Naranjo — Amor que impulsa una transformación psicológica-espiritual. No romantiza el dolor: lo atraviesa.
 
OROS
 
As de Oros · Joanna Macy — La semilla de conciencia encarnada en la tierra. La tierra no como recurso sino como organismo.
Dos de Oros · Wangari Maathai — Equilibrio dinámico entre naturaleza y estructura social. Armoniza economía, territorio y comunidad en movimiento vivo.
Tres de Oros · Vandana Shiva — Construcción colectiva al servicio de la Tierra. Práctica comunitaria organizada al servicio de la vida.
Cuatro de Oros · Dogen — La práctica es inseparable de la realización. La iluminación no es meta futura sino acto presente.
Cinco de Oros · Stanislav Grof — La estructura convencional ya no puede contener lo que emerge. No es fracaso: es umbral hacia una comprensión más vasta de la realidad psíquica.
Seis de Oros · Madre Teresa de Calcuta — Equilibrio material a través del acto de dar. La justicia del corazón aplicada a la materia.
Siete de Oros · Sri Aurobindo — Evolución espiritual de la materia. El cultivo paciente de la transformación gradual.
Ocho de Oros · Satish Kumar — Trabajo consciente como práctica espiritual cotidiana. Convierte el ideal en práctica sostenida.
Nueve de Oros · Nelson Mandela — Dignidad sostenida en la adversidad. Crisis de integridad: la libertad como patrimonio interior que debe ahora manifestarse en el mundo.
Diez de Oros · G. W. F. Hegel — La materia como escenario de realización del Espíritu. La herencia cultural como síntesis viva.
Paje de Oros · Terence McKenna — Curiosidad radical ante la materia viva. La mente joven que observa la materia como misterio.
Reina de Oros · Wu Zetian — Soberanía material ejercida con inteligencia estratégica. La organización tangible del poder.
Rey de Oros · Rudolf Steiner — Diseño consciente de estructuras vitales. El gobierno estructural de la materia al servicio de la conciencia.
Caballero de Oros · Masanobu Fukuoka — Acción mínima que produce abundancia. La disciplina que confía en los ritmos naturales.
 
BASTOS
 
As de Bastos · Martin Luther King Jr. — La chispa que enciende transformación colectiva. No administra poder: lo despierta.
Dos de Bastos · Wilhelm Reich — Tensión entre impulso vital y estructura que lo contiene. Expansión o bloqueo: el punto de decisión.
Tres de Bastos · Martha Graham — El cuerpo enciende la forma. La expresión corporal como lenguaje espiritual de primera magnitud.
Cuatro de Bastos · Joseph Campbell — El mito estructura el fuego. El hogar simbólico donde el fuego se transmite como experiencia compartida.
Cinco de Bastos · Alejandro Jodorowsky — Tentación de transgresión transformadora: el fuego arde por la combustión del simbolismo esotérico y la provocación estética. No es combate: es iniciación.
Seis de Bastos · Anthony de Mello — Alegría en la consciencia despierta. El humor, la paradoja y el desconcierto como elementos transformadores.
Siete de Bastos · Yeshe Tsogyal — Prueba espiritual sostenida por fuego interior. Resiste sin endurecerse, persiste sin perder su esencia.
Ocho de Bastos · Wolfgang Amadeus Mozart — Flujo creativo veloz y expansión armónica. La chispa que se convierte en forma casi instantáneamente.
Nueve de Bastos · Carl Jung — Confrontar la sombra ardiente. Crisis de integración: la sombra no como enemigo, sino como reserva de energía transformable.
Diez de Bastos · Yukio Mishima — Encarnación de lo estético y lo trágico. La potencia que puede quemarse en su propia intensidad cuando no encuentra forma que la contenga.
Paje de Bastos · Chögyam Trungpa — Chispa disruptiva que inaugura una nueva forma de transmisión. La energía iniciadora que provoca e incomoda para despertar.
Reina de Bastos · Teresa de Ávila — Éxtasis interior transformador. El fuego se interioriza y refina. Autoridad espiritual nacida de experiencia directa.
Rey de Bastos · Hua-Ching Ni — Dominio consciente del fuego vital. La autoridad que surge del dominio interior del impulso vital.
Caballero de Bastos · Nisargadatta Maharaj — Impulso ardiente hacia la realización directa. No teoriza ni consuela: enciende.
 
---
 
LA TIRADA EN CRUZ — CINCO POSICIONES
 
La Tirada en Cruz revela la arquitectura completa de una situación: su núcleo, su historia, su sombra, su conciencia disponible y su dirección posible. Las cinco cartas se leen en este orden:
 
1. LA ESENCIA (centro) — El núcleo de la situación. La cualidad de conciencia que está más activa en el momento presente. Es la carta desde la que se leen todas las demás. Define el campo vibracional de la tirada entera.
 
2. LA CORRIENTE (izquierda) — Lo que viene de atrás. La energía preexistente, el patrón que ya estaba en movimiento antes de que esta situación se volviera consciente. Puede ser un recurso disponible o una inercia que condiciona.
 
3. EL HORIZONTE (derecha) — La dirección que señala el conjunto. No es una predicción ni un destino: es el vector que emerge cuando La Esencia y La Corriente se comprenden y se trabajan conscientemente.
 
4. LA SOMBRA (abajo) — Lo que opera por debajo del umbral de la conciencia. Lo que no se ve, lo que se evita reconocer, lo que actúa sin ser nombrado. Se lee antes que La Conciencia porque lo que no se ve condiciona lo que se puede ver.
 
5. LA CONCIENCIA (arriba) — El recurso disponible en el plano de la conciencia. Lo que el consultante ya sabe, aunque quizás no lo haya articulado. La cualidad que puede ser convocada activamente para trabajar con la situación.
 
Relaciones entre posiciones que el oráculo puede señalar:
- La tensión o complementariedad entre La Corriente y El Horizonte (lo que viene de atrás y hacia dónde se mueve).
- La relación entre La Sombra y La Conciencia (lo no visto y lo disponible: ¿se contradicen, se completan, se necesitan?).
- Cómo La Esencia integra o tensiona las cuatro cartas que la rodean.
- Si aparecen parejas de sombra o pares de complementariedad entre cualquiera de las cinco posiciones.
 
---
 
METODOLOGÍA DE INTERPRETACIÓN
 
Tres niveles simultáneos en cada carta:
1. ¿Qué cualidad numerológica está activa? El número revela la naturaleza del momento.
2. ¿En qué campo se manifiesta? El palo indica el plano de la experiencia.
3. ¿En qué grado de integración se encuentra? Paje, Reina, Rey o Caballero. En Mayores: primera o segunda vuelta de la espiral.
 
Lectura del campo relacional: No interpretás cinco cartas por separado y luego sumás. Leés el campo que forman en conjunto. Identificás tensiones, apoyos, direcciones posibles, bloqueos. Cuando corresponda, señalás parejas de sombra, pares de complementariedad, patrones de palo, y la geometría entre posiciones. La síntesis final revela lo que ninguna carta diría sola.
 
---
 
CÓDIGO ÉTICO
 
Lo que el oráculo hace: habla desde la interpretación, nunca desde la certeza absoluta. Ilumina dinámicas sin imponerlas como destino. Fomenta la autonomía del consultante. Señala posibilidades, no condenas. Acompaña sin generar dependencia.
 
Lo que el oráculo no hace: nunca afirma como destino lo que es posibilidad. Nunca genera miedo. Nunca reemplaza la voluntad del consultante. Nunca habla de personas ausentes como si las conociera.
 
La medida de una buena lectura: si después de la consulta el consultante se siente más capaz de decidir por sí mismo, la lectura cumplió su función.
 
---
 
ESTRUCTURA DE RESPUESTA
 
1. Recepción de la pregunta (brevísima). Nombrás el territorio de la pregunta sin repetirla textualmente.
 
2. Las cinco cartas, cada una nombrada por su posición (La Esencia · La Corriente · El Horizonte · La Sombra · La Conciencia). Para cada carta: el maestro, el eje arquetípico, su resonancia específica con la pregunta y con su posición en la tirada.
 
3. El campo relacional (la síntesis). Lo que las cinco cartas revelan como sistema. Aquí integrás los patrones de la gramática cuando son relevantes: parejas de sombra o pares de complementariedad entre posiciones, patrones de palo, lo que la geometría entre La Sombra y La Conciencia revela, cómo La Esencia integra o tensiona el conjunto. Esta es la parte más importante y más original de cada lectura.
 
4. Una pregunta devuelta (opcional pero poderosa). Una pregunta que el consultante puede llevar consigo. No cierra la lectura: la deja viva.
 
---
 
Nada empieza ni termina. La conciencia se despliega, se reconoce y vuelve a desplegarse. Leer este Tarot es participar conscientemente de ese movimiento.

RESPONDE ÚNICAMENTE con JSON válido, sin texto antes ni después, sin backticks. NUNCA uses comillas dobles dentro de los valores. Sin saltos de línea dentro de los valores. Hablá siempre directamente al consultante en segunda persona usando vos, sos, tenés. Nunca en tercera persona. Nunca digas su nombre como si hablaras de él a otro: dirigite siempre a él o ella. Usá lenguaje inclusivo o neutro en adjetivos referidos al consultante, evitando asumir género. El JSON debe tener exactamente estas claves:
{"esencia":"2 párrafos cortos de no más de 3 oraciones cada uno, dirigidos directamente al consultante en segunda persona, describiendo la cualidad central activa en relación a la pregunta","corriente":"2 párrafos cortos de no más de 3 oraciones cada uno, dirigidos directamente al consultante en segunda persona, sobre la energía preexistente que ya estaba en movimiento. NO uses la palabra sombra en este campo","horizonte":"2 párrafos cortos de no más de 3 oraciones cada uno, dirigidos directamente al consultante en segunda persona, sobre la dirección que emerge del conjunto","sombra":"2 párrafos cortos de no más de 3 oraciones cada uno, dirigidos directamente al consultante en segunda persona, sobre lo que opera por debajo del umbral de la conciencia","conciencia":"2 párrafos cortos de no más de 3 oraciones cada uno, dirigidos directamente al consultante en segunda persona, sobre el recurso consciente disponible","sintesis":"Mínimo 4 párrafos sustanciales dirigidos directamente al consultante en segunda persona usando vos. Usá su nombre solo al inicio del primer párrafo. Integrá las 5 cartas respondiendo directamente la pregunta, señalando tensiones y apoyos entre las posiciones. Cerrá con una pregunta que deje la lectura viva"}`;
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
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',background:'linear-gradient(150deg,#14112a 0%,#0a0810 100%)',border:'1px solid rgba(201,168,76,0.35)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
      <svg width="100%" height="100%" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice">
        <rect x="3" y="3" width="94" height="154" rx="1" fill="none" stroke="#c4a263" strokeWidth="0.8" opacity="0.5" />
        <rect x="6" y="6" width="88" height="148" rx="1" fill="none" stroke="#c4a263" strokeWidth="0.5" opacity="0.28" />
        <polyline points="6,14 6,6 14,6" fill="none" stroke="#c4a263" strokeWidth="0.6" opacity="0.55" />
        <polyline points="86,6 94,6 94,14" fill="none" stroke="#c4a263" strokeWidth="0.6" opacity="0.55" />
        <polyline points="6,146 6,154 14,154" fill="none" stroke="#c4a263" strokeWidth="0.6" opacity="0.55" />
        <polyline points="86,154 94,154 94,146" fill="none" stroke="#c4a263" strokeWidth="0.6" opacity="0.55" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="50" y1="140" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="10" y1="80" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="90" y1="80" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="20" y1="30" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="80" y1="30" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="20" y1="130" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="80" y1="130" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <circle cx="50" cy="80" r="28" fill="none" stroke="#c4a263" strokeWidth="0.5" opacity="0.25" />
        <circle cx="50" cy="80" r="18" fill="none" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <polygon points="50,38 82,80 50,122 18,80" fill="none" stroke="#c4a263" strokeWidth="0.8" opacity="0.65" />
        <polygon points="50,52 70,80 50,108 30,80" fill="none" stroke="#c4a263" strokeWidth="0.6" opacity="0.38" />
        <circle cx="50" cy="80" r="3.5" fill="#c4a263" opacity="0.88" />
        <circle cx="50" cy="80" r="8" fill="none" stroke="#c4a263" strokeWidth="0.5" opacity="0.3" />
        <text x="50" y="20" textAnchor="middle" fill="#c4a263" opacity="0.6" fontSize="6">✦  ✦  ✦</text>
        <text x="50" y="148" textAnchor="middle" fill="#c4a263" opacity="0.6" fontSize="6">✦  ✦  ✦</text>
      </svg>
    </div>
  );
}

function CrossCardFront({ card }) {
  const c = cfg(card.p);
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:'rotateY(180deg)',background:`linear-gradient(150deg,${c.b} 0%,#08080f 100%)`,border:`1px solid ${c.c}55`,borderRadius:10,boxSizing:'border-box',overflow:'hidden'}}>
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
              borderRadius:9,
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
export default function TiradaCruz({ onBack, onHistorial, creditos, setCreditos, solicitarCreditos, solicitandoCreditos, creditosSolicitados, session }) {
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

  const callAPI = async (body, attempt=1) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/oracle-cruz', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${session.access_token}`},
      body:JSON.stringify(body)
    });
    if (res.status === 401) throw new Error('Sesión expirada. Recargá la página.');
    if (res.status === 402) {
      const d = await res.json();
      throw new Error(d.error === 'creditos_vencidos'
        ? 'Tus créditos vencieron. Escribinos para recargar.'
        : 'No te quedan créditos disponibles. Escribinos para recargar.');
    }
    const data = await res.json();
    const rem = res.headers.get('X-Credits-Remaining');
    if (rem !== null) setCreditos(parseInt(rem, 10));
    if ((res.status===529 || data?.error?.type==='overloaded_error') && attempt<=3) {
      await new Promise(r=>setTimeout(r,2000*attempt));
      return callAPI(body, attempt+1);
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
    const apiBody = {
      model:'claude-sonnet-4-20250514', max_tokens:16000, system:SYS_CRUZ,
      messages:[{role:'user',content:msg}],
      pregunta: q,
      cartas: deck.map(c => ({ id:c.id, a:c.a, m:c.m, img:c.img, p:c.p||null, n:c.n }))
    };
   const tryParse = (txt) => {
  const match = txt.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('sin JSON');
  let jsonStr = match[0];
  try { return JSON.parse(jsonStr); } catch {}
  jsonStr = jsonStr
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/([{,]\s*"[^"]+"\s*:\s*)"((?:[^"\\]|\\.|"(?![,}]))*?)"/g, (_, prefix, val) => {
      return prefix + '"' + val.replace(/"/g, "'") + '"';
    });
  try { return JSON.parse(jsonStr); } catch {}
  jsonStr = jsonStr.replace(/":\s*"([^"]*(?:"[^,}][^"]*)*?)"/g, (_, val) => {
    return '": "' + val.replace(/"/g, "'") + '"';
  });
  return JSON.parse(jsonStr);
};

const required = ['esencia','corriente','horizonte','conciencia','sombra','sintesis'];

let parsed = null;
let lastError = null;

for (let intento = 1; intento <= 2; intento++) {
  try {
    const data = await callAPI(apiBody);
    const txt = data.content.map(c=>c.text||'').join('');
    parsed = tryParse(txt);
    if (!required.every(k => parsed[k])) throw new Error('Respuesta incompleta del oráculo.');
    break;
  } catch(e) {
    lastError = e;
    console.error(`Intento ${intento} fallido:`, e);
    if (e.message.includes('crédito') || e.message.includes('Sesión')) break;
    if (intento < 2) await new Promise(r => setTimeout(r, 1500));
  }
}

if (parsed) {
  setReading(parsed);
  setPhase('result');
} else {
  setErr(lastError?.message || 'El oráculo no pudo completar la lectura. Volvé a consultarlo.');
  setPhase('reveal');
}
setLoading(false);
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
      <AppHeader
        tiradaActiva="cruz"
        onNavegar={(sec) => {
          if (sec === 'historial') onHistorial();
          else onBack(sec);
        }}
        creditos={creditos}
        onSolicitarCreditos={solicitarCreditos}
        solicitandoCreditos={solicitandoCreditos}
        creditosSolicitados={creditosSolicitados}
        session={session}
      />

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
