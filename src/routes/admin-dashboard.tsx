import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User as UserIcon,
  FolderGit2,
  Code2,
  FileText,
  Share2,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  Upload,
  Phone,
  FileEdit,
  Palette,
  Image as ImageIcon,
  Library,
  Users as UsersIcon,
  Activity,
  Menu,
} from "lucide-react";
import { SiteContactsManager } from "@/components/admin/SiteContactsManager";
import { SiteContentManager } from "@/components/admin/SiteContentManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { BannersManager } from "@/components/admin/BannersManager";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { UsersManager } from "@/components/admin/UsersManager";
import { ActivityLogPanel } from "@/components/admin/ActivityLogPanel";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Section =
  | "overview"
  | "settings"
  | "banners"
  | "media"
  | "profile"
  | "contacts"
  | "content"
  | "projects"
  | "skills"
  | "documents"
  | "sharing"
  | "messages"
  | "users"
  | "activity"
  | "analytics"
  | "security";

const sidebarGroups: {
  label: string;
  items: { id: Section; icon: typeof LayoutDashboard; label: string }[];
}[] = [
  {
    label: "Dashboard",
    items: [{ id: "overview", icon: LayoutDashboard, label: "Overview" }],
  },
  {
    label: "Content",
    items: [
      { id: "profile", icon: UserIcon, label: "Profile" },
      { id: "content", icon: FileEdit, label: "Site Content" },
      { id: "projects", icon: FolderGit2, label: "Projects" },
      { id: "skills", icon: Code2, label: "Skills" },
      { id: "documents", icon: FileText, label: "CV & Documents" },
      { id: "banners", icon: ImageIcon, label: "Banners" },
      { id: "media", icon: Library, label: "Media Library" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { id: "contacts", icon: Phone, label: "Contact Details" },
      { id: "messages", icon: Settings, label: "Messages" },
      { id: "sharing", icon: Share2, label: "Sharing" },
      { id: "analytics", icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "settings", icon: Palette, label: "Site Settings" },
      { id: "users", icon: UsersIcon, label: "Users & Roles" },
      { id: "activity", icon: Activity, label: "Activity Log" },
      { id: "security", icon: Shield, label: "Security" },
    ],
  },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/admin-portal" });
  }, [user, isAdmin, loading, navigate]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading admin portal…</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin-portal" });
  };

  const Sidebar = () => (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <Code2 className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-heading font-bold text-sidebar-foreground">Admin Portal</span>
      </div>
      <nav className="flex flex-col gap-4 p-3">
        {sidebarGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
              {group.label}
            </p>
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  section === item.id
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="mt-auto space-y-1 border-t border-sidebar-border p-3">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <ExternalLink className="h-4 w-4" /> View Portfolio
        </Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border bg-sidebar">
            <Sidebar />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 text-foreground"><Menu className="h-5 w-5" /></button>
            <h1 className="font-heading text-lg font-bold text-foreground capitalize">{section}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{user.email}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.email?.[0].toUpperCase()}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>

        <motion.div
          key={section}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 sm:p-6"
        >
          {section === "overview" && <Overview />}
          {section === "settings" && <SettingsManager />}
          {section === "banners" && <BannersManager />}
          {section === "media" && <MediaLibrary userId={user.id} />}
          {section === "profile" && <ProfileEditor userId={user.id} />}
          {section === "contacts" && <SiteContactsManager />}
          {section === "content" && <SiteContentManager />}
          {section === "users" && <UsersManager />}
          {section === "activity" && <ActivityLogPanel />}
          {section === "projects" && <ProjectsManager />}
          {section === "skills" && <SkillsManager />}
          {section === "documents" && <DocumentsManager userId={user.id} />}
          {section === "sharing" && <SharingManager />}
          {section === "messages" && <MessagesPanel />}
          {section === "analytics" && <AnalyticsPanel />}
          {section === "security" && <SecurityPanel />}
        </motion.div>
      </main>
    </div>
  );
}

