import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin-portal")({
  head: () => ({
    meta: [
      { title: "Admin Access — Jerol Lawrence" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="grid-bg absolute inset-0 opacity-20" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-2 text-sm text-muted-foreground">Secure administrator access only</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Administrator Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="admin@jerollawrence.dev"
                    required
                  />
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full" type="submit">
                Send Login Link
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                A secure magic link will be sent to your authorized admin email.
              </p>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="mt-3 font-semibold text-foreground">Check Your Email</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If <span className="font-medium text-foreground">{email}</span> is an authorized administrator email, 
                you'll receive a secure login link shortly.
              </p>
              <Button variant="ghost" size="sm" className="mt-4" onClick={() => setSubmitted(false)}>
                Try another email
              </Button>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            ← Back to Portfolio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
