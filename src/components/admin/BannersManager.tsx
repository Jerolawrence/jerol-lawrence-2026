import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  cta_label: string | null;
  cta_url: string | null;
  is_enabled: boolean;
  sort_order: number;
};

export function BannersManager() {
  const [items, setItems] = useState<Banner[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("banners").select("*").order("sort_order");
    setItems((data as Banner[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const path = `banners/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast.error(error.message); return null; }
    return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  };

  const addBanner = async (file: File) => {
    setBusy(true);
    const url = await uploadFile(file);
    if (!url) { setBusy(false); return; }
    const { data, error } = await supabase.from("banners").insert({ image_url: url, sort_order: items.length, title: file.name }).select().single();
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Banner added");
    logActivity("banner.create", "banners", data?.id);
    load();
  };

  const update = (id: string, patch: Partial<Banner>) => setItems((p) => p.map((b) => b.id === id ? { ...b, ...patch } : b));

  const save = async (b: Banner) => {
    const { error } = await supabase.from("banners").update({
      title: b.title, subtitle: b.subtitle, cta_label: b.cta_label, cta_url: b.cta_url, sort_order: b.sort_order,
    }).eq("id", b.id);
    if (error) toast.error(error.message); else { toast.success("Saved"); logActivity("banner.update", "banners", b.id); }
  };

  const toggle = async (b: Banner, v: boolean) => {
    update(b.id, { is_enabled: v });
    await supabase.from("banners").update({ is_enabled: v }).eq("id", b.id);
    logActivity(v ? "banner.enable" : "banner.disable", "banners", b.id);
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setItems(next);
    await Promise.all(next.map((b, i) => supabase.from("banners").update({ sort_order: i }).eq("id", b.id)));
  };

  const remove = async (b: Banner) => {
    if (!confirm("Delete this banner?")) return;
    await supabase.from("banners").delete().eq("id", b.id);
    logActivity("banner.delete", "banners", b.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-base font-semibold text-foreground">Add Banner / Slider Image</h3>
        <p className="mt-1 text-xs text-muted-foreground">Recommended 1920×800. Shown on the home page hero slider.</p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <input type="file" accept="image/*" hidden disabled={busy} onChange={(e) => { const f = e.target.files?.[0]; if (f) addBanner(f); }} />
          <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload Image"}
        </label>
      </div>

      <div className="space-y-3">
        {items.map((b, i) => (
          <div key={b.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex gap-4">
              <img src={b.image_url} alt={b.title ?? ""} className="h-24 w-40 shrink-0 rounded-lg border border-border object-cover" />
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <input value={b.title ?? ""} onChange={(e) => update(b.id, { title: e.target.value })} placeholder="Title" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <input value={b.subtitle ?? ""} onChange={(e) => update(b.id, { subtitle: e.target.value })} placeholder="Subtitle" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <input value={b.cta_label ?? ""} onChange={(e) => update(b.id, { cta_label: e.target.value })} placeholder="CTA label (e.g. Learn More)" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
                <input value={b.cta_url ?? ""} onChange={(e) => update(b.id, { cta_url: e.target.value })} placeholder="CTA URL" className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={b.is_enabled} onCheckedChange={(v) => toggle(b, v)} /> Live
              </label>
              <button onClick={() => move(i, -1)} className="rounded p-1 text-muted-foreground hover:bg-accent" title="Move up"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} className="rounded p-1 text-muted-foreground hover:bg-accent" title="Move down"><ArrowDown className="h-4 w-4" /></button>
              <a href={b.image_url} download className="text-xs text-primary hover:underline">Download</a>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => save(b)}><Save className="h-3.5 w-3.5" /> Save</Button>
                <button onClick={() => remove(b)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No banners yet — upload your first.</p>}
      </div>
    </div>
  );
}
