import { supabase } from '../supabase';

export default function AppHeader({
  tiradaActiva,
  onNavegar,
  creditos,
  onSolicitarCreditos,
  solicitandoCreditos,
  creditosSolicitados,
  session
}) {
  const navButtons = [
    { label: '3 CARTAS', value: 'tres' },
    { label: 'TIRADA EN CRUZ ✦', value: 'cruz' },
    { label: 'CARTA DEL DÍA ✦', value: 'cartadeldia' },
    { label: 'LECTURAS', value: 'historial' }
  ];

  return (
    <header style={{
      padding: '28px 20px 20px',
      borderBottom: '1px solid rgba(201,168,76,.15)',
      position: 'relative',
      textAlign: 'center'
    }}>
      {/* Zona superior derecha */}
      <div style={{
        position: 'absolute',
        right: 16,
        top: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {creditos !== null && (
          <span style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px'
          }}>
            <span style={{
              fontSize: 10,
              color: creditos > 0 ? '#c9a84c' : '#cc6655',
              letterSpacing: 1,
              fontStyle: 'italic'
            }}>
              ✦ {creditos} crédito{creditos !== 1 ? 's' : ''}
            </span>
            {creditos === 0 && onSolicitarCreditos && (
              <button
                onClick={onSolicitarCreditos}
                disabled={solicitandoCreditos || creditosSolicitados}
                style={{
                  background: 'transparent',
                  border: '1px solid #6b4fa0',
                  color: '#c9a0ff',
                  borderRadius: '4px',
                  padding: '3px 10px',
                  cursor: creditosSolicitados ? 'default' : 'pointer',
                  fontSize: '9px',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  fontFamily: 'inherit'
                }}
              >
                {creditosSolicitados ? 'Solicitud enviada ✓' : solicitandoCreditos ? 'Enviando...' : 'Solicitá más créditos'}
              </button>
            )}
          </span>
        )}
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            background: 'transparent',
            border: '1px solid rgba(201,168,76,.2)',
            borderRadius: 4,
            color: 'rgba(201,168,76,.4)',
            fontSize: 8,
            letterSpacing: 2,
            padding: '5px 10px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,76,.2)'}
        >
          SALIR
        </button>
      </div>

      {/* Zona central */}
      <div style={{
        fontSize: 10,
        letterSpacing: 7,
        color: '#c9a84c',
        marginBottom: 10,
        opacity: .7
      }}>
        ✦ ✦ ✦
      </div>
      <h1 style={{
        margin: 0,
        fontSize: 22,
        fontWeight: 300,
        letterSpacing: 5,
        color: '#e8dfc8'
      }}>
        TAROT DE LOS MAESTROS
      </h1>
      <p style={{
        margin: '8px 0 0',
        fontSize: 10,
        letterSpacing: 3,
        color: '#555'
      }}>
        ARQUITECTURA SIMBÓLICA DE LA CONCIENCIA
      </p>

      {/* Zona de navegación */}
      <div style={{
        marginTop: 16,
        display: 'flex',
        gap: 8,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {navButtons.map(btn => {
          const isActive = btn.value === tiradaActiva;
          return (
            <button
              key={btn.value}
              onClick={() => onNavegar(btn.value)}
              style={{
                background: isActive ? 'rgba(201,168,76,.15)' : 'transparent',
                border: isActive ? '1px solid #c9a84c' : '1px solid rgba(201,168,76,.3)',
                borderRadius: 4,
                color: isActive ? '#c9a84c' : 'rgba(201,168,76,.6)',
                fontSize: 8,
                letterSpacing: 2,
                padding: '6px 14px',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {btn.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