/* -------------------- Overview -------------------- */
function Overview() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, links: 0, views: 0, messages: 0 });

  useEffect(() => {
    (async () => {
      const [p, s, l, v, m] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("share_links").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("portfolio_views").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      ]);
      setStats({
        projects: p.count ?? 0,
        skills: s.count ?? 0,
        links: l.count ?? 0,
        views: v.count ?? 0,
        messages: m.count ?? 0,
      });
    })();
  }, []);

  const tiles = [
    { label: "Portfolio Views", value: stats.views },
    { label: "Active Share Links", value: stats.links },
    { label: "Projects", value: stats.projects },
    { label: "Skills", value: stats.skills },
    { label: "Unread Messages", value: stats.messages },
  ];

  return (
    <div>
      <div className="rounded-xl border border-primary/20 bg-badge-bg p-6">
        <h2 className="font-heading text-xl font-bold text-foreground">Welcome back, Jerol</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your portfolio backend is live — manage projects, upload your CV, generate secure share links, and review activity below.
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{t.label}</p>
            <p className="mt-1 font-heading text-3xl font-bold text-card-foreground">{t.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Profile -------------------- */
function ProfileEditor({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle().then(({ data }) => {
      if (data) setProfile(data as Record<string, string>);
    });
  }, [userId]);

  const save = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name ?? null,
        headline: profile.headline ?? null,
        bio: profile.bio ?? null,
        location: profile.location ?? null,
        github_url: profile.github_url ?? null,
        linkedin_url: profile.linkedin_url ?? null,
        website_url: profile.website_url ?? null,
      })
      .eq("id", userId);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved");
  };

  const field = (key: string, label: string, multiline = false) => (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      {multiline ? (
        <textarea
          rows={4}
          value={profile[key] ?? ""}
          onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
        />
      ) : (
        <input
          value={profile[key] ?? ""}
          onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
        />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-4 rounded-xl border border-border bg-card p-6">
      {field("full_name", "Full Name")}
      {field("headline", "Professional Headline")}
      {field("bio", "Bio", true)}
      {field("location", "Location")}
      {field("github_url", "GitHub URL")}
      {field("linkedin_url", "LinkedIn URL")}
      {field("website_url", "Website URL")}
      <Button onClick={save} disabled={busy} variant="hero">{busy ? "Saving…" : "Save Profile"}</Button>
    </div>
  );
}

/* -------------------- Projects -------------------- */
type ProjectRow = {
  id: string;
  title: string;
  summary: string | null;
  tech_stack: string[];
  status: string;
  featured: boolean;
  demo_url: string | null;
  repo_url: string | null;
};

function ProjectsManager() {
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [draft, setDraft] = useState({ title: "", summary: "", tech_stack: "", status: "active" });

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
    setItems((data as ProjectRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.title.trim()) return;
    const { error } = await supabase.from("projects").insert({
      title: draft.title.trim(),
      summary: draft.summary.trim() || null,
      tech_stack: draft.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
      status: draft.status,
    });
    if (error) toast.error(error.message);
    else { toast.success("Project added"); setDraft({ title: "", summary: "", tech_stack: "", status: "active" }); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-base font-semibold text-foreground">Add Project</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Status (active, planning, in_development)" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Tech stack (comma separated)" value={draft.tech_stack} onChange={(e) => setDraft({ ...draft, tech_stack: e.target.value })} className="sm:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <textarea placeholder="Summary" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} className="sm:col-span-2 rounded-lg border border-input bg-background px-3 py-2 text-sm" rows={3} />
        </div>
        <Button className="mt-4" variant="hero" onClick={add}><Plus className="h-4 w-4" /> Add</Button>
      </div>

      <div className="space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
            <div>
              <p className="font-medium text-card-foreground">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.tech_stack?.join(" · ")}</p>
              {p.summary && <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>}
            </div>
            <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
      </div>
    </div>
  );
}

