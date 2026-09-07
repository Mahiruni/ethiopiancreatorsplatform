import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarketingPage } from "@/components/marketing/page-shell";
import { demoProfiles } from "@/lib/demo-data";

export default function Explore(){
  return <MarketingPage eyebrow="Explore" title="A few fictional profiles. Many real possibilities." intro="These profiles are development seed/demo content only. Production discovery reads public profiles from PostgreSQL.">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {demoProfiles.map((p,index)=><Link href={`/${p.username}`} key={p.username} className="group editorial-card min-h-[360px] p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <div className="grid size-16 place-items-center rounded-full text-sm font-bold text-white shadow-[0_12px_30px_rgba(20,35,27,.12)]" style={{background:p.accent}}>{p.display_name.split(" ").map(v=>v[0]).join("").slice(0,2)}</div>
          <span className="grid size-10 place-items-center rounded-full border border-black/[.08] bg-white/65 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><ArrowUpRight size={17}/></span>
        </div>
        <div className="mt-20 text-[10px] font-bold uppercase tracking-[.14em] text-[#0d5b42]">{String(index+1).padStart(2,"0")} · {p.category}</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">{p.display_name}</h2>
        <p className="mt-3 text-sm leading-6 text-[#68726b]">{p.bio}</p>
        <div className="mt-6 text-xs font-semibold text-[#87908a]">linqo.app/{p.username}</div>
      </Link>)}
    </div>
  </MarketingPage>;
}
