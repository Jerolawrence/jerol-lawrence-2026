import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, ShieldOff, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logActivity } from "@/lib/activity";

type Row = { user_id: string; role: string; email: string | null; full_name: string | null };

export function UsersManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [{ data: roles }, { data: profiles }] = await Promise.all([
      supabase.from("user_roles").select("user_id,role"),
      supabase.from("profiles").select("id,email,full_name"),
    ]);
    const pmap = new Map((profiles ?? []).map((p) => [p.id, p]));
    setRows((roles ?? []).map((r) => ({
      user_id: r.user_id,
      role: r.role,
      email: pmap.get(r.user_id)?.email ?? null,
      full_name: pmap.get(r.user_id)?.full_name ?? null,
    })));
  };
  useEffect(() => { load(); }, []);

  const promote = async (user_id: string, email: string | null) => {
    setBusy(true);
    // remove viewer if exists, add admin
    await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", "viewer");
    const { error } = await supabase.from("user_roles").insert({ user_id, role: "admin" });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Promoted to admin");
    logActivity("user.promote", "user", user_id, { email });
    load();
  };

  const demote = async (user_id: string, email: string | null) => {
    setBusy(true);
    await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", "admin");
    await supabase.from("user_roles").insert({ user_id, role: "viewer" });
    setBusy(false);
    toast.success("Demoted to viewer");
    logActivity("user.demote", "user", user_id, { email });
    load();
  };

  const removeRole = async (user_id: string, role: string, email: string | null) => {
    if (!confirm(`Remove ${role} role from this user?`)) return;
    await supabase.from("user_roles").delete().eq("user_id", user_id).eq("role", role);
    logActivity("user.role_remove", "user", user_id, { email, role });
    load();
  };

  const grouped = rows.reduce<Record<string, Row[]>>((acc, r) => {
    (acc[r.user_id] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-badge-bg p-5 text-sm">
        <p className="flex items-start gap-2 text-foreground">
          <UserPlus className="mt-0.5 h-4 w-4 text-primary" />
          New users sign up via the <span className="font-medium">/admin-portal</span> page. Owner emails get admin automatically; everyone else starts as viewer.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([uid, list]) => {
              const isAdmin = list.some((r) => r.role === "admin");
              const email = list[0].email;
              return (
                <tr key={uid} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{list[0].full_name ?? email ?? "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {list.map((r) => (
                        <span key={r.role} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${r.role === "admin" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {r.role}
                          <button onClick={() => removeRole(uid, r.role, email)} className="hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {isAdmin ? (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => demote(uid, email)}><ShieldOff className="h-3.5 w-3.5" /> Demote</Button>
                      ) : (
                        <Button size="sm" variant="hero" disabled={busy} onClick={() => promote(uid, email)}><Shield className="h-3.5 w-3.5" /> Make admin</Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {Object.keys(grouped).length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