/* -------------------- Skills -------------------- */
type SkillRow = { id: string; name: string; category: string; level: number };
function SkillsManager() {
  const [items, setItems] = useState<SkillRow[]>([]);
  const [draft, setDraft] = useState({ name: "", category: "Frontend", level: 4 });

  const load = async () => {
    const { data } = await supabase.from("skills").select("*").order("category");
    setItems((data as SkillRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!draft.name.trim()) return;
    const { error } = await supabase.from("skills").insert(draft);
    if (error) toast.error(error.message);
    else { toast.success("Skill added"); setDraft({ name: "", category: "Frontend", level: 4 }); load(); }
  };

  const remove = async (id: string) => {
    await supabase.from("skills").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <input placeholder="Skill name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Category" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input type="number" min={1} max={5} value={draft.level} onChange={(e) => setDraft({ ...draft, level: Number(e.target.value) })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <Button className="mt-4" variant="hero" onClick={add}><Plus className="h-4 w-4" /> Add Skill</Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div>
              <p className="text-sm font-medium text-card-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.category} · Level {s.level}/5</p>
            </div>
            <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Documents -------------------- */
type DocRow = { id: string; name: string; storage_path: string; version: string | null; is_current: boolean; created_at: string };
function DocumentsManager({ userId }: { userId: string }) {
  const [items, setItems] = useState<DocRow[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    setItems((data as DocRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const path = `${userId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("documents").upload(path, file);
      if (upErr) throw upErr;
      const { error } = await supabase.from("documents").insert({
        name: file.name,
        doc_type: "cv",
        storage_path: path,
        size_bytes: file.size,
        is_current: true,
        uploaded_by: userId,
      });
      if (error) throw error;
      toast.success("Uploaded");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const download = async (path: string) => {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 60);
    if (error) toast.error(error.message);
    else if (data) window.open(data.signedUrl, "_blank");
  };

  const remove = async (id: string, path: string) => {
    await supabase.storage.from("documents").remove([path]);
    await supabase.from("documents").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground">
          <Upload className="h-4 w-4" />
          {busy ? "Uploading…" : "Upload CV / Document"}
          <input
            type="file"
            className="hidden"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
      </div>
      <div className="space-y-2">
        {items.map((d) => (
          <div key={d.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div>
              <p className="text-sm font-medium text-card-foreground">{d.name}</p>
              <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => download(d.storage_path)} className="text-xs text-primary hover:underline">Download</button>
              <button onClick={() => remove(d.id, d.storage_path)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>}
      </div>
    </div>
  );
}

/* -------------------- Sharing -------------------- */
type ShareRow = { id: string; token: string; title: string; recipient: string | null; expires_at: string | null; view_count: number; is_active: boolean };
function SharingManager() {
  const [items, setItems] = useState<ShareRow[]>([]);
  const [draft, setDraft] = useState({ title: "", recipient: "", days: 30 });

  const load = async () => {
    const { data } = await supabase.from("share_links").select("*").order("created_at", { ascending: false });
    setItems((data as ShareRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!draft.title.trim()) return;
    const expires = new Date(Date.now() + draft.days * 86400_000).toISOString();
    const { error } = await supabase.from("share_links").insert({
      title: draft.title.trim(),
      recipient: draft.recipient.trim() || null,
      expires_at: expires,
    });
    if (error) toast.error(error.message);
    else { toast.success("Share link created"); setDraft({ title: "", recipient: "", days: 30 }); load(); }
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/?share=${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const revoke = async (id: string) => {
    await supabase.from("share_links").update({ is_active: false }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading text-base font-semibold text-foreground">Generate Secure Share Link</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <input placeholder="Title (e.g. For Acme Recruiter)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Recipient (optional)" value={draft.recipient} onChange={(e) => setDraft({ ...draft, recipient: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input type="number" min={1} max={365} value={draft.days} onChange={(e) => setDraft({ ...draft, days: Number(e.target.value) })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <Button className="mt-4" variant="hero" onClick={create}><Plus className="h-4 w-4" /> Create Link</Button>
      </div>

      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div>
              <p className="text-sm font-medium text-card-foreground">{s.title} {!s.is_active && <span className="text-xs text-destructive">(revoked)</span>}</p>
              <p className="text-xs text-muted-foreground">
                Views: {s.view_count} · Expires: {s.expires_at ? new Date(s.expires_at).toLocaleDateString() : "—"}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => copyLink(s.token)} className="text-muted-foreground hover:text-primary"><Copy className="h-4 w-4" /></button>
              {s.is_active && <button onClick={() => revoke(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------- Messages -------------------- */
type MsgRow = { id: string; name: string; email: string; subject: string | null; message: string; is_read: boolean; created_at: string };
function MessagesPanel() {
  const [items, setItems] = useState<MsgRow[]>([]);
  const load = async () => {
    const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    setItems((data as MsgRow[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    load();
  };

  return (
    <div className="space-y-3">
      {items.map((m) => (
        <div key={m.id} className={`rounded-xl border p-4 ${m.is_read ? "border-border bg-card" : "border-primary/30 bg-badge-bg"}`}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{m.name} <span className="text-muted-foreground font-normal">· {m.email}</span></p>
            <p className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
          </div>
          {m.subject && <p className="mt-1 text-sm font-medium text-foreground">{m.subject}</p>}
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{m.message}</p>
          {!m.is_read && (
            <button onClick={() => markRead(m.id)} className="mt-2 text-xs text-primary hover:underline">Mark as read</button>
          )}
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
    </div>
  );
}

/* -------------------- Analytics -------------------- */
function AnalyticsPanel() {
  const [byPage, setByPage] = useState<{ page: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("portfolio_views").select("page").limit(1000);
      const rows = (data as { page: string }[]) ?? [];
      setTotal(rows.length);
      const map = new Map<string, number>();
      rows.forEach((r) => map.set(r.page, (map.get(r.page) ?? 0) + 1));
      setByPage([...map.entries()].map(([page, count]) => ({ page, count })).sort((a, b) => b.count - a.count));
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Total Views</p>
        <p className="mt-1 font-heading text-3xl font-bold text-foreground">{total}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Top Pages</h3>
        <div className="mt-3 space-y-1">
          {byPage.map((r) => (
            <div key={r.page} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{r.page}</span>
              <span className="font-medium text-foreground">{r.count}</span>
            </div>
          ))}
          {byPage.length === 0 && <p className="text-sm text-muted-foreground">No analytics data yet.</p>}
        </div>
      </div>
    </div>
  );
}

/* -------------------- Security -------------------- */
type LogRow = { id: string; event: string; email: string | null; success: boolean; created_at: string };
function SecurityPanel() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  useEffect(() => {
    supabase.from("security_logs").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setLogs((data as LogRow[]) ?? []));
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">Recent Security Events</h3>
      <div className="mt-3 space-y-1">
        {logs.map((l) => (
          <div key={l.id} className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
            <div>
              <span className={`mr-2 inline-block h-2 w-2 rounded-full ${l.success ? "bg-emerald-500" : "bg-destructive"}`} />
              <span className="font-medium text-foreground">{l.event}</span>
              {l.email && <span className="ml-2 text-muted-foreground">{l.email}</span>}
            </div>
            <span className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>
          </div>
        ))}
        {logs.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
      </div>
      <ChevronRight className="hidden" />
    </div>
  );
}
