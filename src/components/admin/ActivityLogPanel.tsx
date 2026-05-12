import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Activity } from "lucide-react";

type Row = {
  id: string;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export function ActivityLogPanel() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(200)
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const filtered = rows.filter((r) =>
    q === "" ||
    r.action.toLowerCase().includes(q.toLowerCase()) ||
    r.actor_email?.toLowerCase().includes(q.toLowerCase()) ||
    r.target_type?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
        <Activity className="h-4 w-4 text-primary" />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by action, user, or target…" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm" />
        </div>
        <span className="text-xs text-muted-foreground">{filtered.length} events</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs">{r.actor_email ?? "system"}</td>
                <td className="px-4 py-3"><code className="text-xs text-primary">{r.action}</code></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {r.target_type}{r.target_id ? ` · ${r.target_id.slice(0, 8)}` : ""}
                  {r.metadata && <pre className="mt-1 max-w-xs overflow-x-auto text-[10px] text-muted-foreground/80">{JSON.stringify(r.metadata)}</pre>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No activity yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
