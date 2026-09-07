import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export function MarketingPage({ eyebrow, title, intro, children }: { eyebrow:string; title:string; intro:string; children:React.ReactNode }) {
  return <><MarketingHeader/><main><section className="py-16 sm:py-24"><div className="container-shell"><div className="max-w-3xl"><span className="text-xs font-bold uppercase tracking-[.14em] text-[#135d44]">{eyebrow}</span><h1 className="mt-4 text-5xl font-semibold leading-[.98] tracking-[-.055em] sm:text-7xl">{title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#65706a]">{intro}</p></div><div className="mt-14">{children}</div></div></section></main><Footer/></>;
}
