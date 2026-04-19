import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const ADMIN_EMAIL = 'numero170@gmail.com';

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [session, setSession] = useState(null);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email === ADMIN_EMAIL) {
        setAutorizado(true);
        cargarUsuarios(session.user.email);
      }
    });
  }, []);

  async function cargarUsuarios(email) {
    setLoading(true);
    const res = await fetch('/api/admin-credits', {
      headers: { 'x-admin-email': email },
    });
    const data = await res.json();
    setUsuarios(data.usuarios || []);
    setLoading(false);
  }

  async function actualizarCreditos(userId, creditos) {
    setGuardando(userId);
    const res = await fetch('/api/admin-credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-email': session.user.email,
      },
      body: JSON.stringify({ userId, creditos }),
    });
    if (res.ok) {
      setMensaje('Créditos actualizados ✓');
      cargarUsuarios(session.user.email);
      setTimeout(() => setMensaje(''), 3000);
    }
    setGuardando(null);
  }

  if (!autorizado) {
    return (
      <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
        <p>No tenés acceso a esta sección.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '860px', margin: '0 auto', color: '#fff' }}>
      <h2 style={{ marginBottom: '0.5rem', color: '#c9a0ff' }}>Panel de Admin — Créditos</h2>
      <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Usuarios registrados: {usuarios.length}
      </p>
      {mensaje && (
        <p style={{ color: '#4caf50', marginBottom: '1rem' }}>{mensaje}</p>
      )}
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #444', color: '#aaa' }}>
              <th style={{ textAlign: 'left', padding: '0.6rem' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '0.6rem' }}>Plan</th>
              <th style={{ textAlign: 'left', padding: '0.6rem' }}>Registro</th>
              <th style={{ textAlign: 'left', padding: '0.6rem' }}>Créditos</th>
              <th style={{ textAlign: 'left', padding: '0.6rem' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <FilaUsuario
                key={u.id}
                usuario={u}
                guardando={guardando === u.id}
                onGuardar={actualizarCreditos}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function FilaUsuario({ usuario, guardando, onGuardar }) {
  const [creditos, setCreditos] = useState(usuario.creditos_restantes);

  const fecha = usuario.fecha_registro
    ? new Date(usuario.fecha_registro).toLocaleDateString('es-AR')
    : '—';

  return (
    <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
      <td style={{ padding: '0.6rem', color: '#ddd' }}>{usuario.email}</td>
      <td style={{ padding: '0.6rem', color: '#aaa' }}>{usuario.plan}</td>
      <td style={{ padding: '0.6rem', color: '#aaa' }}>{fecha}</td>
      <td style={{ padding: '0.6rem' }}>
        <input
          type="number"
          value={creditos}
          min="0"
          onChange={(e) => setCreditos(e.target.value)}
          style={{
            width: '65px',
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '0.9rem',
          }}
        />
      </td>
      <td style={{ padding: '0.6rem' }}>
        <button
          onClick={() => onGuardar(usuario.id, creditos)}
          disabled={guardando}
          style={{
            background: guardando ? '#444' : '#6b4fa0',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 14px',
            cursor: guardando ? 'not-allowed' : 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </td>
    </tr>
  );
}
