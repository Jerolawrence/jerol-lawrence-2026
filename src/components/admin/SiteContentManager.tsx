import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  key: string;
  title: string | null;
  content: string | null;
  is_published: boolean;
};

export function SiteContentManager() {
  const [items, setItems] = useState<Row[]>([]);
  const [draft, setDraft] = useState({ key: "", title: "", content: "" });

  const load = async () => {
    const { data } = await supabase.from("site_content").select("*").order("key");
    setItems((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.key.trim()) return toast.error("Key required (e.g. hero_tagline)");
    const { error } = await supabase.from("site_content").insert({
      key: draft.key.trim(),
      title: draft.title.trim() || null,
      content: draft.content || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Content block added");
    setDraft({ key: "", title: "", content: "" });
    load();
  };

  const update = (id: string, patch: Partial<Row>) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (row: Row) => {
    const { error } = await supabase.from("site_content").update({
      title: row.title, content: row.content, is_published: row.is_published,
    }).eq("id", row.id);
    if (error) toast.error(error.message); else toast.success("Published");
  };

  const togglePublish = async (id: string, v: boolean) => {
    update(id, { is_published: v });
    await supabase.from("site_content").update({ is_published: v }).eq("id", id);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this content block?")) return;
    await supabase.from("site_content").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-base font-semibold text-foreground">Add Content Block</h3>
        <p className="mt-1 text-xs text-muted-foreground">Editable text used across the site (e.g. <code>hero_tagline</code>, <code>about_intro</code>, <code>footer_note</code>).</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input placeholder="Key (unique, e.g. hero_tagline)" value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Title (optional)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Content" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} rows={3} className="sm:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <Button className="mt-4" variant="hero" onClick={add}><Plus className="h-4 w-4" /> Add Block</Button>
      </div>

      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <code className="text-xs text-primary">{r.key}</code>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Switch checked={r.is_published} onCheckedChange={(v) => togglePublish(r.id, v)} />
                  {r.is_published ? "Published" : "Draft"}
                </label>
                <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <input value={r.title ?? ""} onChange={(e) => update(r.id, { title: e.target.value })} placeholder="Title" className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <textarea value={r.content ?? ""} onChange={(e) => update(r.id, { content: e.target.value })} rows={3} className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => save(r)}><Save className="h-3.5 w-3.5" /> Save</Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No content blocks yet.</p>}
      </div>
    </div>
  );
}
