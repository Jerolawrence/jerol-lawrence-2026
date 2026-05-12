import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Copy, Download, Search, FileText, Film, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity";

type Asset = {
  id: string;
  storage_path: string;
  public_url: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  kind: string;
  alt_text: string | null;
  created_at: string;
};

const kindOf = (mime: string) => mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : mime === "application/pdf" ? "pdf" : "file";

export function MediaLibrary({ userId }: { userId: string }) {
  const [items, setItems] = useState<Asset[]>([]);
  const [filter, setFilter] = useState<"all"|"image"|"video"|"pdf"|"file">("all");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("media_assets").select("*").order("created_at", { ascending: false });
    setItems((data as Asset[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (files: FileList) => {
    setBusy(true);
    for (const file of Array.from(files)) {
      const path = `library/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      const url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
      const kind = kindOf(file.type || "");
      const { error } = await supabase.from("media_assets").insert({
        bucket: "media", storage_path: path, public_url: url,
        filename: file.name, mime_type: file.type, size_bytes: file.size, kind, uploaded_by: userId,
      });
      if (error) toast.error(error.message);
      else logActivity("media.upload", "media_assets", null as unknown as string, { filename: file.name, kind });
    }
    setBusy(false);
    toast.success("Upload complete");
    load();
  };

  const remove = async (a: Asset) => {
    if (!confirm(`Delete ${a.filename}?`)) return;
    await supabase.storage.from(a.storage_path.startsWith("logo-") ? "branding" : "media").remove([a.storage_path]);
    await supabase.from("media_assets").delete().eq("id", a.id);
    logActivity("media.delete", "media_assets", a.id, { filename: a.filename });
    load();
  };

  const copy = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied"); };

  const filtered = items.filter((a) =>
    (filter === "all" || a.kind === filter) &&
    (q === "" || a.filename.toLowerCase().includes(q.toLowerCase()))
  );

  const Icon = ({ kind }: { kind: string }) => kind === "video" ? <Film className="h-5 w-5" /> : kind === "pdf" ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <input type="file" multiple accept="image/*,video/*,application/pdf" hidden disabled={busy} onChange={(e) => e.target.files && upload(e.target.files)} />
          <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Upload Files"}
        </label>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search filename…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        <div className="flex gap-1">
          {(["all","image","video","pdf","file"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${filter === f ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent"}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {a.kind === "image" ? (
                <img src={a.public_url} alt={a.alt_text ?? a.filename} className="h-full w-full object-cover" />
              ) : a.kind === "video" ? (
                <video src={a.public_url} className="h-full w-full" controls />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground"><Icon kind={a.kind} /><span className="text-xs">{a.kind.toUpperCase()}</span></div>
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-medium text-card-foreground" title={a.filename}>{a.filename}</p>
              <p className="text-[10px] text-muted-foreground">{a.size_bytes ? `${(a.size_bytes/1024).toFixed(0)} KB` : ""}</p>
              <div className="mt-2 flex items-center gap-1">
                <Button size="sm" variant="outline" onClick={() => copy(a.public_url)} className="h-7 px-2"><Copy className="h-3 w-3" /></Button>
                <a href={a.public_url} download={a.filename} className="inline-flex h-7 items-center rounded-md border border-border px-2 text-xs hover:bg-accent"><Download className="h-3 w-3" /></a>
                <button onClick={() => remove(a)} className="ml-auto text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground col-span-full">No files yet.</p>}
      </div>
    </div>
  );
}
