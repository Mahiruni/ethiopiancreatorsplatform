import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { entitlements, getPlan } from "@/lib/entitlements";

const schema = z.object({
  theme: z.enum(["minimal", "glass", "creator", "professional", "business", "dark", "elegant"]),
  appearance: z.object({
    backgroundType: z.enum(["solid", "gradient", "image", "animated"]).default("solid"),
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    buttonColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    buttonStyle: z.enum(["rounded", "square", "pill", "soft-shadow", "glass"]),
    font: z.enum(["system", "editorial", "humanist", "ethiopic"]),
    fontSize: z.enum(["small", "medium", "large"]),
    backgroundImageUrl: z.string().url().nullable().optional(),
  }),
});

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid appearance configuration" }, { status: 400 });
  const { data: current } = await supabase.from("profiles").select("id,theme_id,appearance").eq("user_id", userId).is("deleted_at", null).single();
  if (!current) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  const plan = await getPlan(supabase, current.id);
  if (!entitlements[plan].advancedAppearance) {
    const allowed = parsed.data.theme === "minimal" && parsed.data.appearance.backgroundType === "solid" && parsed.data.appearance.buttonStyle === "rounded" && parsed.data.appearance.font === "system" && parsed.data.appearance.fontSize === "medium";
    if (!allowed) return NextResponse.json({ error: "Advanced appearance customization requires a Pro or Business plan." }, { status: 403 });
  }
  const { data, error } = await supabase.from("profiles").update({ theme_id: parsed.data.theme, appearance: parsed.data.appearance }).eq("id", current.id).select().single();
  if (error) return NextResponse.json({ error: "Unable to save appearance." }, { status: 500 });
  return NextResponse.json({ profile: data });
}
