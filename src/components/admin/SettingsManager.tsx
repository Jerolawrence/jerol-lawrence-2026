import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

type Row = { key: string; value: Record<string, unknown> };

export function SettingsManager() {
  const [s, setS] = useState<Record<string, Record<string, unknown>>>({});
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("key,value");
    const m: Record<string, Record<string, unknown>> = {};
    (data as Row[] ?? []).forEach((r) => { m[r.key] = (r.value as Record<string, unknown>) ?? {}; });
    setS(m);
  };
  useEffect(() => { load(); }, []);

  const upd = (key: string, patch: Record<string, unknown>) =>
    setS((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), ...patch } }));

  const save = async (key: string) => {
    setBusy(true);
    const { error } = await supabase.from("site_settings").update({ value: s[key] as never }).eq("key", key);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    logActivity("settings.update", "site_settings", key, s[key]);
  };

  const uploadLogo = async (file: File) => {
    setBusy(true);
    const path = `logo-${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("branding").upload(path, file, { upsert: true });
    if (upErr) { setBusy(false); return toast.error(upErr.message); }
    const { data } = supabase.storage.from("branding").getPublicUrl(path);
    upd("branding", { logo_url: data.publicUrl });
    await supabase.from("site_settings").update({ value: { ...(s.branding ?? {}), logo_url: data.publicUrl } as never }).eq("key", "branding");
    setBusy(false);
    toast.success("Logo updated");
    logActivity("branding.logo_upload", "branding", null as unknown as string, { url: data.publicUrl });
  };

  const branding = (s.branding ?? {}) as { logo_url?: string; site_name?: string; tagline?: string };
  const theme = (s.theme ?? {}) as { primary?: string; mode?: string; font?: string };
  const seo = (s.seo ?? {}) as { title?: string; description?: string; og_image?: string };
  const sections = (s.sections ?? {}) as Record<string, boolean>;
  const social = (s.social ?? {}) as Record<string, string>;

  const Card = ({ title, children, onSave }: { title: string; children: React.ReactNode; onSave: () => void }) => (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-foreground">{title}</h3>
        <Button size="sm" variant="outline" onClick={onSave} disabled={busy}><Save className="h-3.5 w-3.5" /> Save</Button>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );

  const input = (val: string, onChange: (v: string) => void, placeholder?: string) => (
    <input value={val ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Branding" onSave={() => save("branding")}>
        <div>
          <label className="text-xs text-muted-foreground">Site name</label>
          {input(branding.site_name ?? "", (v) => upd("branding", { site_name: v }))}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Tagline</label>
          {input(branding.tagline ?? "", (v) => upd("branding", { tagline: v }))}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Logo</label>
          <div className="mt-2 flex items-center gap-3">
            {branding.logo_url ? (
              <img src={branding.logo_url} alt="logo" className="h-12 w-12 rounded-lg border border-border object-contain bg-background" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-muted"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
              <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent"><Upload className="h-3.5 w-3.5" /> Upload Logo</span>
            </label>
          </div>
        </div>
      </Card>

      <Card title="Theme & Appearance" onSave={() => save("theme")}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Primary color</label>
            <div className="mt-1 flex items-center gap-2">
              <input type="color" value={theme.primary ?? "#3B82F6"} onChange={(e) => upd("theme", { primary: e.target.value })} className="h-9 w-12 rounded cursor-pointer" />
              {input(theme.primary ?? "", (v) => upd("theme", { primary: v }))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Font</label>
            <select value={theme.font ?? "Inter"} onChange={(e) => upd("theme", { font: e.target.value })} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              {["Inter","Roboto","Poppins","Montserrat","Open Sans","Lato","System"].map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={theme.mode === "dark"} onCheckedChange={(v) => upd("theme", { mode: v ? "dark" : "light" })} />
          Dark mode by default
        </label>
      </Card>

      <Card title="SEO Defaults" onSave={() => save("seo")}>
        <div>
          <label className="text-xs text-muted-foreground">Title</label>
          {input(seo.title ?? "", (v) => upd("seo", { title: v }))}
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Meta description</label>
          <textarea value={seo.description ?? ""} onChange={(e) => upd("seo", { description: e.target.value })} rows={3} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Open Graph image URL</label>
          {input(seo.og_image ?? "", (v) => upd("seo", { og_image: v }))}
        </div>
      </Card>

      <Card title="Section Visibility" onSave={() => save("sections")}>
        <p className="text-xs text-muted-foreground">Toggle sections on/off across the live site.</p>
        <div className="grid grid-cols-2 gap-2">
          {["hero","banners","projects","skills","about","contact","gallery"].map((k) => (
            <label key={k} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm capitalize">
              {k}
              <Switch checked={sections[k] !== false} onCheckedChange={(v) => upd("sections", { [k]: v })} />
            </label>
          ))}
        </div>
      </Card>

      <Card title="Social Links" onSave={() => save("social")}>
        {["github","linkedin","twitter","facebook","instagram","youtube"].map((k) => (
          <div key={k}>
            <label className="text-xs text-muted-foreground capitalize">{k}</label>
            {input(social[k] ?? "", (v) => upd("social", { [k]: v }), `https://${k}.com/...`)}
          </div>
        ))}
      </Card>
    </div>
  );
}
