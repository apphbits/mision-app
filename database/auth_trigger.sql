-- ====================================================================
-- MISIÓN — SUPABASE AUTH TRIGGER & PROFILE PROVISIONING
-- Crea automáticamente el perfil y racha cuando un usuario se registra
-- ====================================================================

-- 1. Función para manejar el nuevo usuario registrado en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  -- Auto-confirmar el correo para permitir inicio de sesión inmediato
  IF NEW.email_confirmed_at IS NULL THEN
    UPDATE auth.users 
    SET email_confirmed_at = now() 
    WHERE id = NEW.id;
  END IF;

  -- Crear el perfil del usuario en public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    total_impulso,
    chispas,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
    0,
    10,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  -- Inicializar el registro de racha del usuario
  INSERT INTO public.streaks (
    user_id,
    current_streak,
    best_streak,
    last_active_date,
    freezes_available,
    updated_at
  )
  VALUES (
    NEW.id,
    0,
    0,
    CURRENT_DATE,
    1,
    now()
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. Trigger en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Políticas de RLS en profiles para inserción y actualización
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
