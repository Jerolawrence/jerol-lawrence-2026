import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  type: string;
  label: string;
  value: string;
  url: string | null;
  icon: string | null;
  is_enabled: boolean;
  show_in_footer: boolean;
  show_on_contact_page: boolean;
  sort_order: number;
};

const TYPES = ["email", "phone", "whatsapp", "address", "map", "linkedin", "github", "twitter", "facebook", "instagram", "youtube", "support", "other"];
const ICONS = ["Mail", "Phone", "MessageCircle", "MapPin", "Map", "Linkedin", "Github", "Twitter", "Facebook", "Instagram", "Youtube", "LifeBuoy", "Globe"];

export function SiteContactsManager() {
  const [items, setItems] = useState<Row[]>([]);
  const [draft, setDraft] = useState({ type: "email", label: "", value: "", url: "", icon: "Mail" });

  const load = async () => {
    const { data } = await supabase.from("site_contacts").select("*").order("sort_order");
    setItems((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.label.trim() || !draft.value.trim()) return toast.error("Label and value required");
    const { error } = await supabase.from("site_contacts").insert({
      type: draft.type,
      label: draft.label.trim(),
      value: draft.value.trim(),
      url: draft.url.trim() || null,
      icon: draft.icon || null,
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    toast.success("Contact added — live now");
    setDraft({ type: "email", label: "", value: "", url: "", icon: "Mail" });
    load();
  };

  const update = async (id: string, patch: Partial<Row>) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const { error } = await supabase.from("site_contacts").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };

  const saveRow = async (row: Row) => {
    const { error } = await supabase.from("site_contacts").update({
      type: row.type, label: row.label, value: row.value, url: row.url, icon: row.icon, sort_order: row.sort_order,
    }).eq("id", row.id);
    if (error) toast.error(error.message); else toast.success("Saved");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    const { error } = await supabase.from("site_contacts").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-base font-semibold text-foreground">Add Contact Detail</h3>
        <p className="mt-1 text-xs text-muted-foreground">Phone, email, WhatsApp, social, address, map link, support — anything you want shown on the live site.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <input placeholder="Label (e.g. Primary Email)" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Value (shown text)" value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Link URL (optional)" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} className="sm:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <Button className="mt-4" variant="hero" onClick={add}><Plus className="h-4 w-4" /> Add Contact</Button>
      </div>

      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-3 lg:grid-cols-12">
              <select value={r.type} onChange={(e) => update(r.id, { type: e.target.value })} className="lg:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={r.icon ?? ""} onChange={(e) => update(r.id, { icon: e.target.value })} className="lg:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">No icon</option>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
              <input value={r.label} onChange={(e) => update(r.id, { label: e.target.value })} placeholder="Label" className="lg:col-span-3 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <input value={r.value} onChange={(e) => update(r.id, { value: e.target.value })} placeholder="Value" className="lg:col-span-3 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
              <input value={r.url ?? ""} onChange={(e) => update(r.id, { url: e.target.value })} placeholder="URL" className="lg:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={r.is_enabled} onCheckedChange={(v) => update(r.id, { is_enabled: v })} />
                <span className={r.is_enabled ? "text-foreground font-medium" : ""}>Live</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={r.show_in_footer} onCheckedChange={(v) => update(r.id, { show_in_footer: v })} />
                Footer
              </label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={r.show_on_contact_page} onCheckedChange={(v) => update(r.id, { show_on_contact_page: v })} />
                Contact page
              </label>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => saveRow(r)}><Save className="h-3.5 w-3.5" /> Save</Button>
                <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No contacts yet — add your first above.</p>}
      </div>
    </div>
  );
}
