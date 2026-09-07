import { NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const createSchema = z.object({ slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]{2,40}$/), name_en: z.string().trim().min(2).max(60), name_am: z.string().trim().max(60).optional().default("") });
const updateSchema = z.object({ id: z.string().uuid(), name_en: z.string().trim().min(2).max(60), name_am: z.string().trim().max(60).nullable().optional(), is_active: z.boolean(), position: z.number().int().min(0).max(999) });

export async function POST(request: Request) {
  await requireRole(["administrator", "super_administrator"]);
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  const admin = createAdminClient();
  const { count } = await admin.from("profile_categories").select("id", { count: "exact", head: true });
  const { data, error } = await admin.from("profile_categories").insert({ ...parsed.data, name_am: parsed.data.name_am || null, position: count || 0 }).select("id,slug,name_en,name_am,is_active,position").single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That category slug already exists." : "Could not create category." }, { status: 400 });
  return NextResponse.json({ category: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  await requireRole(["administrator", "super_administrator"]);
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid category update." }, { status: 400 });
  const { id, ...update } = parsed.data;
  const { data, error } = await createAdminClient().from("profile_categories").update({ ...update, name_am: update.name_am || null }).eq("id", id).select("id,slug,name_en,name_am,is_active,position").single();
  if (error) return NextResponse.json({ error: "Could not update category." }, { status: 500 });
  return NextResponse.json({ category: data });
}
