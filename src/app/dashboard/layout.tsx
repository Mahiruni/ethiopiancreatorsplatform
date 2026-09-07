import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentProfile } from "@/lib/data";
export default async function Layout({children}:{children:React.ReactNode}){const {profile}=await getCurrentProfile();if(!profile)redirect("/onboarding");return <DashboardShell username={profile.username}>{children}</DashboardShell>}
