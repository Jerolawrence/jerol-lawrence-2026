
CREATE TABLE public.site_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  label text NOT NULL,
  value text NOT NULL,
  url text,
  icon text,
  is_enabled boolean NOT NULL DEFAULT true,
  show_in_footer boolean NOT NULL DEFAULT true,
  show_on_contact_page boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads enabled contacts"
ON public.site_contacts FOR SELECT
USING (is_enabled = true);

CREATE POLICY "Admins read all contacts"
ON public.site_contacts FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage contacts"
ON public.site_contacts FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_contacts_updated
BEFORE UPDATE ON public.site_contacts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  title text,
  content text,
  content_json jsonb,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads published content"
ON public.site_content FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins read all content"
ON public.site_content FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage content"
ON public.site_content FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_site_content_updated
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_contacts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;

INSERT INTO public.site_contacts (type, label, value, url, icon, sort_order) VALUES
  ('email', 'Primary Email', 'lawrencejerol@gmail.com', 'mailto:lawrencejerol@gmail.com', 'Mail', 1),
  ('phone', 'Mobile', '+675 0000 0000', 'tel:+6750000000', 'Phone', 2),
  ('whatsapp', 'WhatsApp', '+675 0000 0000', 'https://wa.me/6750000000', 'MessageCircle', 3),
  ('linkedin', 'LinkedIn', 'Jerol Lawrence', 'https://linkedin.com', 'Linkedin', 4),
  ('github', 'GitHub', 'jerollawrence', 'https://github.com', 'Github', 5),
  ('address', 'Office', 'Papua New Guinea', NULL, 'MapPin', 6);
