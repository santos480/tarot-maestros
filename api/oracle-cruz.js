import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  // Verificar autenticación
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const token = authHeader.slice(7);

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Sesión inválida' });
  }

  // Verificar y descontar crédito (atómico)
  const { data: creditData, error: creditError } = await supabaseAdmin
    .rpc('usar_credito', { p_usuario_id: user.id });

  if (creditError) {
    console.error('Error de crédito:', creditError);
    return res.status(500).json({ error: 'Error al verificar créditos' });
  }

  if (!creditData.ok) {
    return res.status(402).json({
      error: creditData.error,
      creditos: creditData.creditos ?? 0
    });
  }

  // Llamar a Anthropic
  let body = req.body;
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }

  const { pregunta, cartas, ...anthropicBody } = body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
    },
    body: JSON.stringify(anthropicBody),
  });

  const data = await response.json();

  // Guardar consulta si la respuesta fue exitosa
  if (response.ok && data.content) {
    const respuesta_ia = data.content.map(c => c.text || '').join('');
    await supabaseAdmin.from('consultas').insert({
      usuario_id: user.id,
      tipo: 'cruz',
      cartas: cartas || null,
      pregunta: pregunta || null,
      respuesta_ia
    });
  }

  res.setHeader('X-Credits-Remaining', String(creditData.creditos));
  res.status(response.status).json(data);
}
