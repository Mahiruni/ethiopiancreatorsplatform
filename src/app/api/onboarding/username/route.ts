import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { usernameSchema } from "@/lib/validation/common";

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("username") ?? "";
  const parsed = usernameSchema.safeParse(raw.trim().toLowerCase());

  if (!parsed.success) {
    return NextResponse.json(
      { available: false, reason: parsed.error.issues[0]?.message ?? "Invalid username." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("username_is_available", {
      p_username: parsed.data
    });

    if (error) {
      console.error("Username availability check failed", error.message);
      return NextResponse.json(
        { available: false, reason: "Unable to check this username right now." },
        { status: 503, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      { available: data === true, username: parsed.data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Username availability route failed", error);
    return NextResponse.json(
      { available: false, reason: "Unable to check this username right now." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
