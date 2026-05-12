import { supabase } from "@/integrations/supabase/client";

export async function logActivity(action: string, target_type?: string, target_id?: string, metadata?: Record<string, unknown>) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("activity_log").insert({
      actor_id: user.id,
      actor_email: user.email,
      action,
      target_type: target_type ?? null,
      target_id: target_id ?? null,
      metadata: metadata ?? null,
    });
  } catch {
    // best-effort
  }
}
