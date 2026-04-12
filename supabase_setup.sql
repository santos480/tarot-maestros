-- ============================================================
-- TAROT DE LOS MAESTROS — Setup Supabase (ejecutar en orden)
-- Pegar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. TABLA USUARIOS
-- (si ya existe con otras columnas, usar ALTER TABLE en su lugar)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id                   UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email                TEXT NOT NULL,
  creditos             INTEGER NOT NULL DEFAULT 5,
  creditos_expiran_en  TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  plan                 TEXT DEFAULT 'explorador',
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios_ver_propio" ON public.usuarios
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "usuarios_actualizar_propio" ON public.usuarios
  FOR UPDATE USING (auth.uid() = id);


-- 2. TABLA CONSULTAS
CREATE TABLE IF NOT EXISTS public.consultas (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id  UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL DEFAULT '3cartas',
  cartas      JSONB,
  pregunta    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.consultas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consultas_propias" ON public.consultas
  FOR ALL USING (auth.uid() = usuario_id);


-- 3. TABLA TRANSACCIONES
CREATE TABLE IF NOT EXISTS public.transacciones (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id  UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
  tipo        TEXT NOT NULL,   -- 'bienvenida' | 'consulta' | 'compra' | 'qr_mazo'
  cantidad    INTEGER NOT NULL, -- positivo = suma, negativo = descuenta
  descripcion TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
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

  -- Verificar vencimiento solo si la fecha está seteada
  IF v_usuario.creditos_expiran_en IS NOT NULL
     AND v_usuario.creditos_expiran_en < NOW() THEN
    UPDATE public.usuarios SET creditos = 0 WHERE id = p_usuario_id;
    RETURN jsonb_build_object('ok', false, 'error', 'creditos_vencidos', 'creditos', 0);
  END IF;

  IF v_usuario.creditos <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'error', 'sin_creditos', 'creditos', 0);
  END IF;

  UPDATE public.usuarios
  SET creditos = creditos - 1
  WHERE id = p_usuario_id;

  RETURN jsonb_build_object('ok', true, 'creditos', v_usuario.creditos - 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. TRIGGER: crear usuario automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, creditos, creditos_expiran_en)
  VALUES (
    NEW.id,
    NEW.email,
    5,
    NOW() + INTERVAL '30 days'
  );

  INSERT INTO public.transacciones (usuario_id, tipo, cantidad, descripcion)
  VALUES (
    NEW.id,
    'bienvenida',
    5,
    '5 créditos de bienvenida — válidos 30 días'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
