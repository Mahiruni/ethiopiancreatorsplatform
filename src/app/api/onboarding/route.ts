import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { usernameSchema } from "@/lib/validation/common";

const bodySchema = z.object({
  username: usernameSchema,
  displayName: z.string().min(1).max(80),
  bio: z.string().max(240).default(""),
  category: z.enum(["Creator","Business","Freelancer","Artist","Musician","Professional","Student","Organization","Other"]),
  theme: z.enum(["minimal","creator"]),
  links: z.array(z.object({
    title: z.string().min(1).max(120),
    url: z.string().url().max(2048),
    type: z.enum(["standard","social","whatsapp","telegram"]),
  })).max(8),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid onboarding data", issues: parsed.error.flatten() }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("complete_onboarding_server", {
    p_user_id: userId,
    p_username: parsed.data.username,
    p_display_name: parsed.data.displayName,
    p_bio: parsed.data.bio,
    p_category: parsed.data.category,
    p_theme: parsed.data.theme,
    p_links: parsed.data.links,
  });
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Username is no longer available." }, { status: 409 });
    return NextResponse.json({ error: "Unable to create profile." }, { status: 500 });
  }
  return NextResponse.json({ profile: data });
}
