import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Trash2, ImagePlus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/about_/gallery")({
  head: () => ({
    meta: [
      { title: "Success Gallery — Jerol Lawrence" },
      { name: "description", content: "Photo highlights and milestones from Jerol Lawrence's professional journey." },
      { property: "og:title", content: "Success Gallery — Jerol Lawrence" },
      { property: "og:description", content: "A visual record of achievements, events, and milestones." },
    ],
  }),
  component: GalleryPage,
});

interface Photo {
  id: string;
  title: string | null;
  caption: string | null;
  image_url: string;
  storage_path: string | null;
  created_at: string;
}

function GalleryPage() {
  const { isAdmin } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("success_photos")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setPhotos((data ?? []) as Photo[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Choose an image first.");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("success-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("success-photos").getPublicUrl(path);
      const { error: insErr } = await supabase.from("success_photos").insert({
        title: title || null,
        caption: caption || null,
        image_url: pub.publicUrl,
        storage_path: path,
      });
      if (insErr) throw insErr;
      toast.success("Photo uploaded.");
      setTitle("");
      setCaption("");
      setFile(null);
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm("Delete this photo?")) return;
    try {
      if (photo.storage_path) {
        await supabase.storage.from("success-photos").remove([photo.storage_path]);
      }
      const { error } = await supabase.from("success_photos").delete().eq("id", photo.id);
      if (error) throw error;
      toast.success("Photo deleted.");
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to="/about"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to About
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
          >
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Success Gallery
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Moments, milestones, and memories from my professional journey.
            </p>
          </motion.div>

          {isAdmin && (
            <motion.form
              onSubmit={handleUpload}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-4">
                <ImagePlus className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold text-card-foreground">
                  Upload a new photo
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Graduation day"
                  />
                </div>
                <div>
                  <Label htmlFor="file">Image</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="caption">Caption</Label>
                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="A short description of this moment…"
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={uploading} variant="hero">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading…" : "Upload Photo"}
                </Button>
              </div>
            </motion.form>
          )}

          <div className="mt-12">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading…</p>
            ) : photos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No photos yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {photos.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={p.image_url}
                        alt={p.title ?? "Success photo"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {(p.title || p.caption) && (
                      <div className="p-4">
                        {p.title && (
                          <h3 className="font-heading font-semibold text-card-foreground">
                            {p.title}
                          </h3>
                        )}
                        {p.caption && (
                          <p className="mt-1 text-sm text-muted-foreground">{p.caption}</p>
                        )}
                      </div>
                    )}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(p)}
                        className="absolute top-2 right-2 rounded-md bg-background/90 p-2 text-destructive opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Delete photo"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
