import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";

export function createAdminClient() {
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL || !secret) throw new Error("Supabase admin credentials are not configured.");
  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, secret, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
