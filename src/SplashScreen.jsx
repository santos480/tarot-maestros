import { useEffect, useState, useRef } from 'react';

export default function SplashScreen({ onContinue }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [esMobile, setEsMobile] = useState(() => window.innerWidth < 600);
  const videoRef = useRef(null);

  useEffect(() => {
    // Cargar fuente Cormorant Garamond desde Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Event listener para resize
    const handleResize = () => {
      setEsMobile(window.innerWidth < 600);
    };
    window.addEventListener('resize', handleResize);

    // Play video
    const v = videoRef.current;
    if (v) v.play();

    // Listener para cuando termina el video
    const handleVideoEnd = () => {
      if (v) {
        v.pause();
        v.currentTime = v.duration - 0.05;
      }
    };
    if (v) v.addEventListener('ended', handleVideoEnd);

    // Timer para mostrar overlay
    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, 1400);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (v) v.removeEventListener('ended', handleVideoEnd);
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a0807',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 9999
    }}>
      {/* ZONA SUPERIOR — Header */}
      <div style={{
        height: esMobile ? '22%' : '18%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 3,
        padding: '0 24px'
      }}>
        {/* Rombos dorados */}
        <div style={{
          fontSize: '11px',
          letterSpacing: '0.5em',
          color: '#c4a263'
        }}>
          ✦ ✦ ✦
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: esMobile ? '20px' : '26px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          fontWeight: 500,
          color: '#e8dec6',
          margin: '10px 0 6px',
          textAlign: 'center'
        }}>
          Tarot de los Maestros
        </h1>

        {/* Subtítulo */}
        <div style={{
          fontSize: esMobile ? '8px' : '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(232,222,198,0.5)',
          textAlign: 'center'
        }}>
          Arquitectura simbólica de la consciencia
        </div>
      </div>

      {/* ZONA INFERIOR — Video + overlays + textos */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: esMobile ? 'block' : 'flex',
        justifyContent: esMobile ? 'initial' : 'center',
        overflow: 'hidden'
      }}>
        {esMobile ? (
          // Layout Mobile
          <>
            {/* Video */}
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.55) contrast(1.05) sepia(0.18)'
              }}
            >
              <source src="/einstein-intro.mp4" type="video/mp4" />
            </video>

            {/* Overlay radial */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,8,7,0.82) 90%)',
              pointerEvents: 'none'
            }} />

            {/* Overlay gradiente */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,8,7,0.3) 0%, transparent 25%, transparent 55%, rgba(10,8,7,0.95) 100%)',
              pointerEvents: 'none'
            }} />

            {/* Frase filosófica */}
            <div style={{
              position: 'absolute',
              bottom: '100px',
              left: 0,
              right: 0,
              textAlign: 'center',
              padding: '0 32px',
              zIndex: 2,
              opacity: showOverlay ? 1 : 0,
              transition: 'opacity 1.4s ease'
            }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontSize: '12px',
                color: 'rgba(232,222,198,0.75)',
                lineHeight: 1.85
              }}>
                Nada empieza ni termina. La consciencia se despliega, se reconoce y vuelve a desplegarse. Leer este Tarot es participar conscientemente de ese movimiento.
              </div>
            </div>

            {/* Botón INGRESAR */}
            <button
              onClick={onContinue}
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                width: '200px',
                padding: '13px 0',
                background: 'transparent',
                border: '1px solid #c4a263',
                color: '#c4a263',
                fontSize: '10px',
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                cursor: 'pointer',
                opacity: showOverlay ? 1 : 0,
                transition: 'opacity 1.5s ease 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196,162,99,0.1)';
                e.currentTarget.style.borderColor = '#e8dec6';
                e.currentTarget.style.color = '#e8dec6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#c4a263';
                e.currentTarget.style.color = '#c4a263';
              }}
            >
              Ingresar
            </button>
          </>
        ) : (
          // Layout Desktop
          <div style={{
            height: '100%',
            aspectRatio: '9/16',
            position: 'relative',
            overflow: 'hidden',
            maxHeight: '100%'
          }}>
            {/* Video */}
            <video
              ref={videoRef}
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.55) contrast(1.05) sepia(0.18)'
              }}
            >
              <source src="/einstein-intro.mp4" type="video/mp4" />
            </video>

            {/* Overlay radial */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,8,7,0.82) 90%)',
              pointerEvents: 'none'
            }} />

            {/* Overlay gradiente */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10,8,7,0.3) 0%, transparent 25%, transparent 55%, rgba(10,8,7,0.95) 100%)',
              pointerEvents: 'none'
            }} />

            {/* Frase filosófica */}
            <div style={{
              position: 'absolute',
              bottom: '100px',
              left: 0,
              right: 0,
              textAlign: 'center',
              padding: '0 32px',
              zIndex: 2,
              opacity: showOverlay ? 1 : 0,
              transition: 'opacity 1.4s ease'
            }}>
              <div style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontStyle: 'italic',
                fontSize: '12px',
                color: 'rgba(232,222,198,0.75)',
                lineHeight: 1.85
              }}>
                Nada empieza ni termina. La consciencia se despliega, se reconoce y vuelve a desplegarse. Leer este Tarot es participar conscientemente de ese movimiento.
              </div>
            </div>

            {/* Botón INGRESAR */}
            <button
              onClick={onContinue}
              style={{
                position: 'absolute',
                bottom: '28px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                width: '200px',
                padding: '13px 0',
                background: 'transparent',
                border: '1px solid #c4a263',
                color: '#c4a263',
                fontSize: '10px',
                letterSpacing: '0.36em',
                textTransform: 'uppercase',
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                cursor: 'pointer',
                opacity: showOverlay ? 1 : 0,
                transition: 'opacity 1.5s ease 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(196,162,99,0.1)';
                e.currentTarget.style.borderColor = '#e8dec6';
                e.currentTarget.style.color = '#e8dec6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#c4a263';
                e.currentTarget.style.color = '#c4a263';
              }}
            >
              Ingresar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
