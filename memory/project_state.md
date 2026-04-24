---
name: Estado del proyecto
description: Estado actual completo del proyecto al 2026-04-12, próxima sesión continúa con cartas faltantes e imágenes
type: project
---

## Stack
- Frontend: React + Vite (`src/`)
- Backend: Vercel Serverless Functions (`api/oracle.js`, `api/oracle-cruz.js`)
- DB/Auth: Supabase
- Deploy: Vercel — rama `main` → https://tarot-maestros.vercel.app/
- Rama de trabajo: `develop` → merge a `main` cuando algo está listo

## Todo lo que está hecho y en producción (al 2026-04-12)

### Auth y créditos
- `AuthScreen.jsx`: login/registro/cierre de sesión
- Trigger `on_auth_user_created`: crea fila en `usuarios` con 5 créditos al registrarse
- Función `usar_credito`: descuenta 1 crédito atómicamente con check de vencimiento
- Ambos endpoints protegidos (`oracle.js`, `oracle-cruz.js`): verifican token + descuentan crédito
- Contador de créditos visible en header (top right) en ambas tiradas

### Historial de consultas
- `oracle.js` y `oracle-cruz.js` guardan cada consulta en tabla `consultas` (pregunta, cartas, respuesta_ia, tipo)
- `HistorialDrawer.jsx`: drawer desde la derecha, lista por fecha, expandible con imágenes de cartas y respuesta
- Botón "LECTURAS" en header de ambas tiradas (App.jsx y TiradaCruz.jsx)

### Privacidad
- `PrivacidadModal.jsx`: drawer con política de privacidad completa a nombre de Santosh
- Texto "Tus lecturas son privadas" + link en pantalla de registro (solo visible en tab CREAR CUENTA)

## Schema real de Supabase
**usuarios:** id, email, plan, creditos_restantes, creditos_vencen_en, fecha_registro, codigo_mazo_canjeado
**consultas:** id, usuario_id, tipo, cartas (jsonb), pregunta, respuesta_ia, fecha
**transacciones:** id, usuario_id, monto, creditos_agregados, stripe_payment_id, fecha, estado (para Stripe)

## Cómo recargar créditos a testers
```sql
UPDATE public.usuarios
SET creditos_restantes = 10, creditos_vencen_en = NOW() + INTERVAL '30 days'
WHERE email = 'email-del-tester@gmail.com';
```

## Imágenes de cartas
- Están en `public/images/cards/`
- Arcanos mayores: arcano-00 a arcano-21 (faltan algunos — pendiente próxima sesión)
- Arcanos menores: palos Bastos, Copas, Espadas, Oros (figuras de corte + algunos números)
- **Próxima sesión: generar cartas faltantes y subir todas las imágenes**

## Pendientes conocidos
- Cartas faltantes en `public/images/cards/` — trabajo de la próxima sesión
- Email de contacto de privacidad temporal (numero170@gmail.com) — reemplazar cuando haya email del TDM
- `transacciones` no registra uso de créditos (intencional, tabla es para Stripe)
- Confirmación de email desactivada en Supabase (intencional para etapa de testers)
