import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { error } = await admin.rpc("request_account_deletion_server", { p_user_id: userId });
  if (error) return NextResponse.json({ error: "Unable to request deletion." }, { status: 500 });
  await supabase.auth.signOut({ scope: "global" });
  return NextResponse.json({ ok: true });
}
