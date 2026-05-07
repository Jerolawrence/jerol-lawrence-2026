import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Jerol Lawrence" },
      { name: "description", content: "Development portfolio showcasing web applications, software projects, and IT solutions by Jerol Lawrence." },
      { property: "og:title", content: "Projects — Jerol Lawrence" },
      { property: "og:description", content: "A showcase of professional development projects and technical solutions." },
    ],
  }),
  component: ProjectsPage,
});

const projects = [
  {
    title: "HRMS — Human Resource Management System",
    desc: "Full-stack HR management platform with employee records, payroll processing, leave management, and reporting dashboards.",
    tags: ["React", "TypeScript", "Supabase", "TailwindCSS"],
    status: "In Development",
  },
  {
    title: "Vehicle Management System",
    desc: "Fleet tracking and vehicle management solution with maintenance scheduling, fuel logging, and driver assignment.",
    tags: ["React", "Node.js", "PostgreSQL", "REST API"],
    status: "In Development",
  },
  {
    title: "SME Business Platform",
    desc: "Digital platform for small and medium enterprises to manage inventory, sales, customer relations, and analytics.",
    tags: ["TypeScript", "React", "Firebase", "TailwindCSS"],
    status: "Planning",
  },
  {
    title: "Portfolio Management System",
    desc: "Enterprise-grade professional portfolio platform with admin dashboard, secure sharing, and analytics — this very platform.",
    tags: ["React", "TypeScript", "Supabase", "Framer Motion"],
    status: "Active",
  },
  {
    title: "ATS — Applicant Tracking System",
    desc: "Recruitment and applicant management system with job posting, candidate tracking, and interview scheduling.",
    tags: ["React", "Python", "SQL", "API Integration"],
    status: "Planning",
  },
  {
    title: "Office Management Suite",
    desc: "Comprehensive office management tools including document management, task tracking, and team collaboration features.",
    tags: ["TypeScript", "React", "Cloud", "UI/UX"],
    status: "Concept",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-500/10 text-green-600 dark:text-green-400",
  "In Development": "bg-primary/10 text-primary",
  Planning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Concept: "bg-muted text-muted-foreground",
};

function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Projects
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              A showcase of systems and applications I'm building — from enterprise HR solutions to business management platforms.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-badge-bg">
                    <FolderGit2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status] || ""}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-lg font-semibold text-card-foreground">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{project.desc}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-badge-bg px-2 py-0.5 text-xs font-medium text-badge-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
