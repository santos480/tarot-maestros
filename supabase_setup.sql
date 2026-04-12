-- ============================================================
-- TAROT DE LOS MAESTROS — Setup Supabase (ejecutar en orden)
-- Pegar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. TABLA USUARIOS
CREATE TABLE IF NOT EXISTS public.usuarios (
  id                    UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                 TEXT NOT NULL,
  plan                  TEXT DEFAULT 'explorador',
  creditos_restantes    INTEGER NOT NULL DEFAULT 5,
  creditos_vencen_en    TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  fecha_registro        TIMESTAMPTZ DEFAULT NOW(),
  codigo_mazo_canjeado  TEXT
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_ver_propio" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_actualizar_propio" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);


-- 2. TABLA CONSULTAS
CREATE TABLE IF NOT EXISTS public.consultas (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id   UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo         TEXT NOT NULL DEFAULT '3cartas',
  cartas       JSONB,
  pregunta     TEXT,
  respuesta_ia TEXT,
  fecha        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultas_propias" ON public.consultas
  FOR ALL USING (auth.uid() = usuario_id);


-- 3. TABLA TRANSACCIONES (pagos Stripe y recarga de créditos)
CREATE TABLE IF NOT EXISTS public.transacciones (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id          UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  monto               NUMERIC,
  creditos_agregados  INTEGER,
  stripe_payment_id   TEXT,
  fecha               TIMESTAMPTZ DEFAULT NOW(),
  estado              TEXT
);

ALTER TABLE public.transacciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transacciones_propias" ON public.transacciones
  FOR SELECT USING (auth.uid() = usuario_id);


-- 4. FUNCIÓN: usar_credito (descuenta 1 crédito atómicamente)
CREATE OR REPLACE FUNCTION public.usar_credito(p_usuario_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_usuario public.usuarios%ROWTYPE;
BEGIN
  SELECT * INTO v_usuario
  FROM public.usuarios
  WHERE id = p_usuario_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'usuario_no_encontrado');
  END IF;

  IF v_usuario.creditos_vencen_en IS NOT NULL
     AND v_usuario.creditos_vencen_en < NOW() THEN
    UPDATE public.usuarios SET creditos_restantes = 0 WHERE id = p_usuario_id;
    RETURN jsonb_build_object('ok', false, 'error', 'creditos_vencidos', 'creditos', 0);
  END IF;

  IF v_usuario.creditos_restantes <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'sin_creditos', 'creditos', 0);
  END IF;

  UPDATE public.usuarios
  SET creditos_restantes = creditos_restantes - 1
  WHERE id = p_usuario_id;

  RETURN jsonb_build_object('ok', true, 'creditos', v_usuario.creditos_restantes - 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. TRIGGER: crear usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, creditos_restantes, creditos_vencen_en)
  VALUES (
    NEW.id,
    NEW.email,
    5,
    NOW() + INTERVAL '30 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
