import { useEffect, useState, useRef } from 'react';

export default function SplashScreen({ onContinue }) {
  const [showText, setShowText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [esMobile, setEsMobile] = useState(() => window.innerWidth < 600);
  const videoRef = useRef(null);

  useEffect(() => {
    // Cargar fuente Cormorant Garamond desde Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Aparecer texto después de 1.4s
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1400);

    // Aparecer botón 0.3s después del texto
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 1700);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(buttonTimer);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setEsMobile(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleVideoEnd = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = v.duration - 0.05;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#0a0807',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Contenedor del video con background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#0a0807',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Video de fondo */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          style={{
            position: esMobile ? 'absolute' : 'relative',
            top: esMobile ? 0 : 'auto',
            left: esMobile ? 0 : 'auto',
            width: esMobile ? '100%' : 'auto',
            height: '100%',
            objectFit: esMobile ? 'cover' : 'contain',
            filter: 'brightness(0.55) contrast(1.05) sepia(0.18)'
          }}
        >
          <source src="/einstein-intro.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Overlay radial oscuro */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, transparent 0%, rgba(10,8,7,0.6) 70%, rgba(10,8,7,0.9) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Overlay gradiente vertical */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(10,8,7,0.4) 0%, transparent 30%, transparent 70%, rgba(10,8,7,0.6) 100%)',
        pointerEvents: 'none'
      }} />

      {/* Contenido principal */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        padding: '20px',
        maxWidth: '600px'
      }}>
        {/* Rombos dorados */}
        <div style={{
          fontSize: '14px',
          letterSpacing: '12px',
          color: '#c4a263',
          marginBottom: '24px'
        }}>
          ✦ ✦ ✦
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: '42px',
          fontWeight: 300,
          letterSpacing: '3px',
          color: '#e8dec6',
          margin: '0 0 16px 0',
          lineHeight: 1.3
        }}>
          Tarot de los Maestros
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: '13px',
          letterSpacing: '4px',
          color: 'rgba(232,222,198,0.5)',
          margin: '0 0 60px 0',
          textTransform: 'uppercase'
        }}>
          Arquitectura simbólica de la consciencia
        </p>

        {/* Frase filosófica */}
        <div style={{
          position: 'absolute',
          bottom: '130px',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 2,
          opacity: showText ? 1 : 0,
          transition: 'opacity 1.4s ease'
        }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontStyle: 'italic',
            fontSize: esMobile ? '13px' : '15px',
            color: 'rgba(232,222,198,0.75)',
            lineHeight: 1.8,
            maxWidth: '320px',
            margin: '0 auto',
            padding: '0 32px'
          }}>
            Nada empieza ni termina. La consciencia se despliega, se reconoce y vuelve a desplegarse. Leer este Tarot es participar conscientemente de ese movimiento.
          </div>
        </div>

        {/* Botón Ingresar */}
        <button
          onClick={onContinue}
          style={{
            opacity: showButton ? 1 : 0,
            transition: 'opacity 1.2s ease',
            width: '100%',
            maxWidth: '300px',
            padding: '14px 0',
            background: 'transparent',
            border: '1px solid #c4a263',
            borderRadius: '4px',
            color: '#c4a263',
            fontSize: '11px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease'
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
    </div>
  );
}
