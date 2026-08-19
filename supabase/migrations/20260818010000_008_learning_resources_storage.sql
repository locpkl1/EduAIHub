-- Public PDF bucket for admin-managed learning resources.
-- Apply through the normal Supabase migration workflow. Do not place
-- copyrighted textbook files here without permission.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'learning-resources',
  'learning-resources',
  true,
  20971520,
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can read learning resource PDFs" ON storage.objects;
CREATE POLICY "Public can read learning resource PDFs"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'learning-resources');

DROP POLICY IF EXISTS "Admins can upload own learning resource PDFs" ON storage.objects;
CREATE POLICY "Admins can upload own learning resource PDFs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'learning-resources'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'resources'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND lower(storage.extension(name)) = 'pdf'
  );

DROP POLICY IF EXISTS "Admins can update own learning resource PDFs" ON storage.objects;
CREATE POLICY "Admins can update own learning resource PDFs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'learning-resources'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'resources'
    AND (storage.foldername(name))[2] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'learning-resources'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'resources'
    AND (storage.foldername(name))[2] = auth.uid()::text
    AND lower(storage.extension(name)) = 'pdf'
  );

DROP POLICY IF EXISTS "Admins can delete own learning resource PDFs" ON storage.objects;
CREATE POLICY "Admins can delete own learning resource PDFs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'learning-resources'
    AND public.is_admin()
    AND (storage.foldername(name))[1] = 'resources'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );
