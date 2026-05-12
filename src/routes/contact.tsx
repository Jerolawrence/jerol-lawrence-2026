import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSiteContacts } from "@/hooks/use-site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Jerol Lawrence" },
      { name: "description", content: "Get in touch with Jerol Lawrence for development projects, IT consulting, or collaboration opportunities." },
      { property: "og:title", content: "Contact — Jerol Lawrence" },
      { property: "og:description", content: "Reach out for professional inquiries, collaborations, or opportunities." },
    ],
  }),
  component: ContactPage,
});

function DynIcon({ name, className }: { name: string | null; className?: string }) {
  const Cmp = (name && (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]) || Icons.Link2;
  return <Cmp className={className} />;
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(5, "Message too short").max(2000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Message sent — I'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Interested in working together? I'm available for development projects, IT consulting, and professional opportunities.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="space-y-6"
            >
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-badge-bg">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-foreground font-medium hover:text-primary transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-primary/20 bg-badge-bg p-6">
                <h3 className="font-heading font-semibold text-foreground">Open to Opportunities</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  I'm prepared to relocate and work with dedication on projects that align with my skills in web development, 
                  software engineering, and IT systems. Available for full-time roles, freelance projects, or consulting engagements.
                </p>
              </div>
            </motion.div>

            {/* Quick Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold text-card-foreground">Send a Message</h3>
                <p className="mt-1 text-sm text-muted-foreground">Fill in your details and I'll get back to you promptly.</p>

                <form className="mt-6 space-y-4" onSubmit={submit}>
                  <div>
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="How can I help you?"
                      required
                    />
                  </div>
                  <Button variant="hero" size="lg" className="w-full" type="submit" disabled={busy}>
                    <Send className="h-4 w-4" />
                    {busy ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
