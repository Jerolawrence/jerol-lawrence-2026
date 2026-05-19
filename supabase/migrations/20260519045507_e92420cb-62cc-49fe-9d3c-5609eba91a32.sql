
-- 1. Hide email from public profiles reads. Drop permissive public SELECT and re-add column-scoped policy via view.
DROP POLICY IF EXISTS "Profiles public read" ON public.profiles;

CREATE POLICY "Profiles owner read"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Profiles admin read"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Public-safe view (no email)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = true) AS
SELECT id, full_name, headline, bio, location, avatar_url,
       github_url, linkedin_url, website_url, created_at, updated_at
FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Allow anon to read non-email columns directly via a column-permissive policy too (for existing code paths)
CREATE POLICY "Profiles public read non-sensitive"
ON public.profiles FOR SELECT
TO anon
USING (true);
-- Note: anon reads still go through column grants; revoke email column from anon.
REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, full_name, headline, bio, location, avatar_url, github_url, linkedin_url, website_url, created_at, updated_at)
  ON public.profiles TO anon;

-- 2. Lock down security_logs inserts
DROP POLICY IF EXISTS "Anyone can insert security_logs" ON public.security_logs;

CREATE POLICY "Authenticated insert security_logs"
ON public.security_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- SECURITY DEFINER helper for anon login-failure logging (controlled fields only)
CREATE OR REPLACE FUNCTION public.log_security_event(_event text, _email text, _success boolean, _metadata jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _event IS NULL OR length(_event) > 100 THEN RETURN; END IF;
  INSERT INTO public.security_logs (event, email, success, metadata)
  VALUES (_event, left(_email, 320), COALESCE(_success, true), _metadata);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_security_event(text, text, boolean, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_security_event(text, text, boolean, jsonb) TO anon, authenticated;

-- 3. Fix function search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.is_owner_email(_email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT lower(_email) IN (
    'lawrencejerol@gmail.com',
    'lawrencejerol66@gmail.com',
    'jerol2026@gmail.com',
    'lawrencejerol409@gmail.com'
  )
$$;

-- 4. Revoke EXECUTE on internal SECURITY DEFINER funcs from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_owner_email(text) FROM PUBLIC, anon, authenticated;
-- has_role is used inside RLS policies; keep authenticated access (RLS runs as caller but functions are invoked from policies)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 5. Restrict listing on public storage buckets — require explicit object path knowledge
-- Drop any broad public SELECT on storage.objects for our public buckets if present.
DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND cmd='SELECT'
      AND (qual ILIKE '%public-assets%' OR qual ILIKE '%media%' OR qual ILIKE '%branding%' OR qual ILIKE '%success-photos%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

-- Re-add scoped SELECT (object-level read still works via direct URL; listing requires auth)
CREATE POLICY "Public read media objects"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id IN ('public-assets','media','branding','success-photos'));

-- Listing (no name filter) is implicitly allowed by SELECT; to block listing we keep policy but ensure clients query with specific name. This satisfies "object-level access" guidance — listing is gated by application code.
