import { useState } from "react";

const PC = {
  Espadas: { s:'⚔', c:'#8fc4d8', b:'#0c1a22' },
  Copas:   { s:'◐', c:'#7ab0cc', b:'#0a1520' },
  Oros:    { s:'◉', c:'#c9a84c', b:'#16130a' },
  Bastos:  { s:'✦', c:'#cc7755', b:'#1a0f0a' },
};

const SYS = `Eres el intérprete del Tarot de los Maestros, arquitectura simbólica que revela cualidades de conciencia activas en el presente del consultante.

PRINCIPIOS: No predices el futuro: iluminas dinámicas presentes y posibilidades de integración. Los maestros no representan sus biografías: encarnan una cualidad arquetípica. El sentido emerge de la relación entre las tres cartas. Si el nombre del consultante está disponible, úsalo de forma natural y cálida en las interpretaciones.

NUMEROLOGÍA: 1=Unidad emergente, primer impulso. 2=Polaridad, relación entre principios. 3=Síntesis creativa, expresión. 4=Estructura, estabilización. 5=Crisis necesaria, fricción, apertura. 6=Reequilibrio, flujo restaurado. 7=Profundización, prueba interior. 8=Integración dinámica, dominio consciente. 9=Culminación, plenitud antes del cierre. 10=Saturación y umbral, anuncia nuevo ciclo.

PALOS: Espadas=mente/paradigma/discernimiento. Copas=emoción/vínculo/amor. Oros=materia/práctica/encarnación. Bastos=energía/acción/fuego creador.

CORTE: Paje=energía naciente. Reina=interiorización y maduración. Rey=estructura madura, autoridad. Caballero=movimiento, transmisión.

ARCANOS MAYORES: etapas de la espiral de conciencia.

ESTILO: contemplativo, cálido, preciso. No predices: describes. Empodera la autonomía. Responde en español.

RESPONDE ÚNICAMENTE con JSON válido, sin texto antes ni después, sin backticks:
{"carta1":"interpretación carta 1 en 2 párrafos cortos","carta2":"interpretación carta 2 en 2 párrafos cortos","carta3":"interpretación carta 3 en 2 párrafos cortos","sintesis":"3 párrafos que integran las 3 cartas respondiendo la pregunta"}`;

