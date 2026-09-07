import "server-only";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function enforceRateLimit(keyMaterial: string, bucket: string, limit: number, windowSeconds: number) {
  const salt = process.env.RATE_LIMIT_SALT || "development-only";
  const key = crypto.createHash("sha256").update(`${salt}:${keyMaterial}`).digest("hex");
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("consume_rate_limit", {
    p_key: key,
    p_bucket: bucket,
    p_limit: limit,
    p_window_seconds: windowSeconds
  });
  if (error) throw new Error("Rate limit service unavailable");
  if (data !== true) throw new Error("RATE_LIMITED");
}
