import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Code2,
  FileText,
  Share2,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Admin Portal" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: User, label: "Profile" },
  { icon: FolderGit2, label: "Projects" },
  { icon: Code2, label: "Skills" },
  { icon: FileText, label: "CV & Documents" },
  { icon: Share2, label: "Sharing" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Shield, label: "Security" },
  { icon: Settings, label: "Settings" },
];

const stats = [
  { label: "Portfolio Views", value: "—", change: "Connect backend to track" },
  { label: "CV Downloads", value: "—", change: "Enable analytics" },
  { label: "Active Share Links", value: "0", change: "Create share links" },
  { label: "Projects Listed", value: "6", change: "+2 in development" },
];

function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Code2 className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sidebar-foreground">Admin Portal</span>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-sidebar-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground">
            <LogOut className="h-4 w-4" />
            Back to Portfolio
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="flex h-16 items-center justify-between border-b border-border px-6">
          <h1 className="font-heading text-lg font-bold text-foreground">Dashboard Overview</h1>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              JL
            </div>
          </div>
        </header>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Welcome */}
            <div className="rounded-xl border border-primary/20 bg-badge-bg p-6">
              <h2 className="font-heading text-xl font-bold text-foreground">Welcome, Jerol</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your portfolio management system is ready. Connect Lovable Cloud to enable authentication, 
                data persistence, file uploads, analytics, and secure sharing features.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-card-foreground">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Edit Profile", desc: "Update your bio, title, and professional info" },
                  { title: "Manage Projects", desc: "Add, edit, or remove portfolio projects" },
                  { title: "Upload CV", desc: "Upload or replace your resume documents" },
                  { title: "Create Share Link", desc: "Generate secure portfolio access links" },
                  { title: "View Analytics", desc: "Track portfolio views and engagement" },
                  { title: "Security Settings", desc: "Review security logs and auth settings" },
                ].map((action) => (
                  <button
                    key={action.title}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <div>
                      <h4 className="font-medium text-card-foreground">{action.title}</h4>
                      <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
