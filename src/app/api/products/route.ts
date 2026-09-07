import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getPlan, entitlements } from "@/lib/entitlements";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(2000).default(""),
  price: z.coerce.number().nonnegative().max(10000000),
  currency: z.enum(["ETB", "USD"]).default("ETB"),
  kind: z.enum(["digital_file", "service", "course", "template", "ebook", "image"]),
  is_active: z.boolean().default(false),
});

async function ctx() {
  const supabase = await createClient();
  const { data: c } = await supabase.auth.getClaims();
  const userId = c?.claims?.sub;
  if (!userId) return null;
  const { data: profile } = await supabase.from("profiles").select("id").eq("user_id", userId).is("deleted_at", null).single();
  return profile ? { supabase, profile } : null;
}

async function requireProductEntitlement(c: NonNullable<Awaited<ReturnType<typeof ctx>>>) {
  const plan = await getPlan(c.supabase, c.profile.id);
  return entitlements[plan].products;
}

export async function POST(request: Request) {
  const c = await ctx();
  if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await requireProductEntitlement(c))) return NextResponse.json({ error: "Digital products require a Pro or Business plan." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid product", issues: parsed.error.flatten() }, { status: 400 });
  const { data, error } = await c.supabase.from("products").insert({ ...parsed.data, profile_id: c.profile.id }).select().single();
  if (error) return NextResponse.json({ error: "Unable to create product." }, { status: 500 });
  return NextResponse.json({ product: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const c = await ctx();
  if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await requireProductEntitlement(c))) return NextResponse.json({ error: "Digital products require a Pro or Business plan." }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body?.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const parsed = schema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  const { id, ...update } = parsed.data as typeof parsed.data & { id?: string };
  const { data, error } = await c.supabase.from("products").update(update).eq("id", body.id).eq("profile_id", c.profile.id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update product." }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(request: Request) {
  const c = await ctx();
  if (!c) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await c.supabase.from("products").update({ deleted_at: new Date().toISOString(), is_active: false }).eq("id", id).eq("profile_id", c.profile.id);
  return error ? NextResponse.json({ error: "Unable to delete product." }, { status: 500 }) : NextResponse.json({ ok: true });
}
