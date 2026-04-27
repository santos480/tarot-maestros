export default function CardBack({ size = 'md' }) {
  const dimensions = {
    sm: { width: 60, height: 96 },
    md: { width: 110, height: 176 },
    lg: { width: 160, height: 256 }
  };

  const { width, height } = dimensions[size];

  return (
    <div style={{
      width,
      height,
      borderRadius: 6,
      overflow: 'hidden',
      background: '#0f0c08',
      border: '1px solid rgba(196,162,99,0.35)',
      boxShadow: '0 30px 60px -20px rgba(0,0,0,0.7)',
      flexShrink: 0
    }}>
      <svg width="100%" height="100%" viewBox="0 0 100 160" preserveAspectRatio="none">
        {/* Marco exterior */}
        <rect x="3" y="3" width="94" height="154" rx="1" stroke="#c4a263" fill="none" strokeWidth="0.8" opacity="0.5" />

        {/* Marco interior */}
        <rect x="6" y="6" width="88" height="148" rx="1" stroke="#c4a263" fill="none" strokeWidth="0.5" opacity="0.28" />

        {/* Esquinas ornamentales */}
        <polyline points="6,14 6,6 14,6" stroke="#c4a263" fill="none" strokeWidth="0.6" opacity="0.55" />
        <polyline points="86,6 94,6 94,14" stroke="#c4a263" fill="none" strokeWidth="0.6" opacity="0.55" />
        <polyline points="6,146 6,154 14,154" stroke="#c4a263" fill="none" strokeWidth="0.6" opacity="0.55" />
        <polyline points="86,154 94,154 94,146" stroke="#c4a263" fill="none" strokeWidth="0.6" opacity="0.55" />

        {/* Líneas radiantes desde el centro */}
        <line x1="50" y1="20" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="50" y1="140" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="10" y1="80" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="90" y1="80" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="20" y1="30" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="80" y1="30" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="20" y1="130" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />
        <line x1="80" y1="130" x2="50" y2="80" stroke="#c4a263" strokeWidth="0.4" opacity="0.18" />

        {/* Círculos concéntricos */}
        <circle cx="50" cy="80" r="28" stroke="#c4a263" fill="none" strokeWidth="0.5" opacity="0.25" />
        <circle cx="50" cy="80" r="18" stroke="#c4a263" fill="none" strokeWidth="0.4" opacity="0.18" />

        {/* Diamante exterior */}
        <polygon points="50,38 82,80 50,122 18,80" stroke="#c4a263" fill="none" strokeWidth="0.8" opacity="0.65" />

        {/* Diamante interior */}
        <polygon points="50,52 70,80 50,108 30,80" stroke="#c4a263" fill="none" strokeWidth="0.6" opacity="0.38" />

        {/* Punto central */}
        <circle cx="50" cy="80" r="3.5" fill="#c4a263" opacity="0.88" />

        {/* Círculo alrededor del punto */}
        <circle cx="50" cy="80" r="8" stroke="#c4a263" fill="none" strokeWidth="0.5" opacity="0.3" />

        {/* Estrellas arriba */}
        <text x="50" y="20" textAnchor="middle" fill="#c4a263" opacity="0.6" fontSize="6">✦  ✦  ✦</text>

        {/* Estrellas abajo */}
        <text x="50" y="148" textAnchor="middle" fill="#c4a263" opacity="0.6" fontSize="6">✦  ✦  ✦</text>
      </svg>
    </div>
  );
}