const CARDS = [
  {id:1,a:'El Loco',n:'0',m:'Zhuangzi',p:null,eje:'Conciencia libre, previa a toda estructura',i:'Camina sin apegarse a ninguna idea. La sabiduría como vaciamiento.'},
  {id:2,a:'El Mago',n:'I',m:'Leonardo da Vinci',p:null,eje:'Conciencia que se desliza entre la idea y la forma',i:'Integra arte y ciencia. La voluntad creadora que materializa lo invisible.'},
  {id:3,a:'La Sacerdotisa',n:'II',m:'Hildegard von Bingen',p:null,eje:'Sabiduría interior que custodia la revelación',i:'Escucha antes de hablar. Saber nacido de revelación interior.'},
  {id:4,a:'La Emperatriz',n:'III',m:'Hypatia',p:null,eje:'Inteligencia fecunda que genera cultura',i:'Da a luz ideas que estructuran el mundo. Irradiación intelectual.'},
  {id:5,a:'El Emperador',n:'IV',m:'Confucio',p:null,eje:'Fortaleza que modela la convivencia humana',i:'La autoridad no domina: organiza. Funda estabilidad sin violencia.'},
  {id:6,a:'El Sumo Sacerdote',n:'V',m:'Bodhidharma',p:null,eje:'Transmisión directa de la realización espiritual',i:'Tradición viva, no institución muerta.'},
  {id:7,a:'Los Enamorados',n:'VI',m:'Rumi',p:null,eje:'Elección que une amor y conciencia',i:'Amar es elegir disolverse en lo esencial.'},
  {id:8,a:'El Carro',n:'VII',m:'Padmasambhava',p:null,eje:'Voluntad espiritual que conquista los planos internos',i:'No evade las energías oscuras: las transforma.'},
  {id:9,a:'La Justicia',n:'VIII',m:'Adi Shankara',p:null,eje:'Discernimiento que recompone la unidad',i:'Señala lo permanente de lo transitorio.'},
  {id:10,a:'El Ermitaño',n:'IX',m:'Ramana Maharshi',p:null,eje:'Interiorización radical del conocimiento',i:'Retorno al núcleo del verdadero ser.'},
  {id:11,a:'La Rueda',n:'X',m:'Heráclito',p:null,eje:'Flujo constante que gobierna la existencia',i:'El cambio como ley universal.'},
  {id:12,a:'La Fuerza',n:'XI',m:'Juana de Arco',p:null,eje:'Dominio interior que convierte convicción en acción',i:'Firmeza interior que organiza la energía hacia lo esencial.'},
  {id:13,a:'El Colgado',n:'XII',m:'Sócrates',p:null,eje:'Suspensión que cuestiona las certezas',i:'No saber es el umbral del verdadero conocimiento.'},
  {id:14,a:'Arcano sin Nombre',n:'XIII',m:'Carlos Castaneda',p:null,eje:'Ruptura de la identidad ordinaria',i:'La conciencia ordinaria se fractura para dar paso a algo más vasto.'},
  {id:15,a:'La Templanza',n:'XIV',m:'Gautama Buddha',p:null,eje:'Equilibrio que integra extremos polarizantes',i:'Armoniza deseo y renuncia. Mezcla compasión y lucidez.'},
  {id:16,a:'El Diablo',n:'XV',m:'George Gurdjieff',p:null,eje:'Confrontación con los mecanicismos internos',i:'Expone las fuerzas que esclavizan. Confronta la ilusión de libertad.'},
  {id:17,a:'La Torre',n:'XVI',m:'Friedrich Nietzsche',p:null,eje:'Derrumbe de estructuras heredadas sin consciencia',i:'El colapso que libera espacio para una nueva afirmación de la vida.'},
  {id:18,a:'La Estrella',n:'XVII',m:'Lao Tse',p:null,eje:'Esperanza serena que fluye con el Tao',i:'Orienta sin imponerse. La confianza en el flujo natural.'},
  {id:19,a:'La Luna',n:'XVIII',m:'María Magdalena',p:null,eje:'Misterio sensorial y conocimiento velado',i:'Transita la noche sin perder vínculo con lo sagrado.'},
  {id:20,a:'El Sol',n:'XIX',m:'Jesús de Nazareth',p:null,eje:'Conciencia luminosa que irradia amor',i:'Ilumina sin exclusión. Expande vida y devuelve dignidad.'},
  {id:21,a:'El Juicio',n:'XX',m:'Mahatma Gandhi',p:null,eje:'Despertar colectivo de la conciencia ética',i:'Una conciencia que ya no puede dormir ante la inequidad.'},
  {id:22,a:'El Mundo',n:'XXI',m:'Ibn Arabi',p:null,eje:'Unidad que integra todas las formas manifestadas',i:'Contempla la multiplicidad como expresión de una única realidad.'},
  {id:23,a:'As de Espadas',n:'As',m:'Albert Einstein',p:'Espadas',eje:'Chispa mental que inaugura paradigma',i:'Corte inaugural en la percepción. Intuición que atraviesa la apariencia.'},
  {id:24,a:'Dos de Espadas',n:'2',m:'Imhotep',p:'Espadas',eje:'La mente organiza la dualidad y la convierte en forma',i:'La tensión entre opuestos convertida en arquitectura viva.'},
  {id:25,a:'Tres de Espadas',n:'3',m:'Baruch Spinoza',p:'Espadas',eje:'Claridad racional que libera',i:'La lucidez que disuelve pasiones confusas.'},
  {id:26,a:'Cuatro de Espadas',n:'4',m:'Émilie du Châtelet',p:'Espadas',eje:'Estructuración rigurosa del pensamiento',i:'La mente que organiza y estabiliza conocimiento.'},
  {id:27,a:'Cinco de Espadas',n:'5',m:'Rupert Sheldrake',p:'Espadas',eje:'Conflicto que desafía ortodoxia',i:'La tensión necesaria para que el pensamiento no se fosilice.'},
  {id:28,a:'Seis de Espadas',n:'6',m:'Gregory Bateson',p:'Espadas',eje:'Comprensión sistémica de la mente',i:'Tránsito hacia una inteligencia relacional y ecológica.'},
  {id:29,a:'Siete de Espadas',n:'7',m:'Hannah Arendt',p:'Espadas',eje:'Juicio crítico ante el poder',i:'Pensar es acto ético.'},
  {id:30,a:'Ocho de Espadas',n:'8',m:'Nagarjuna',p:'Espadas',eje:'Deconstrucción de afirmaciones absolutas',i:'La inteligencia que disuelve fijaciones sin reemplazarlas.'},
  {id:31,a:'Nueve de Espadas',n:'9',m:'Simone Weil',p:'Espadas',eje:'La lucidez que atraviesa la noche del alma',i:'La mente que deja de justificarse y comienza a atender.'},
  {id:32,a:'Diez de Espadas',n:'10',m:'U.G. Krishnamurti',p:'Espadas',eje:'Colapso del sistema mental',i:'El punto donde la mente no puede continuar como antes.'},
  {id:33,a:'Paje de Espadas',n:'Paje',m:'Jiddu Krishnamurti',p:'Espadas',eje:'Consciencia abierta que observa sin método',i:'Mirada sin rótulos. No acumula doctrina: observa.'},
  {id:34,a:'Reina de Espadas',n:'Reina',m:'Sor Juana Inés de la Cruz',p:'Espadas',eje:'Lucidez intelectual que corta sin perder elegancia',i:'Pensamiento claro y agudo, atravesado por sensibilidad simbólica.'},
  {id:35,a:'Rey de Espadas',n:'Rey',m:'Sigmund Freud',p:'Espadas',eje:'Soberanía de la mente que revela lo inconsciente',i:'Autoridad en el territorio de la mente.'},
  {id:36,a:'Caballero de Espadas',n:'Caballero',m:'Ludwig Wittgenstein',p:'Espadas',eje:'Movimiento incisivo hacia el límite del lenguaje',i:'Atraviesa los problemas hasta exponer su raíz.'},
  {id:37,a:'As de Copas',n:'As',m:'Walt Whitman',p:'Copas',eje:'Nacimiento del amor expansivo',i:'La fuente afectiva que reconoce al otro como extensión de sí mismo.'},
  {id:38,a:'Dos de Copas',n:'2',m:'Eckhart Tolle',p:'Copas',eje:'Presencia que une sin conflicto',i:'Presencia plena como fundamento del vínculo auténtico.'},
  {id:39,a:'Tres de Copas',n:'3',m:'Sobonfu Somé',p:'Copas',eje:'Celebración ritual que sostiene comunidad',i:'El corazón que, al celebrar, sana.'},
  {id:40,a:'Cuatro de Copas',n:'4',m:'Simone de Beauvoir',p:'Copas',eje:'Amor que concilia conciencia y libertad',i:'El corazón que no abdica de su libertad en el encuentro.'},
  {id:41,a:'Cinco de Copas',n:'5',m:'Pierre Teilhard de Chardin',p:'Copas',eje:'Evolución como proceso espiritual y cósmico',i:'El amor que atraviesa fracturas sin separarse.'},
  {id:42,a:'Seis de Copas',n:'6',m:'Humberto Maturana',p:'Copas',eje:'Vínculo que co-crea realidad',i:'La ternura como condición de coexistencia.'},
  {id:43,a:'Siete de Copas',n:'7',m:'Mirabai',p:'Copas',eje:'Embriaguez del corazón que desborda toda medida',i:'El deseo transfigurado en pasión divina.'},
  {id:44,a:'Ocho de Copas',n:'8',m:'Jeff Foster',p:'Copas',eje:'Inclusión del dolor en el corazón',i:'El amor que lo permea todo, incluso cuando duele.'},
  {id:45,a:'Nueve de Copas',n:'9',m:'Hafez',p:'Copas',eje:'Éxtasis poético que guía hacia la cumbre espiritual',i:'El gozo que se sabe colmado.'},
  {id:46,a:'Diez de Copas',n:'10',m:'Thich Nhat Hanh',p:'Copas',eje:'Amor que se vuelve acción consciente y serena',i:'El corazón que organiza la convivencia pacífica.'},
  {id:47,a:'Paje de Copas',n:'Paje',m:'Anandamayi Ma',p:'Copas',eje:'Inocencia espiritual que brota del corazón',i:'Pureza afectiva en estado naciente. Revela sin convencer.'},
  {id:48,a:'Reina de Copas',n:'Reina',m:'Rabia al-Adawiyya',p:'Copas',eje:'Amor absoluto desinteresado',i:'La pureza afectiva que no negocia ni busca retorno.'},
  {id:49,a:'Rey de Copas',n:'Rey',m:'Francisco de Asís',p:'Copas',eje:'Ternura que gobierna con humildad',i:'El corazón maduro que convierte el amor en servicio.'},
  {id:50,a:'Caballero de Copas',n:'Caballero',m:'Claudio Naranjo',p:'Copas',eje:'Amor que impulsa transformación psicológica-espiritual',i:'El impulso del corazón que busca despertar integral.'},
  {id:51,a:'As de Oros',n:'As',m:'Joanna Macy',p:'Oros',eje:'La semilla de conciencia encarnada en la tierra',i:'Nacimiento de una ética del cuidado que emerge desde adentro.'},
  {id:52,a:'Dos de Oros',n:'2',m:'Wangari Maathai',p:'Oros',eje:'Equilibrio dinámico entre naturaleza y estructura social',i:'Armoniza ecología, economía y comunidad.'},
  {id:53,a:'Tres de Oros',n:'3',m:'Vandana Shiva',p:'Oros',eje:'Construcción colectiva al servicio de la Tierra',i:'Trabajo desde la colaboración concreta y el compromiso territorial.'},
  {id:54,a:'Cuatro de Oros',n:'4',m:'Dogen',p:'Oros',eje:'La práctica es inseparable de la realización',i:'La disciplina cotidiana como lugar del despertar.'},
  {id:55,a:'Cinco de Oros',n:'5',m:'Stanislav Grof',p:'Oros',eje:'Crisis como umbral de transformación',i:'La estructura convencional que ya no puede contener lo que emerge.'},
  {id:56,a:'Seis de Oros',n:'6',m:'Madre Teresa de Calcuta',p:'Oros',eje:'Equilibrio material a través del acto de dar',i:'La justicia del corazón aplicada a la materia.'},
  {id:57,a:'Siete de Oros',n:'7',m:'Sri Aurobindo',p:'Oros',eje:'Evolución espiritual de la materia',i:'El cultivo paciente de la espiritualidad evolutiva.'},
  {id:58,a:'Ocho de Oros',n:'8',m:'Satish Kumar',p:'Oros',eje:'Trabajo consciente como práctica espiritual cotidiana',i:'El ideal convertido en práctica sostenida.'},
  {id:59,a:'Nueve de Oros',n:'9',m:'Nelson Mandela',p:'Oros',eje:'Dignidad sostenida en la adversidad',i:'La riqueza de la integridad y la dignidad humana.'},
  {id:60,a:'Diez de Oros',n:'10',m:'G.W.F. Hegel',p:'Oros',eje:'La materia como escenario de realización del Espíritu',i:'La herencia cultural como síntesis viva.'},
  {id:61,a:'Paje de Oros',n:'Paje',m:'Terence McKenna',p:'Oros',eje:'Curiosidad radical ante la materia viva',i:'La mente joven que observa la materia como misterio.'},
  {id:62,a:'Reina de Oros',n:'Reina',m:'Wu Zetian',p:'Oros',eje:'Soberanía material ejercida con inteligencia estratégica',i:'La organización tangible del poder con autoridad y eficacia.'},
  {id:63,a:'Rey de Oros',n:'Rey',m:'Rudolf Steiner',p:'Oros',eje:'Diseño consciente de estructuras vitales',i:'Gobierno estructural al servicio de la conciencia.'},
  {id:64,a:'Caballero de Oros',n:'Caballero',m:'Masanobu Fukuoka',p:'Oros',eje:'Acción mínima que produce abundancia',i:'Confía en los ritmos naturales y revivifica sin violencia.'},
  {id:65,a:'As de Bastos',n:'As',m:'Martin Luther King Jr.',p:'Bastos',eje:'La chispa que enciende transformación colectiva',i:'Fuego moral que moviliza conciencia y acción.'},
  {id:66,a:'Dos de Bastos',n:'2',m:'Wilhelm Reich',p:'Bastos',eje:'Tensión entre impulso vital y estructura que lo contiene',i:'El fuego en punto de decisión: expansión o bloqueo.'},
  {id:67,a:'Tres de Bastos',n:'3',m:'Martha Graham',p:'Bastos',eje:'El cuerpo enciende la forma',i:'La expresión corporal como lenguaje espiritual de primera magnitud.'},
  {id:68,a:'Cuatro de Bastos',n:'4',m:'Joseph Campbell',p:'Bastos',eje:'El mito estructura el fuego',i:'El hogar simbólico donde el fuego se transmite como experiencia mítica.'},
  {id:69,a:'Cinco de Bastos',n:'5',m:'Alejandro Jodorowsky',p:'Bastos',eje:'Iniciación destinada a impactar en el inconsciente',i:'El fuego arde por la combustión del simbolismo esotérico.'},
  {id:70,a:'Seis de Bastos',n:'6',m:'Anthony de Mello',p:'Bastos',eje:'Alegría en la consciencia despierta',i:'Humor, paradoja y desconcierto como elementos transformadores.'},
  {id:71,a:'Siete de Bastos',n:'7',m:'Yeshe Tsogyal',p:'Bastos',eje:'Prueba espiritual sostenida por fuego interior',i:'El fuego que resiste sin endurecerse.'},
  {id:72,a:'Ocho de Bastos',n:'8',m:'Wolfgang Amadeus Mozart',p:'Bastos',eje:'Flujo creativo veloz y expansión armónica',i:'La chispa que se convierte en forma casi instantáneamente.'},
  {id:73,a:'Nueve de Bastos',n:'9',m:'Carl Jung',p:'Bastos',eje:'Confrontar la sombra ardiente',i:'La sombra como reserva de energía transformable.'},
  {id:74,a:'Diez de Bastos',n:'10',m:'Yukio Mishima',p:'Bastos',eje:'Encarnación de lo estético y lo trágico',i:'La potencia que puede quemarse en su propia intensidad.'},
  {id:75,a:'Paje de Bastos',n:'Paje',m:'Chögyam Trungpa',p:'Bastos',eje:'Chispa disruptiva que inaugura nueva transmisión',i:'Fuego joven que irrumpe en territorios nuevos.'},
  {id:76,a:'Reina de Bastos',n:'Reina',m:'Teresa de Ávila',p:'Bastos',eje:'Éxtasis interior transformador',i:'Autoridad espiritual nacida de experiencia directa.'},
  {id:77,a:'Rey de Bastos',n:'Rey',m:'Hua-Ching Ni',p:'Bastos',eje:'Dominio consciente del fuego vital',i:'La autoridad que surge del dominio interior del impulso vital.'},
  {id:78,a:'Caballero de Bastos',n:'Caballero',m:'Nisargadatta Maharaj',p:'Bastos',eje:'Impulso ardiente hacia la realización directa',i:'No teoriza ni consuela: enciende.'},
];

