import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
const schema=z.object({ids:z.array(z.string().uuid()).min(1).max(100)});
export async function POST(request:Request){const supabase=await createClient();const{data:claims}=await supabase.auth.getClaims();const userId=claims?.claims?.sub;if(!userId)return NextResponse.json({error:"Unauthorized"},{status:401});const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Invalid ordering"},{status:400});const{error}=await supabase.rpc("reorder_profile_links",{p_ids:parsed.data.ids});if(error)return NextResponse.json({error:"Unable to reorder links."},{status:500});return NextResponse.json({ok:true});}
