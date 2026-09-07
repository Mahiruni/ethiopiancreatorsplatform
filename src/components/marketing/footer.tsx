import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const groups = [
  { title: "Product", links: [["Features","/features"],["Pricing","/pricing"],["Explore","/explore"]] },
  { title: "For you", links: [["Creators","/features#creators"],["Businesses","/features#business"],["About","/about"]] },
  { title: "Company", links: [["Contact","/contact"],["Report","/report"],["Sign in","/login"]] },
  { title: "Legal", links: [["Terms","/terms"],["Privacy","/privacy"]] },
];

export function Footer(){
  return <footer className="bg-[#0c1712] pb-7 pt-16 text-white sm:pt-20">
    <div className="container-shell">
      <div className="grid gap-14 border-b border-white/10 pb-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <div className="inline-block text-white"><Logo/></div>
          <h2 className="text-balance mt-7 max-w-xl text-3xl font-semibold leading-[1.02] tracking-[-.045em] sm:text-4xl">Your digital identity should feel like you — not a template.</h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/50">One identity. One link. Everything connected — designed for Ethiopian creators, professionals and businesses.</p>
          <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#dff36a] px-5 py-3 text-sm font-bold text-[#112015] transition hover:translate-y-[-1px]">Create your Linqo <ArrowUpRight size={15}/></Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {groups.map(group=><div key={group.title}><div className="text-[11px] font-bold uppercase tracking-[.14em] text-white/35">{group.title}</div><div className="mt-4 space-y-3">{group.links.map(([label,href])=><Link key={href} href={href} className="block text-sm text-white/65 transition hover:text-white">{label}</Link>)}</div></div>)}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6 text-[11px] font-medium text-white/35 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Linqo. Built for Ethiopia, ready for Africa.</span>
        <span>Addis Ababa · English + አማርኛ</span>
      </div>
    </div>
  </footer>;
}
