
-- 1) Restrict anon read on profiles to non-sensitive columns only
DROP POLICY IF EXISTS "Profiles public read non-sensitive" ON public.profiles;

REVOKE SELECT ON public.profiles FROM anon;
GRANT SELECT (id, full_name, headline, bio, location, avatar_url, website_url, github_url, linkedin_url)
  ON public.profiles TO anon;

CREATE POLICY "Profiles anon read non-sensitive"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);

-- 2) Restrict activity_log inserts to admins only
DROP POLICY IF EXISTS "Admins insert activity" ON public.activity_log;
CREATE POLICY "Admins insert activity"
  ON public.activity_log FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) AND auth.uid() = actor_id);

-- 3) Remove broad authenticated insert on security_logs; rely on log_security_event SECURITY DEFINER
DROP POLICY IF EXISTS "Authenticated insert security_logs" ON public.security_logs;
