import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect("/login?next=/dashboard");
  return { supabase, userId };
}

export async function requireRole(allowed: UserRole[]) {
  const { supabase, userId } = await requireUser();
  const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle();
  const role = roleRow?.role as UserRole | undefined;
  if (!role || !allowed.includes(role)) redirect("/unauthorized");
  return { supabase, userId, role };
}
