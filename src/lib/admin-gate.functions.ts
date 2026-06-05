import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server-side admin passkey verification. The passkey is read from a
// server-only environment variable and is NEVER shipped to the browser.
// If the env var is not set, the gate is closed by default (returns ok:false)
// rather than falling back to a known value committed in source.

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export const verifyAdminPasskey = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ passkey: z.string().min(1).max(200) }).parse(input)
  )
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_GATE_PASSKEY;
    if (!expected || expected.length === 0) {
      // Fail closed — no fallback. Admin must set ADMIN_GATE_PASSKEY.
      console.error("[admin-gate] ADMIN_GATE_PASSKEY is not configured");
      return { ok: false };
    }
    const ok = timingSafeEqual(data.passkey, expected);
    return { ok };
  });
