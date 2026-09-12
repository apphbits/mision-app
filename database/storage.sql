-- ====================================================================
-- MISIÓN — SUPABASE STORAGE: BUCKET AVATARS & RLS POLICIES
-- Configuración de almacenamiento para fotos de perfil (< 500 KB)
-- ====================================================================

-- 1. Crear el bucket 'avatars' con límite estricto de 500 KB (524288 bytes) y tipos de imagen
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    524288, -- 500 KB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 524288,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- 2. Políticas de seguridad (RLS) en storage.objects
-- A. Lectura pública de avatares
DROP POLICY IF EXISTS "Public Avatars Read" ON storage.objects;
CREATE POLICY "Public Avatars Read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- B. Subida de avatar (usuarios autenticados en su propio archivo)
DROP POLICY IF EXISTS "User Can Upload Avatar" ON storage.objects;
CREATE POLICY "User Can Upload Avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- C. Actualización de avatar
DROP POLICY IF EXISTS "User Can Update Avatar" ON storage.objects;
CREATE POLICY "User Can Update Avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- D. Eliminación de avatar
DROP POLICY IF EXISTS "User Can Delete Avatar" ON storage.objects;
CREATE POLICY "User Can Delete Avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'avatars' 
    AND (auth.uid())::text = (storage.foldername(name))[1]
);
