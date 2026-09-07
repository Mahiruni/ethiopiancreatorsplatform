import { LinksBuilder } from "@/components/dashboard/links-builder";
import { getCurrentProfile,getProfileLinks } from "@/lib/data";
export default async function Links(){const{profile}=await getCurrentProfile();const links=await getProfileLinks(profile.id);return <LinksBuilder initialLinks={links} profile={profile}/>}
