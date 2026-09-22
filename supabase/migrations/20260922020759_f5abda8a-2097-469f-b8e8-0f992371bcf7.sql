-- 1. projects: add publish flag and gate public reads
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
DROP POLICY IF EXISTS "Projects public read" ON public.projects;
CREATE POLICY "Projects public read published" ON public.projects
  FOR SELECT TO anon, authenticated
  USING (is_published = true AND status <> 'draft');

-- 2. skills: add publish flag and gate public reads
ALTER TABLE public.skills ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
DROP POLICY IF EXISTS "Skills public read" ON public.skills;
CREATE POLICY "Skills public read published" ON public.skills
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- 3. success_photos: add publish flag and gate public reads
ALTER TABLE public.success_photos ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT true;
DROP POLICY IF EXISTS "Photos public read" ON public.success_photos;
CREATE POLICY "Photos public read published" ON public.success_photos
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- 4. media_assets: internal admin library only, remove public read
DROP POLICY IF EXISTS "Public read media" ON public.media_assets;
REVOKE SELECT ON public.media_assets FROM anon;

-- 5. profiles: anonymous visitors may only see the portfolio owner's profile
DROP POLICY IF EXISTS "Profiles anon read non-sensitive" ON public.profiles;
CREATE POLICY "Profiles anon read owner only" ON public.profiles
  FOR SELECT TO anon
  USING (public.is_owner_email(email));
GRANT EXECUTE ON FUNCTION public.is_owner_email(text) TO anon, authenticated;

-- 6. portfolio_views: validate anonymous analytics inserts
DROP POLICY IF EXISTS "Anyone can record view" ON public.portfolio_views;
CREATE POLICY "Public records validated view" ON public.portfolio_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    page IS NOT NULL
    AND length(page) BETWEEN 1 AND 200
    AND (referrer IS NULL OR length(referrer) <= 500)
    AND (user_agent IS NULL OR length(user_agent) <= 500)
    AND (share_token IS NULL OR length(share_token) <= 100)
  );

-- 7. contact_messages: validate anonymous submissions
DROP POLICY IF EXISTS "Anyone can submit message" ON public.contact_messages;
CREATE POLICY "Public submits validated message" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(btrim(name)) BETWEEN 1 AND 100
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (subject IS NULL OR length(subject) <= 200)
    AND length(btrim(message)) BETWEEN 1 AND 2000
    AND is_read = false
  );

-- 8. storage: keep public listing to public buckets, excluding private/ prefixes
DROP POLICY IF EXISTS "Public read media objects" ON storage.objects;
CREATE POLICY "Public read media objects" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = ANY (ARRAY['public-assets','media','branding','success-photos'])
    AND (storage.foldername(name))[1] IS DISTINCT FROM 'private'
  );