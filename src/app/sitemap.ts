import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseEnv, publicEnv } from "@/lib/env";
const staticRoutes=["","/features","/pricing","/explore","/about","/contact","/terms","/privacy","/report"];
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=publicEnv.NEXT_PUBLIC_APP_URL;const items:MetadataRoute.Sitemap=staticRoutes.map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path===""?"weekly":"monthly",priority:path===""?1:.6}));if(!hasSupabaseEnv||!process.env.SUPABASE_SECRET_KEY)return items;try{const{data}=await createAdminClient().from("profiles").select("username,updated_at").eq("is_public",true).is("deleted_at",null).limit(5000);for(const profile of data||[])items.push({url:`${base}/${profile.username}`,lastModified:new Date(profile.updated_at),changeFrequency:"weekly",priority:.7});}catch{}return items}
