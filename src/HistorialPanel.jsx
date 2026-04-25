import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import AppHeader from './components/AppHeader';

const PC = {
  Espadas: { s:'⚔', c:'#8fc4d8' },
  Copas:   { s:'◐', c:'#7ab0cc' },
  Oros:    { s:'◉', c:'#c9a84c' },
  Bastos:  { s:'✦', c:'#cc7755' },
};
const cfg = (p) => p ? PC[p] : { s:'✧', c:'#9b7fd4' };

const LABELS_CRUZ = {
  esencia:   'La Esencia',
  corriente: 'La Corriente',
  horizonte: 'El Horizonte',
  conciencia:'La Conciencia',
  sombra:    'La Sombra',
  sintesis:  'Síntesis',
};

const DIMENSION_LABELS = {
  'DIMENSION_COMPRENDER': 'Quiero entender algo mejor hoy',
  'DIMENSION_ACTUAR': 'Necesito energía o dirección para actuar',
  'DIMENSION_VINCULOS': 'Algo en mis vínculos pide atención',
  'DIMENSION_SOLTAR': 'Quiero soltar algo que ya no me sirve',
  'DIMENSION_EMERGENTE': 'Siento que algo nuevo está naciendo en mí'
};

const getDimensionLabel = (pregunta) => {
  if (!pregunta) return '';
  const key = Object.keys(DIMENSION_LABELS).find(k => pregunta.includes(k));
  return key ? DIMENSION_LABELS[key] : pregunta;
};

function Paras({ text }) {
  if (!text) return null;
  return (
    <>
      {text.split('\n').filter(Boolean).map((p, i) => (
        <p key={i} style={{ margin:'0 0 10px', fontSize:13, lineHeight:1.75, color:'#c8bda8' }}>{p}</p>
      ))}
    </>
  );
}

