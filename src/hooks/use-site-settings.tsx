import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Branding = { logo_url: string | null; site_name: string; tagline: string };
export type Theme = { primary: string; mode: "light" | "dark"; font: string };
export type Seo = { title: string; description: string; og_image: string | null };
export type Sections = Record<string, boolean>;
export type Social = Record<string, string>;

export type SettingsMap = {
  branding: Branding;
  theme: Theme;
  seo: Seo;
  sections: Sections;
  social: Social;
};

const defaults: SettingsMap = {
  branding: { logo_url: null, site_name: "Jerol Lawrence", tagline: "" },
  theme: { primary: "#3B82F6", mode: "light", font: "Inter" },
  seo: { title: "Jerol Lawrence", description: "", og_image: null },
  sections: { hero: true, banners: true, projects: true, skills: true, about: true, contact: true, gallery: true },
  social: {},
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SettingsMap>(defaults);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("key,value");
    const map = { ...defaults };
    (data ?? []).forEach((r: { key: string; value: unknown }) => {
      (map as Record<string, unknown>)[r.key] = { ...(defaults as Record<string, unknown>)[r.key] as object, ...(r.value as object) };
    });
    setSettings(map);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("site_settings_all")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return settings;
}

/** Apply branding + theme to document root */
export function useApplyTheme() {
  const settings = useSiteSettings();
  useEffect(() => {
    if (typeof document === "undefined") return;
    const { theme, branding, seo } = settings;
    document.documentElement.classList.toggle("dark", theme.mode === "dark");
    if (theme.primary) document.documentElement.style.setProperty("--brand-primary", theme.primary);
    if (theme.font) document.documentElement.style.setProperty("--brand-font", theme.font);
    if (branding.site_name) document.title = seo.title || branding.site_name;
  }, [settings]);
  return settings;
}
