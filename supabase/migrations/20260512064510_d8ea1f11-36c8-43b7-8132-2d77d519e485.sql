
-- ============ site_settings ============
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb,
  is_public boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read public settings" ON public.site_settings
  FOR SELECT USING (is_public = true);
CREATE POLICY "Admins read all settings" ON public.site_settings
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_settings (key, value) VALUES
  ('branding', '{"logo_url":null,"site_name":"Jerol Lawrence","tagline":"Web Developer · Software Engineer · IT Specialist"}'::jsonb),
  ('theme', '{"primary":"#3B82F6","mode":"light","font":"Inter"}'::jsonb),
  ('seo', '{"title":"Jerol Lawrence — Portfolio","description":"Professional portfolio of Jerol Lawrence — Web Developer, Software Engineer, IT Specialist from Papua New Guinea.","og_image":null}'::jsonb),
  ('sections', '{"hero":true,"banners":true,"projects":true,"skills":true,"about":true,"contact":true,"gallery":true}'::jsonb),
  ('social', '{"github":"","linkedin":"","twitter":"","facebook":"","instagram":"","youtube":""}'::jsonb);

-- ============ banners ============
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  subtitle text,
  image_url text NOT NULL,
  cta_label text,
  cta_url text,
  is_enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read enabled banners" ON public.banners
  FOR SELECT USING (is_enabled = true);
CREATE POLICY "Admins read all banners" ON public.banners
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage banners" ON public.banners
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_banners_updated BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ media_assets ============
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket text NOT NULL DEFAULT 'media',
  storage_path text NOT NULL,
  public_url text NOT NULL,
  filename text NOT NULL,
  mime_type text,
  size_bytes bigint,
  kind text NOT NULL DEFAULT 'image',
  alt_text text,
  tags text[] DEFAULT '{}',
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX media_assets_kind_idx ON public.media_assets (kind, created_at DESC);
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read media" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admins manage media" ON public.media_assets
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ activity_log ============
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  target_type text,
  target_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX activity_log_created_idx ON public.activity_log (created_at DESC);
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read activity" ON public.activity_log
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins insert activity" ON public.activity_log
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);

-- ============ user_roles admin management ============
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============ Storage buckets ============
INSERT INTO storage.buckets (id, name, public) VALUES
  ('media', 'media', true),
  ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media public read" ON storage.objects
  FOR SELECT USING (bucket_id IN ('media','branding'));
CREATE POLICY "Admins upload media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id IN ('media','branding') AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('media','branding') AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('media','branding') AND has_role(auth.uid(), 'admin'::app_role));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.media_assets;
