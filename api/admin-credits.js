import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const ADMIN_EMAIL = 'numero170@gmail.com';

export default async function handler(req, res) {
  const adminEmail = req.headers['x-admin-email'];

  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'No autorizado' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, plan, creditos_restantes, fecha_registro')
      .order('fecha_registro', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ usuarios: data });
  }

  if (req.method === 'POST') {
    const { userId, creditos } = req.body;

    if (!userId || creditos === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ creditos_restantes: parseInt(creditos) })
      .eq('id', userId);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
