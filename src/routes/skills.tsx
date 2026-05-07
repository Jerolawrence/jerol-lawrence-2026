import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Jerol Lawrence" },
      { name: "description", content: "Technical skills and expertise of Jerol Lawrence — frontend, backend, databases, cybersecurity, and more." },
      { property: "og:title", content: "Skills — Jerol Lawrence" },
      { property: "og:description", content: "Comprehensive technical skill set across the full technology stack." },
    ],
  }),
  component: SkillsPage,
});

const skillCategories = [
  {
    category: "Frontend Development",
    skills: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "TailwindCSS", "Framer Motion", "Responsive Design"],
  },
  {
    category: "Backend Development",
    skills: ["Node.js", "Python", "PHP", "C++", "C#", "REST APIs", "API Integration"],
  },
  {
    category: "Database & Storage",
    skills: ["SQL", "PostgreSQL", "Supabase", "Firebase", "Data Modeling", "Database Design"],
  },
  {
    category: "Cloud & DevOps",
    skills: ["Vercel", "Azure", "GitHub", "Git", "CI/CD", "Cloudflare", "Cloud Hosting"],
  },
  {
    category: "Cybersecurity",
    skills: ["Network Security", "Threat Analysis", "Encryption", "Access Control", "Security Auditing", "HTTPS/TLS"],
  },
  {
    category: "Networking & IT",
    skills: ["Linux", "Windows Server", "Ethernet/LAN", "IP Addressing", "Structured Cabling", "Troubleshooting", "CCTV Systems"],
  },
  {
    category: "Software Engineering",
    skills: ["OOP", "Design Patterns", "Version Control", "Agile", "Testing", "Documentation"],
  },
  {
    category: "Tools & Platforms",
    skills: ["VS Code", "Microsoft Office", "Figma", "Postman", "Terminal/CLI", "Docker"],
  },
];

function SkillsPage() {
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
              Technical Skills
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              A comprehensive overview of my technical capabilities across multiple domains.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {skillCategories.map((cat, i) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="font-heading text-lg font-semibold text-card-foreground">{cat.category}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="rounded-lg bg-badge-bg px-3 py-1.5 text-sm font-medium text-badge-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                      {skill}
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