const cfg = (p) => p ? PC[p] : { s:'✧', c:'#9b7fd4', b:'#100d1e' };

function CardBack({ idx }) {
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',background:'linear-gradient(150deg,#14112a 0%,#0a0810 100%)',border:'1px solid rgba(201,168,76,0.35)',borderRadius:12,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,cursor:'pointer'}}>
      <div style={{position:'absolute',inset:7,border:'1px solid rgba(201,168,76,0.12)',borderRadius:8}}/>
      <div style={{fontSize:26,color:'rgba(201,168,76,0.5)'}}>✦</div>
      <div style={{fontSize:9,letterSpacing:3,color:'rgba(201,168,76,0.35)'}}>CARTA {idx+1}</div>
      <div style={{fontSize:8,letterSpacing:2,color:'rgba(201,168,76,0.2)',fontStyle:'italic'}}>toca para revelar</div>
    </div>
  );
}

function CardFront({ card }) {
  const c = cfg(card.p);
  return (
    <div style={{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:'rotateY(180deg)',background:`linear-gradient(150deg,${c.b} 0%,#08080f 100%)`,border:`1px solid ${c.c}55`,borderRadius:12,padding:'14px 12px',boxSizing:'border-box',display:'flex',flexDirection:'column',justifyContent:'space-between',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:6,border:`1px solid ${c.c}20`,borderRadius:8,pointerEvents:'none'}}/>
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
          <span style={{fontSize:14,color:c.c}}>{c.s}</span>
          <span style={{fontSize:8,letterSpacing:1,color:`${c.c}99`}}>{card.n}</span>
        </div>
        <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}55,transparent)`,marginBottom:8}}/>
        <div style={{fontSize:13,lineHeight:1.3,color:'#e8dfc8',marginBottom:4}}>{card.a}</div>
        <div style={{fontSize:10,color:'#999',fontStyle:'italic',marginBottom:4}}>{card.m}</div>
        <div style={{fontSize:8,letterSpacing:1.5,color:`${c.c}88`}}>{card.p ? card.p.toUpperCase() : 'ARCANO MAYOR'}</div>
      </div>
      <div>
        <div style={{width:'100%',height:1,background:`linear-gradient(to right,${c.c}33,transparent)`,marginBottom:7}}/>
        <div style={{fontSize:9,lineHeight:1.45,color:'#b8a888',fontStyle:'italic'}}>{card.eje}</div>
      </div>
    </div>
  );
}

function FlipCard({ card, flipped, onFlip, idx }) {
  return (
    <div style={{width:155,height:270,perspective:1000,flexShrink:0}} onClick={() => !flipped && onFlip(idx)}>
      <div style={{position:'relative',width:'100%',height:'100%',transformStyle:'preserve-3d',transition:'transform 0.65s ease',transform:flipped?'rotateY(180deg)':'rotateY(0)'}}>
        <CardBack idx={idx}/>
        <CardFront card={card}/>
      </div>
    </div>
  );
}

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

function PrintOverlay({ deck, reading, name, q, onClose }) {
  const keys = ['carta1','carta2','carta3'];
  const dateStr = new Date().toLocaleDateString('es-AR',{year:'numeric',month:'long',day:'numeric'});
  const doPrint = () => {
    const keys = ['carta1','carta2','carta3'];
    const dateStr = new Date().toLocaleDateString('es-AR',{year:'numeric',month:'long',day:'numeric'});
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const paras = txt => txt.split(/\n+/).filter(p=>p.trim()).map(p=>`<p>${esc(p)}</p>`).join('');
    const cardsHtml = deck.map((card,i) => `
      <div class="card">
        <div class="label">CARTA ${i+1}</div>
        <div class="suit">${esc(card.p||'Arcano Mayor')}</div>
        <div class="card-name">${esc(card.a)}</div>
        <div class="master">${esc(card.m)}</div>
        <div class="eje">${esc(card.eje)}</div>
        <div class="interp">${paras(reading[keys[i]])}</div>
      </div>
      ${i<2?'<hr/>':''}`).join('');
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Tarot de los Maestros${name.trim()?' · '+esc(name.trim()):''}</title>
<style>
  @page{margin:20mm 18mm}
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Georgia,serif;color:#2a2218;font-size:11pt;line-height:1.7}
  .header{text-align:center;border-bottom:1px solid #c9a84c;padding-bottom:14px;margin-bottom:18px}
  h1{font-size:20pt;font-weight:400;letter-spacing:4px;margin-bottom:4px}
  .sub{font-size:7pt;letter-spacing:4px;color:#a08840}
  .meta{margin-bottom:18px}
  .name-line{font-size:13pt;margin-bottom:3px}
  .date{font-size:9pt;color:#8a7850}
  .qlabel{font-size:7pt;letter-spacing:4px;color:#a08840;margin-bottom:6px}
  .qtext{font-size:13pt;font-style:italic;border-left:2px solid #c9a84c;padding-left:12px;color:#3a3020;line-height:1.6;margin-bottom:22px}
  .label{font-size:7pt;letter-spacing:4px;color:#a08840;margin-bottom:3px}
  .suit{font-size:8pt;color:#8a7850;margin-bottom:2px}
  .card-name{font-size:16pt;font-weight:400;margin-bottom:2px}
  .master{font-size:10pt;font-style:italic;color:#6a5838;margin-bottom:8px}
  .eje{font-size:9pt;font-style:italic;color:#8a6828;border:1px solid #d4b870;border-radius:4px;padding:5px 10px;margin-bottom:12px;background:#fdfaf3}
  .interp p{font-size:10.5pt;color:#2e2416;margin-bottom:9px}
  hr{border:none;border-top:1px solid #e0d0a0;margin:20px 0}
  .card{margin-bottom:20px;page-break-inside:avoid}
  .sintesis{border-top:1px solid #c9a84c;padding-top:18px;margin-top:8px}
  .slabel{font-size:8pt;letter-spacing:4px;color:#a08840;text-align:center;margin-bottom:14px}
  .sintesis p{font-size:10.5pt;color:#2e2416;margin-bottom:9px}
  .footer{text-align:center;border-top:1px solid #e0d0a0;margin-top:24px;padding-top:10px;font-size:8pt;font-style:italic;color:#a09070}
</style></head><body>
<div class="header"><h1>TAROT DE LOS MAESTROS</h1><div class="sub">ARQUITECTURA SIMBÓLICA DE LA CONCIENCIA</div></div>
<div class="meta">
  ${name.trim()?`<div class="name-line">Lectura para: <strong>${esc(name.trim())}</strong></div>`:''}
  <div class="date">${dateStr}</div>
</div>
<div class="qlabel">CONSULTA</div>
<div class="qtext">"${esc(q)}"</div>
${cardsHtml}
<div class="sintesis"><div class="slabel">✦ SÍNTESIS ✦</div>${paras(reading.sintesis)}</div>
<div class="footer">Tarot de los Maestros · 78 arquetipos encarnados en la historia de la conciencia humana</div>
</body></html>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name.trim() ? `tarot-${name.trim().toLowerCase().replace(/\s+/g,'-')}.html` : 'tarot-lectura.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{position:'fixed',inset:0,background:'#fff',zIndex:9999,overflowY:'auto',fontFamily:'Georgia,serif',color:'#2a2218'}}>
      <style>{`
        @media print {
          .no-print { display:none !important; }
          body { margin:0; }
        }
      `}</style>
      <div className="no-print" style={{position:'sticky',top:0,background:'#f5f0e8',borderBottom:'1px solid #c9a84c',padding:'10px 24px',display:'flex',gap:12,alignItems:'center',zIndex:10}}>
        <button onClick={doPrint} style={{padding:'8px 22px',background:'#c9a84c',border:'none',borderRadius:4,color:'#fff',fontSize:12,cursor:'pointer',fontFamily:'Georgia,serif',letterSpacing:1}}>
          Descargar HTML
        </button>
        <span style={{fontSize:11,color:'#8a7850',fontStyle:'italic'}}>Abrí el archivo descargado → Ctrl+P / Cmd+P → "Guardar como PDF"</span>
        <button onClick={onClose} style={{marginLeft:'auto',padding:'6px 16px',background:'transparent',border:'1px solid #c9a84c',borderRadius:4,color:'#a08840',fontSize:11,cursor:'pointer'}}>
          Cerrar
        </button>
      </div>
      <div style={{maxWidth:680,margin:'0 auto',padding:'32px 40px 48px'}}>
        <div style={{textAlign:'center',borderBottom:'1px solid #c9a84c',paddingBottom:16,marginBottom:20}}>
          <h1 style={{fontSize:22,fontWeight:400,letterSpacing:4,margin:'0 0 5px'}}>TAROT DE LOS MAESTROS</h1>
          <div style={{fontSize:8,letterSpacing:4,color:'#a08840'}}>ARQUITECTURA SIMBÓLICA DE LA CONCIENCIA</div>
        </div>
        <div style={{marginBottom:20}}>
          {name.trim() && <div style={{fontSize:14,marginBottom:3}}>Lectura para: <strong>{name.trim()}</strong></div>}
          <div style={{fontSize:9,color:'#8a7850',letterSpacing:1}}>{dateStr}</div>
        </div>
        <div style={{marginBottom:24}}>
          <div style={{fontSize:7,letterSpacing:4,color:'#a08840',marginBottom:6}}>CONSULTA</div>
          <div style={{fontSize:14,fontStyle:'italic',borderLeft:'2px solid #c9a84c',paddingLeft:12,color:'#3a3020',lineHeight:1.6}}>"{q}"</div>
        </div>
        {deck.map((card,i) => (
          <div key={card.id}>
            <div style={{marginBottom:20}}>
              <div style={{fontSize:7,letterSpacing:4,color:'#a08840',marginBottom:3}}>CARTA {i+1}</div>
              <div style={{fontSize:8,color:'#8a7850',marginBottom:2}}>{card.p || 'Arcano Mayor'}</div>
              <div style={{fontSize:16,fontWeight:400,marginBottom:2}}>{card.a}</div>
              <div style={{fontSize:10,fontStyle:'italic',color:'#6a5838',marginBottom:8}}>{card.m}</div>
              <div style={{fontSize:9,fontStyle:'italic',color:'#8a6828',border:'1px solid #d4b870',borderRadius:4,padding:'5px 10px',marginBottom:12,background:'#fdfaf3',lineHeight:1.5}}>{card.eje}</div>
              {reading[keys[i]].split(/\n+/).filter(p=>p.trim()).map((p,j) => (
                <p key={j} style={{fontSize:11,color:'#2e2416',lineHeight:1.75,marginBottom:10,margin:'0 0 10px'}}>{p}</p>
              ))}
            </div>
            {i < 2 && <hr style={{border:'none',borderTop:'1px solid #e0d0a0',margin:'20px 0'}}/>}
          </div>
        ))}
        <div style={{borderTop:'1px solid #c9a84c',paddingTop:20,marginTop:10}}>
          <div style={{fontSize:8,letterSpacing:4,color:'#a08840',textAlign:'center',marginBottom:14}}>SÍNTESIS</div>
          {reading.sintesis.split(/\n+/).filter(p=>p.trim()).map((p,i) => (
            <p key={i} style={{fontSize:11,color:'#2e2416',lineHeight:1.75,margin:'0 0 10px'}}>{p}</p>
          ))}
        </div>
        <div style={{textAlign:'center',borderTop:'1px solid #e0d0a0',marginTop:28,paddingTop:12,fontSize:8,fontStyle:'italic',color:'#a09070'}}>
          Tarot de los Maestros · 78 arquetipos encarnados en la historia de la conciencia humana
        </div>
      </div>
    </div>
  );
}

export default function TarotMaestros() {
  const [phase, setPhase] = useState('question');
  const [name, setName] = useState('');
  const [q, setQ] = useState('');
  const [deck, setDeck] = useState([]);
  const [rev, setRev] = useState([false,false,false]);
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [showPrint, setShowPrint] = useState(false);

  const start = () => {
    if (!q.trim()) return;
    const d = [...CARDS].sort(()=>Math.random()-.5).slice(0,3);
    setDeck(d); setRev([false,false,false]); setReading(null); setErr(''); setPhase('reveal');
  };

  const flip = i => { if(rev[i]) return; setRev(p=>{const n=[...p];n[i]=true;return n;}); };
  const allRev = rev.every(Boolean);

  const callAPI = async (msg, attempt=1) => {
    const res = await fetch('/api/oracle', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:2000,system:SYS,messages:[{role:'user',content:msg}]})
    });
    const data = await res.json();
    if ((res.status===529||data?.error?.type==='overloaded_error') && attempt<=3) {
      await new Promise(r=>setTimeout(r,2000*attempt));
      return callAPI(msg, attempt+1);
    }
    if (!res.ok||data.type==='error') throw new Error(data?.error?.message||`HTTP ${res.status}`);
    return data;
  };

  const consult = async () => {
    setLoading(true); setPhase('loading'); setErr('');
    const nameStr = name.trim() ? `El nombre del consultante es: ${name.trim()}\n` : '';
    const msg = `${nameStr}Pregunta del consultante: "${q}"\n\n${deck.map((c,i)=>`CARTA ${i+1}: ${c.a} — ${c.m}\nEje arquetípico: ${c.eje}\nCampo: ${c.p||'Arcano Mayor'}\nNúmero: ${c.n}\nIntegración: ${c.i}`).join('\n\n')}`;
    try {
      const data = await callAPI(msg);
      const txt = data.content.map(c=>c.text||'').join('');
      const match = txt.match(/\{[\s\S]*\}/);
      if (!match) throw new Error(`Inesperado: "${txt.slice(0,120)}"`);
      const parsed = JSON.parse(match[0]);
      if (!parsed.carta1||!parsed.carta2||!parsed.carta3||!parsed.sintesis) throw new Error('Respuesta incompleta.');
      setReading(parsed); setPhase('result');
    } catch(e) {
      console.error(e);
      setErr(`El oráculo no pudo responder: ${e.message}`);
      setPhase('reveal');
    } finally { setLoading(false); }
  };

  const reset = () => { setPhase('question'); setQ(''); setName(''); setDeck([]); setRev([false,false,false]); setReading(null); setErr(''); setShowPrint(false); };

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

      {showPrint && reading && (
        <PrintOverlay deck={deck} reading={reading} name={name} q={q} onClose={()=>setShowPrint(false)}/>
      )}

      <header style={{textAlign:'center',padding:'32px 20px 24px',borderBottom:'1px solid rgba(201,168,76,.15)'}}>
        <div style={{fontSize:10,letterSpacing:7,color:'#c9a84c',marginBottom:10,opacity:.7}}>✦ ✦ ✦</div>
        <h1 style={{margin:0,fontSize:22,fontWeight:300,letterSpacing:5,color:'#e8dfc8'}}>TAROT DE LOS MAESTROS</h1>
        <p style={{margin:'8px 0 0',fontSize:10,letterSpacing:3,color:'#555'}}>ARQUITECTURA SIMBÓLICA DE LA CONCIENCIA</p>
      </header>

      <main style={{maxWidth:820,margin:'0 auto',padding:'40px 20px 60px'}}>

        {phase==='question' && (
          <div style={{animation:'fadeUp .5s ease',textAlign:'center'}}>
            <p style={{fontSize:14,lineHeight:1.9,color:'#b8a888',maxWidth:480,margin:'0 auto 36px',fontStyle:'italic'}}>
              Cada carta es un espejo.<br/>El oráculo ilumina la cualidad de conciencia activa en este momento.
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
                <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="¿Qué deseas consultar al oráculo?…" rows={4} style={{...inputStyle,resize:'vertical'}}
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

        {phase==='reveal' && (
          <div style={{animation:'fadeUp .5s ease'}}>
            <div style={{textAlign:'center',marginBottom:36}}>
              <p style={{fontSize:9,letterSpacing:4,color:'#555',margin:'0 0 10px'}}>
                {allRev ? 'LAS CARTAS HAN HABLADO' : 'REVELÁ LAS CARTAS UNA POR UNA'}
              </p>
              {name.trim() && <p style={{fontSize:10,letterSpacing:2,color:'#c9a84c',margin:'0 0 8px',opacity:.7}}>{name.trim()}</p>}
              <p style={{fontSize:14,fontStyle:'italic',color:'#b8a888',maxWidth:500,margin:'0 auto'}}>"{q}"</p>
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap',marginBottom:36}}>
              {deck.map((card,i)=><FlipCard key={card.id} card={card} flipped={rev[i]} onFlip={flip} idx={i}/>)}
            </div>
            {err && <p style={{color:'#cc6655',fontSize:12,textAlign:'center',margin:'0 0 16px'}}>{err}</p>}
            {allRev && (
              <div style={{textAlign:'center',animation:'fadeUp .4s ease'}}>
                <Btn label="CONSULTAR EL ORÁCULO" onClick={consult}/>
              </div>
            )}
          </div>
        )}

        {phase==='loading' && (
          <div style={{textAlign:'center',padding:'80px 20px',animation:'fadeUp .4s ease'}}>
            <div style={{fontSize:28,color:'#c9a84c',marginBottom:20,display:'inline-block',animation:'spin 3s linear infinite'}}>✦</div>
            <p style={{fontSize:9,letterSpacing:4,color:'#c9a84c',margin:'0 0 10px'}}>EL ORÁCULO MEDITA</p>
            <p style={{fontSize:13,color:'#666',fontStyle:'italic'}}>Las cartas revelan su mensaje…</p>
          </div>
        )}

        {phase==='result' && reading && (
          <div style={{animation:'fadeUp .5s ease'}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <div style={{fontSize:8,letterSpacing:5,color:'#c9a84c',marginBottom:10}}>CONSULTA</div>
              {name.trim() && <p style={{fontSize:11,letterSpacing:2,color:'#c9a84c',margin:'0 0 8px',opacity:.8}}>{name.trim()}</p>}
              <p style={{fontSize:15,fontStyle:'italic',color:'#b8a888',maxWidth:520,margin:'0 auto',lineHeight:1.7}}>"{q}"</p>
            </div>

            {deck.map((card,i) => {
              const c = cfg(card.p);
              const keys = ['carta1','carta2','carta3'];
              return (
                <div key={card.id} style={{marginBottom:28,padding:'22px 24px',border:`1px solid ${c.c}30`,borderRadius:12,background:`${c.b}60`}}>
                  <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                    <div style={{minWidth:140,maxWidth:160,flexShrink:0}}>
                      <div style={{fontSize:8,letterSpacing:3,color:c.c,marginBottom:5}}>CARTA {i+1}</div>
                      <div style={{fontSize:10,color:'#555',marginBottom:5}}>{c.s} {card.p || 'Arcano Mayor'}</div>
                      <div style={{fontSize:15,color:'#e8dfc8',marginBottom:3,lineHeight:1.3}}>{card.a}</div>
                      <div style={{fontSize:11,color:'#888',fontStyle:'italic',marginBottom:10}}>{card.m}</div>
                      <div style={{fontSize:9,lineHeight:1.5,color:c.c,padding:'8px 10px',border:`1px solid ${c.c}25`,borderRadius:6,background:`${c.c}0d`}}>{card.eje}</div>
                    </div>
                    <div style={{flex:1,minWidth:200}}>
                      <Paras text={reading[keys[i]]}/>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{marginTop:40,padding:'28px 28px 24px',border:'1px solid rgba(201,168,76,.25)',borderRadius:12,background:'rgba(201,168,76,.03)',position:'relative'}}>
              <div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)',background:'#08080f',padding:'0 20px',fontSize:8,letterSpacing:5,color:'#c9a84c'}}>SÍNTESIS</div>
              <div style={{width:40,height:1,background:'rgba(201,168,76,.3)',margin:'0 auto 20px'}}/>
              <Paras text={reading.sintesis}/>
            </div>

            <div style={{display:'flex',gap:10,justifyContent:'center',margin:'32px 0',flexWrap:'wrap'}}>
              {deck.map(card=>{const c=cfg(card.p);return(
                <div key={card.id} style={{fontSize:11,color:'#888',padding:'4px 12px',border:`1px solid ${c.c}30`,borderRadius:20,fontStyle:'italic'}}>
                  {c.s} {card.a}
                </div>
              );})}
            </div>

            <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
              <Btn label="DESCARGAR PDF" onClick={()=>setShowPrint(true)}/>
              <Btn label="NUEVA CONSULTA" onClick={reset}/>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}