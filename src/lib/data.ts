import "server-only";
import { requireUser } from "@/lib/supabase/auth";

export async function getCurrentProfile(){
  const {supabase,userId}=await requireUser();
  const {data,error}=await supabase.from("profiles").select("*").eq("user_id",userId).is("deleted_at",null).maybeSingle();
  if(error) throw new Error("Unable to load profile");
  return {supabase,userId,profile:data};
}

export async function getProfileLinks(profileId:string){
  const {supabase}=await requireUser();
  const {data,error}=await supabase.from("links").select("*").eq("profile_id",profileId).is("deleted_at",null).order("position");
  if(error) throw new Error("Unable to load links");
  return data??[];
}
