import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { usernameSchema } from "@/lib/validation/common";

export async function PATCH(request: Request) {
  const parsed = usernameSchema.safeParse((await request.json().catch(() => null))?.username);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid username" }, { status: 400 });

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("change_username_server", { p_user_id: userId, p_username: parsed.data });
  if (error) return NextResponse.json({ error: error.code === "23505" ? "Username is already taken." : "Unable to change username." }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ username: data });
}
