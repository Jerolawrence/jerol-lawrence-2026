import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
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

// Strong admin passkey gate. Mix of upper/lower letters, numbers and symbols.
// Change this value to rotate the gate passkey. Owner-only knowledge.
const ADMIN_PASSKEY = "Jerol@2026#PNG$Admin!";
const PASSKEY_SESSION_KEY = "admin_gate_unlocked";
const PASSKEY_ATTEMPTS_KEY = "admin_gate_attempts";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [unlocked, setUnlocked] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUnlocked(sessionStorage.getItem(PASSKEY_SESSION_KEY) === "1");
    }
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate({ to: "/admin-dashboard" });
  }, [user, isAdmin, loading, navigate]);

  const handlePasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const attempts = Number(sessionStorage.getItem(PASSKEY_ATTEMPTS_KEY) || "0");
      if (attempts >= 5) {
        toast.error("Too many attempts. Refresh and try later.");
        return;
      }
      // Constant-time-ish comparison
      if (passkey.length === ADMIN_PASSKEY.length && passkey === ADMIN_PASSKEY) {
        sessionStorage.setItem(PASSKEY_SESSION_KEY, "1");
        sessionStorage.removeItem(PASSKEY_ATTEMPTS_KEY);
        await supabase.from("security_logs").insert({ event: "admin_gate_unlocked", success: true });
        setUnlocked(true);
        toast.success("Passkey accepted");
      } else {
        sessionStorage.setItem(PASSKEY_ATTEMPTS_KEY, String(attempts + 1));
        await supabase.from("security_logs").insert({ event: "admin_gate_failed", success: false });
        toast.error("Invalid passkey");
        setPasskey("");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await supabase.from("security_logs").insert({ event: "admin_login", email, success: true });
      toast.success("Welcome back");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      await supabase.from("security_logs").insert({ event: "admin_login", email, success: false, metadata: { message } });
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
            {unlocked ? <Lock className="h-6 w-6 text-primary-foreground" /> : <ShieldCheck className="h-6 w-6 text-primary-foreground" />}
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground">
            {unlocked ? "Admin Sign In" : "Admin Verification"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unlocked ? "Step 2 of 2 — Enter administrator credentials" : "Step 1 of 2 — Enter your secure passkey to continue"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          {!unlocked ? (
            <form onSubmit={handlePasskey} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Secure Passkey</label>
                <div className="relative mt-1.5">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    autoFocus
                    autoComplete="off"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter passkey"
                    required
                  />
                </div>
              </div>
              <Button variant="hero" size="lg" className="w-full" type="submit" disabled={busy}>
                {busy ? "Verifying…" : "Verify Passkey"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                The passkey is required to view the admin sign-in form.
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
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
                {busy ? "Signing in…" : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Forgot your password? Password resets are handled exclusively by the system administrator.
              </p>
            </form>
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
