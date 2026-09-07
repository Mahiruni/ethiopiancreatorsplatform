import { BarChart3, Blocks, Brush, Globe2, Link2, LockKeyhole, QrCode, ShoppingBag, WalletCards } from "lucide-react";
import { MarketingPage } from "@/components/marketing/page-shell";

const groups=[
  {id:"creators",kicker:"For creators",title:"A page that grows with your work",items:[[Link2,"Smart links","Websites, social accounts, WhatsApp, Telegram, maps, video and embeds."],[Brush,"Appearance","Original themes, fonts, button styles, backgrounds and live preview."],[QrCode,"QR sharing","A canonical profile QR plus link-specific codes for campaigns and print."]]},
  {id:"business",kicker:"For business",title:"Creator commerce without the clutter",items:[[ShoppingBag,"Digital store","Products, secure files, purchases and access controls."],[WalletCards,"Payment architecture","Provider abstraction for local and international payment rails."],[BarChart3,"Analytics","Views, clicks, sales, referrers and device trends with privacy in mind."]]},
  {id:"platform",kicker:"Under the hood",title:"Built like infrastructure",items:[[LockKeyhole,"Security","Server-side authorization, RLS, signed downloads and webhook verification."],[Blocks,"Extensible","Normalized PostgreSQL schema, modular APIs and reusable components."],[Globe2,"Bilingual","Centralized English and Amharic localization with Unicode-safe typography."]]}
] as const;

export default function Features(){
  return <MarketingPage eyebrow="Product" title="One page. A complete digital identity." intro="Linqo starts simple, then adds the systems creators and businesses need as their audience and income grow.">
    <div className="space-y-20 sm:space-y-24">
      {groups.map((g,index)=><section id={g.id} key={g.id} className="scroll-mt-28 border-t border-black/[.08] pt-8 sm:pt-10">
        <div className="grid gap-7 lg:grid-cols-[.72fr_1.28fr]">
          <div><div className="text-[11px] font-bold uppercase tracking-[.14em] text-[#0d5b42]">0{index+1} · {g.kicker}</div></div>
          <div>
            <h2 className="text-balance max-w-3xl text-3xl font-semibold tracking-[-.045em] sm:text-5xl">{g.title}</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {g.items.map(([Icon,title,body])=><article key={title} className="editorial-card min-h-[250px] p-6 sm:p-7">
                <span className="grid size-11 place-items-center rounded-[16px] bg-[#e4ece6] text-[#0d5b42]"><Icon size={20}/></span>
                <h3 className="mt-12 text-lg font-semibold tracking-[-.025em]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6a746d]">{body}</p>
              </article>)}
            </div>
          </div>
        </div>
      </section>)}
    </div>
  </MarketingPage>;
}
