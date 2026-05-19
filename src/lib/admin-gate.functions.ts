import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Server-side admin passkey verification. The passkey is read from a
// server-only environment variable and is NEVER shipped to the browser.
// A fallback is provided for projects that have not yet configured the secret.
const FALLBACK_PASSKEY = "Jerol@2026#PNG$Admin!";

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
    const expected = process.env.ADMIN_GATE_PASSKEY || FALLBACK_PASSKEY;
    const ok = timingSafeEqual(data.passkey, expected);
    return { ok };
  });
