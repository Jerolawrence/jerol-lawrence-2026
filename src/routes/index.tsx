import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Shield, Globe, Terminal, Cpu, Database, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jerol Lawrence — Web Developer & Software Engineer" },
      { name: "description", content: "Professional portfolio of Jerol Lawrence — Web Developer, Software Engineer, Computer Programmer, IT Specialist, and Technology Professional from Papua New Guinea." },
      { property: "og:title", content: "Jerol Lawrence — Web Developer & Software Engineer" },
      { property: "og:description", content: "Professional portfolio showcasing development expertise, projects, and technical skills." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const roles = [
  "Web Developer",
  "Software Engineer",
  "Computer Programmer",
  "IT Specialist",
  "Technology Professional",
];

const highlights = [
  { icon: Globe, title: "Web Development", desc: "Full-stack web applications with modern frameworks and responsive design" },
  { icon: Terminal, title: "Software Engineering", desc: "Clean, maintainable code following software engineering best practices" },
  { icon: Database, title: "Database Management", desc: "SQL, Firebase, Supabase — secure data architecture and management" },
  { icon: Shield, title: "Cybersecurity", desc: "Security-first development with enterprise-grade protection standards" },
  { icon: Cpu, title: "Systems Administration", desc: "Linux, networking, cloud infrastructure, and IT support" },
  { icon: Code2, title: "Programming", desc: "TypeScript, JavaScript, Python, PHP, C++, C# — multi-paradigm expertise" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-44 md:pb-32">
        <div className="hero-gradient absolute inset-0" />
        <div className="grid-bg absolute inset-0 opacity-30" />

        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div custom={0} variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Available for opportunities
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Jerol Lawrence
            </motion.h1>

            <motion.div custom={2} variants={fadeUp} className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {roles.map((role) => (
                <span key={role} className="rounded-full bg-badge-bg px-3 py-1 text-xs font-medium text-badge-foreground">
                  {role}
                </span>
              ))}
            </motion.div>

            <motion.p custom={3} variants={fadeUp} className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
              Driven technology professional with a Bachelor of Science in Computer Programming. 
              Building modern web applications and digital solutions with a security-first approach.
            </motion.p>

            <motion.div custom={4} variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/projects">
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/contact">
                  Get in Touch
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Technical Expertise
            </h2>
            <p className="mt-3 text-muted-foreground">
              Comprehensive skills across the full technology stack
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-badge-bg">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Let's Build Something Great
            </h2>
            <p className="mt-4 text-muted-foreground">
              Looking for a dedicated developer or IT professional? I'm ready to bring your vision to life.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">
                  Start a Conversation
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/about">Learn More About Me</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