function tryParse(txt) {
  if (!txt) return null;
  const match = txt.match(/\{[\s\S]*\}/);
  if (!match) return null;
  let jsonStr = match[0];
  try { return JSON.parse(jsonStr); } catch {}
  jsonStr = jsonStr
    .replace(/[\x00-\x1F\x7F]/g, ' ')
    .replace(/\r?\n/g, ' ')
    .replace(/([{,]\s*"[^"]+"\s*:\s*)"((?:[^"\\]|\\.|"(?![,}]))*?)"/g, (_, prefix, val) =>
      prefix + '"' + val.replace(/"/g, "'") + '"'
    );
  try { return JSON.parse(jsonStr); } catch {}
  return null;
}

function formatFecha(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' })
    + ' · ' + d.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
}

function CardThumb({ card }) {
  const c = cfg(card.p);
  return (
    <div style={{
      width: 72, flexShrink: 0,
      border: `1px solid ${c.c}40`, borderRadius: 8,
      overflow: 'hidden', background: '#0a0810',
      aspectRatio: '2/3', position: 'relative',
    }}>
      {card.img
        ? <div style={{
            width:'100%', height:'100%',
            backgroundImage:`url(${card.img})`,
            backgroundSize:'contain',
            backgroundRepeat:'no-repeat',
            backgroundPosition:'center',
          }}
            onContextMenu={e => e.preventDefault()}
          />
        : <div style={{
            display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center',
            height:'100%', padding:6,
          }}>
            <div style={{ fontSize:16, color:c.c }}>{c.s}</div>
            <div style={{ fontSize:8, color:'#888', textAlign:'center', marginTop:4, lineHeight:1.3 }}>{card.a}</div>
          </div>
      }
    </div>
  );
}

function LecturaExpandida({ consulta }) {
  const parsed = tryParse(consulta.respuesta_ia);
  const cartas = consulta.cartas || [];
  const esCruz = consulta.tipo === 'cruz';
  const esCartaDelDia = consulta.tipo === 'carta_del_dia';

  // Renderizado especial para Carta del Día
  if (esCartaDelDia) {
    const carta = cartas[0];
    const dimensionLegible = getDimensionLabel(consulta.pregunta);

    return (
      <div style={{ marginTop: 16 }}>
        {/* Carta */}
        {carta && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, marginBottom:20 }}>
            <CardThumb card={carta} />
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'#e8dfc8', marginBottom:2 }}>{carta.a}</div>
              <div style={{ fontSize:9, color:'#999', fontStyle:'italic' }}>{carta.m}</div>
            </div>
          </div>
        )}

        {/* Dimensión */}
        {dimensionLegible && (
          <div style={{ fontSize:10, color:'#c9a84c', fontStyle:'italic', marginBottom:16, textAlign:'center' }}>
            {dimensionLegible}
          </div>
        )}

        {/* Respuesta (texto plano) */}
        <div style={{ fontSize:13, lineHeight:1.8, color:'#c8bda8', whiteSpace:'pre-wrap' }}>
          {consulta.respuesta_ia}
        </div>
      </div>
    );
  }

  // Renderizado normal para 3 cartas y Cruz
  if (!parsed) {
    return (
      <div style={{ padding:'12px 0', fontSize:12, color:'#666', fontStyle:'italic' }}>
        No se pudo cargar la lectura.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* Imágenes de cartas */}
      {cartas.length > 0 && (
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {cartas.map((c, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <CardThumb card={c} />
              <div style={{ fontSize:8, color:'#666', letterSpacing:1, textAlign:'center', maxWidth:72 }}>
                {c.a}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contenido según tipo */}
      {esCruz
        ? Object.entries(LABELS_CRUZ).map(([key, label]) => parsed[key] && (
            <div key={key} style={{ marginBottom:16 }}>
              <div style={{ fontSize:8, letterSpacing:3, color:'#c9a84c', marginBottom:6 }}>
                {label.toUpperCase()}
              </div>
              <Paras text={parsed[key]} />
            </div>
          ))
        : ['carta1','carta2','carta3'].map((key, i) => parsed[key] && (
            <div key={key} style={{ marginBottom:16 }}>
              {cartas[i] && (
                <div style={{ fontSize:8, letterSpacing:3, color: cfg(cartas[i].p).c, marginBottom:6 }}>
                  {cartas[i].a.toUpperCase()} — {cartas[i].m}
                </div>
              )}
              <Paras text={parsed[key]} />
            </div>
          ))
      }

      {parsed.sintesis && (
        <div style={{
          marginTop:12, padding:'16px 18px',
          border:'1px solid rgba(201,168,76,.2)', borderRadius:10,
          background:'rgba(201,168,76,.03)', position:'relative',
        }}>
          <div style={{
            position:'absolute', top:-9, left:'50%', transform:'translateX(-50%)',
            background:'#08080f', padding:'0 14px',
            fontSize:8, letterSpacing:4, color:'#c9a84c',
          }}>SÍNTESIS</div>
          <Paras text={parsed.sintesis} />
        </div>
      )}
    </div>
  );
}

export default function HistorialPanel({ user, session, onVolver, creditos }) {
  const [todasLasConsultas, setTodasLasConsultas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    supabase
      .from('consultas')
      .select('id, tipo, pregunta, cartas, respuesta_ia, fecha')
      .eq('usuario_id', session.user.id)
      .order('fecha', { ascending: false })
      .limit(500)
      .then(({ data }) => {
        setTodasLasConsultas(data || []);
        setLoadingData(false);
      });
  }, [session]);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const cambiarFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
    setPagina(1);
  };

  // Filtrado
  const consultasFiltradas = filtro === 'todas'
    ? todasLasConsultas
    : todasLasConsultas.filter(c => c.tipo === filtro);

  // Paginación
  const totalPaginas = Math.ceil(consultasFiltradas.length / 10);
  const consultasPagina = consultasFiltradas.slice((pagina - 1) * 10, pagina * 10);

  const irPaginaAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const irPaginaSiguiente = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(180deg,#0a0a12 0%,#14101f 100%)',color:'#e8dfc8',padding:'40px 20px',fontFamily:'system-ui,-apple-system,sans-serif'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <AppHeader
          tiradaActiva="historial"
          onNavegar={(sec) => onVolver(sec || 'tres')}
          creditos={creditos}
          onSolicitarCreditos={null}
          solicitandoCreditos={false}
          creditosSolicitados={false}
          session={session}
        />

        <div style={{textAlign:'center', marginBottom:24, marginTop:8}}>
          <h2 style={{fontSize:18,margin:'0 0 6px',color:'#c9a84c',fontWeight:300,letterSpacing:4}}>
            LECTURAS
          </h2>
          <p style={{fontSize:10,color:'#9a8f7a',margin:0,letterSpacing:2}}>
            Tu historial de consultas
          </p>
        </div>

        <div style={{marginBottom:40}}>
          {/* Barra de filtros */}
          <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={() => cambiarFiltro('todas')}
              style={{
                background: filtro === 'todas' ? 'rgba(201,168,76,.15)' : 'transparent',
                border: filtro === 'todas' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,.3)',
                borderRadius:4,
                color: filtro === 'todas' ? '#c9a84c' : 'rgba(201,168,76,.6)',
                fontSize:8,letterSpacing:2,padding:'6px 14px',cursor:'pointer',fontFamily:'inherit'
              }}>
              TODAS
            </button>
            <button onClick={() => cambiarFiltro('3cartas')}
              style={{
                background: filtro === '3cartas' ? 'rgba(201,168,76,.15)' : 'transparent',
                border: filtro === '3cartas' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,.3)',
                borderRadius:4,
                color: filtro === '3cartas' ? '#c9a84c' : 'rgba(201,168,76,.6)',
                fontSize:8,letterSpacing:2,padding:'6px 14px',cursor:'pointer',fontFamily:'inherit'
              }}>
              3 CARTAS
            </button>
            <button onClick={() => cambiarFiltro('cruz')}
              style={{
                background: filtro === 'cruz' ? 'rgba(201,168,76,.15)' : 'transparent',
                border: filtro === 'cruz' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,.3)',
                borderRadius:4,
                color: filtro === 'cruz' ? '#c9a84c' : 'rgba(201,168,76,.6)',
                fontSize:8,letterSpacing:2,padding:'6px 14px',cursor:'pointer',fontFamily:'inherit'
              }}>
              TIRADA EN CRUZ
            </button>
            <button onClick={() => cambiarFiltro('carta_del_dia')}
              style={{
                background: filtro === 'carta_del_dia' ? 'rgba(201,168,76,.15)' : 'transparent',
                border: filtro === 'carta_del_dia' ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,.3)',
                borderRadius:4,
                color: filtro === 'carta_del_dia' ? '#c9a84c' : 'rgba(201,168,76,.6)',
                fontSize:8,letterSpacing:2,padding:'6px 14px',cursor:'pointer',fontFamily:'inherit'
              }}>
              CARTA DEL DÍA ✦
            </button>
          </div>
        </div>

        {/* Lista de consultas */}
        <div style={{marginBottom:40}}>
          {loadingData && (
            <div style={{ textAlign:'center', padding:'60px 0', fontSize:12, color:'#555', fontStyle:'italic' }}>
              Cargando lecturas…
            </div>
          )}

          {!loadingData && consultasFiltradas.length === 0 && (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ fontSize:24, color:'rgba(201,168,76,.2)', marginBottom:16 }}>✦</div>
              <p style={{ fontSize:12, color:'#555', fontStyle:'italic', lineHeight:1.7 }}>
                {filtro === 'todas'
                  ? 'Todavía no realizaste ninguna consulta.'
                  : 'No hay lecturas de este tipo.'}
              </p>
            </div>
          )}

          {!loadingData && consultasPagina.map(c => {
            const isOpen = expanded === c.id;
            return (
              <div key={c.id} style={{
                marginBottom:12,
                border:'1px solid rgba(201,168,76,.12)',
                borderRadius:10,
                background: isOpen ? 'rgba(201,168,76,.03)' : 'transparent',
                transition:'background .2s',
                overflow:'hidden',
              }}>
                {/* Cabecera del item */}
                <button
                  onClick={() => toggle(c.id)}
                  style={{
                    width:'100%', textAlign:'left', background:'transparent',
                    border:'none', cursor:'pointer', padding:'14px 16px',
                    fontFamily:'inherit', color:'inherit',
                  }}
                >
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:8, letterSpacing:2, color:'#c9a84c', marginBottom:5 }}>
                        {c.tipo === 'cruz' ? 'TIRADA EN CRUZ' : c.tipo === 'carta_del_dia' ? 'CARTA DEL DÍA ✦' : '3 CARTAS'}
                        {' · '}
                        {formatFecha(c.fecha)}
                      </div>
                      <div style={{ fontSize:13, color:'#c8bda8', fontStyle:'italic', lineHeight:1.5 }}>
                        "{c.pregunta || '—'}"
                      </div>
                    </div>
                    <div style={{ fontSize:10, color:'rgba(201,168,76,.4)', flexShrink:0, marginTop:2 }}>
                      {isOpen ? '▲' : '▼'}
                    </div>
                  </div>
                </button>

                {/* Contenido expandido */}
                {isOpen && (
                  <div style={{ padding:'0 16px 16px', borderTop:'1px solid rgba(201,168,76,.08)' }}>
                    <LecturaExpandida consulta={c} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Paginación */}
        {!loadingData && totalPaginas > 1 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:16}}>
            <button
              onClick={irPaginaAnterior}
              disabled={pagina === 1}
              style={{
                background:'transparent',
                border:'1px solid rgba(201,168,76,.4)',
                borderRadius:4,
                color:'rgba(201,168,76,.7)',
                fontSize:8,letterSpacing:2,padding:'6px 14px',
                cursor: pagina === 1 ? 'default' : 'pointer',
                fontFamily:'inherit',
                opacity: pagina === 1 ? 0.3 : 1
              }}>
              ← ANTERIOR
            </button>
            <div style={{fontSize:9,color:'rgba(201,168,76,.6)',letterSpacing:1}}>
              Página {pagina} de {totalPaginas}
            </div>
            <button
              onClick={irPaginaSiguiente}
              disabled={pagina === totalPaginas}
              style={{
                background:'transparent',
                border:'1px solid rgba(201,168,76,.4)',
                borderRadius:4,
                color:'rgba(201,168,76,.7)',
                fontSize:8,letterSpacing:2,padding:'6px 14px',
                cursor: pagina === totalPaginas ? 'default' : 'pointer',
                fontFamily:'inherit',
                opacity: pagina === totalPaginas ? 0.3 : 1
              }}>
              SIGUIENTE →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
