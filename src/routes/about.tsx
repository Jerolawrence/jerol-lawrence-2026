import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Briefcase, Award, Images, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jerol Lawrence" },
      { name: "description", content: "Learn about Jerol Lawrence — BSc Computer Programming graduate, web developer, and IT specialist from Papua New Guinea." },
      { property: "og:title", content: "About — Jerol Lawrence" },
      { property: "og:description", content: "Professional background, education, and career journey." },
    ],
  }),
  component: AboutPage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const experience = [
  {
    role: "Information Officer",
    company: "Femili PNG Inc",
    period: "Dec 2025 – Present",
    desc: "Handling data entry, client referral records, reporting, data accuracy, confidentiality, backups, and basic IT support including computer and printer troubleshooting.",
  },
  {
    role: "Inventory Assistant",
    company: "Maku Gifts Limited",
    period: "Jun 2025 – Nov 2025",
    desc: "Assisted with administration, inventory management, system updates, computer setup, basic networking, CCTV installation, and online sales/cashier support.",
  },
];

const education = [
  {
    degree: "Bachelor of Science in Computer Programming",
    school: "Western Pacific University",
    period: "Feb 2022 – Oct 2024",
    detail: "GPA: 3.21 — Focused on software engineering, web development, cybersecurity, and networking.",
  },
  {
    degree: "Certificate of Higher Education in Foundation Studies",
    school: "Western Pacific University",
    period: "Feb 2021 – Oct 2021",
    detail: "GPA: 2.75 — Foundation in mathematics, sciences, and computing.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              About Me
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              I'm <span className="text-foreground font-semibold">Jerol Lawrence</span>, a technology professional from Lae, Morobe Province, Papua New Guinea. 
              With a Bachelor of Science in Computer Programming from Western Pacific University, I'm passionate about building digital solutions 
              that make a difference.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              My expertise spans web development, software engineering, database management, cybersecurity, and IT systems administration. 
              I'm dedicated to continuous learning and delivering professional-grade solutions with strong work ethics.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Lae, Morobe Province, Papua New Guinea</span>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-2 mb-8">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Experience</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.role} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">{exp.role}</h3>
                    <span className="text-sm text-muted-foreground">{exp.period}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">{exp.company}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{exp.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-2 mb-8">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Education</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.degree} className="rounded-xl border border-border bg-card p-6">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-heading text-lg font-semibold text-card-foreground">{edu.degree}</h3>
                    <span className="text-sm text-muted-foreground">{edu.period}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">{edu.school}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{edu.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Awards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center gap-2 mb-8">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-2xl font-bold text-foreground">Awards & Certifications</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-card-foreground">Certificate of Completion</h3>
                <p className="mt-1 text-sm text-muted-foreground">Psycho Education Program — 2024</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold text-card-foreground">Certificate of Participation</h3>
                <p className="mt-1 text-sm text-muted-foreground">WPU Career Expo & Open Day — 2024</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
