
-- Update owner email allowlist
CREATE OR REPLACE FUNCTION public.is_owner_email(_email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(_email) IN (
    'lawrencejerol@gmail.com',
    'lawrencejerol66@gmail.com',
    'jerol2026@gmail.com',
    'lawrencejerol409@gmail.com'
  )
$$;

-- Promote any existing matching users to admin
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE public.is_owner_email(u.email)
ON CONFLICT DO NOTHING;

-- Success photos table
CREATE TABLE public.success_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  caption text,
  image_url text NOT NULL,
  storage_path text,
  sort_order int NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.success_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos public read"
  ON public.success_photos FOR SELECT
  USING (true);

CREATE POLICY "Admins manage photos"
  ON public.success_photos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_success_photos_updated
  BEFORE UPDATE ON public.success_photos
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Public storage bucket for success photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('success-photos', 'success-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Success photos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'success-photos');

CREATE POLICY "Admins upload success photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'success-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update success photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'success-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete success photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'success-photos' AND public.has_role(auth.uid(), 'admin'));
