import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { userEmail } = req.body;

  if (!userEmail) {
    return res.status(400).json({ error: 'Email de usuario requerido' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'numero170@gmail.com',
      subject: 'TDM — Solicitud de créditos',
      html: `
        <h2>Nueva solicitud de créditos</h2>
        <p>El siguiente usuario agotó sus créditos y solicita más:</p>
        <p><strong>${userEmail}</strong></p>
        <p>Ingresá al panel de admin para asignarle créditos:</p>
        <a href="https://tarot-maestros.vercel.app/admin">Ir al panel de admin</a>
      `,
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error enviando mail:', error);
    return res.status(500).json({ error: 'Error al enviar la solicitud' });
  }
}
