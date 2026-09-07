"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Brush, CreditCard, Home, Link2, QrCode, Settings, ShoppingBag, UserRound, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useI18n } from "@/components/i18n-provider";

const itemDefs=[["/dashboard",Home,"overview"],["/dashboard/links",Link2,"links"],["/dashboard/appearance",Brush,"appearance"],["/dashboard/store",ShoppingBag,"store"],["/dashboard/analytics",BarChart3,"analytics"],["/dashboard/payments",CreditCard,"payments"],["/dashboard/qr-code",QrCode,"qr"],["/dashboard/settings",Settings,"settings"]] as const;

export function DashboardShell({children,username}:{children:React.ReactNode;username?:string|null}){
  const path=usePathname();
  const {dict}=useI18n();
  const items=itemDefs.map(([href,Icon,key])=>[href,Icon,dict.dashboard[key]] as const);
  return <div className="min-h-screen bg-[#f4f5f1] lg:grid lg:grid-cols-[250px_1fr]">
    <aside className="hidden border-r border-black/[.07] bg-white p-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col"><Logo/><nav className="mt-8 space-y-1">{items.map(([href,Icon,label])=>{const active=path===href;return <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold ${active?"bg-[#edf3ef] text-[#135d44]":"text-[#59635e] hover:bg-black/[.035]"}`}><Icon size={18}/>{label}</Link>})}</nav><div className="mt-auto">{username&&<Link target="_blank" href={`/${username}`} className="flex items-center justify-between rounded-2xl border border-black/10 p-3 text-sm font-semibold">{dict.dashboard.publicPage}<ExternalLink size={15}/></Link>}<div className="mt-3 flex items-center gap-3 rounded-2xl bg-[#f5f6f3] p-3"><span className="grid size-9 place-items-center rounded-full bg-[#135d44] text-xs font-bold text-white">ME</span><span className="min-w-0"><b className="block truncate text-sm">{dict.dashboard.creatorWorkspace}</b><span className="text-xs text-[#79817d]">Linqo</span></span></div></div></aside>
    <div className="min-w-0"><header className="sticky top-0 z-30 border-b border-black/[.06] bg-[#f4f5f1]/90 px-4 py-3 backdrop-blur-xl lg:hidden"><div className="flex items-center justify-between"><Logo compact/><span className="text-sm font-semibold">{dict.dashboard.workspace}</span>{username?<Link href={`/${username}`} aria-label="View profile"><UserRound size={20}/></Link>:<span className="size-5"/>}</div><nav className="mt-3 flex gap-1 overflow-x-auto pb-1" aria-label="Dashboard">{items.map(([href,Icon,label])=><Link key={href} href={href} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${path===href?"bg-[#135d44] text-white":"bg-white text-[#59635e]"}`}><Icon size={14}/>{label}</Link>)}</nav></header><main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">{children}</main></div>
  </div>;
}
