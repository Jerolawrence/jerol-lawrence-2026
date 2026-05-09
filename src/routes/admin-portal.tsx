import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin-dashboard" });
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin-dashboard` },
        });
        if (error) throw error;
        toast.success("Account created. You can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await supabase.from("security_logs").insert({ event: "admin_login", email, success: true });
        toast.success("Welcome back");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      await supabase.from("security_logs").insert({ event: `admin_${mode}`, email, success: false, metadata: { message } });
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-1.5">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <Button variant="hero" size="lg" className="w-full" type="submit" disabled={busy}>
              {busy ? "Working…" : mode === "signin" ? "Sign In" : "Create Admin Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {mode === "signin" ? "First time? " : "Have an account? "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-medium text-primary hover:underline"
              >
                {mode === "signin" ? "Create admin account" : "Sign in instead"}
              </button>
            </p>
            <p className="text-center text-[11px] text-muted-foreground">
              Only authorized owner emails are granted admin access automatically.
            </p>
          </form>
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
