import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/dashboard/onboarding-flow";
import { Logo } from "@/components/ui/logo";
import { requireUser } from "@/lib/supabase/auth";
export default async function Onboarding(){const{supabase,userId}=await requireUser();const{data}=await supabase.from("profiles").select("id").eq("user_id",userId).is("deleted_at",null).maybeSingle();if(data)redirect("/dashboard");return <main className="min-h-screen bg-[#eef1ea] px-4 py-7"><div className="mx-auto mb-10 max-w-5xl"><Logo/></div><OnboardingFlow/></main>}
