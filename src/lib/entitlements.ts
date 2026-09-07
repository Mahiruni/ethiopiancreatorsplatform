import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
export type Plan="free"|"pro"|"business";
export async function getPlan(supabase:SupabaseClient,profileId:string):Promise<Plan>{const{data}=await supabase.from("subscriptions").select("plan,status").eq("profile_id",profileId).in("status",["active","trialing","past_due"]).order("created_at",{ascending:false}).limit(1).maybeSingle();return(data?.plan as Plan)||"free"}
export const entitlements={free:{links:8,products:false,advancedAppearance:false,customAnalytics:false},pro:{links:50,products:true,advancedAppearance:true,customAnalytics:true},business:{links:200,products:true,advancedAppearance:true,customAnalytics:true}} as const;
