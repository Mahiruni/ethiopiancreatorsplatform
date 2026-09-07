import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { usernameSchema } from "@/lib/validation/common";
export async function GET(request:Request){const raw=new URL(request.url).searchParams.get("username")||"";const parsed=usernameSchema.safeParse(raw);if(!parsed.success)return NextResponse.json({available:false,reason:parsed.error.issues[0]?.message},{status:400});const admin=createAdminClient();const{data,error}=await admin.from("usernames").select("username").eq("username",parsed.data).maybeSingle();if(error)return NextResponse.json({available:false,reason:"Availability check failed."},{status:500});return NextResponse.json({available:!data});}
