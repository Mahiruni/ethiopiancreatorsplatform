import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";

export function MarketingPage({ eyebrow, title, intro, children }: { eyebrow:string; title:string; intro:string; children:React.ReactNode }) {
  return <>
    <MarketingHeader/>
    <main>
      <section className="marketing-noise relative overflow-hidden pb-20 pt-16 sm:pb-24 sm:pt-24">
        <div className="absolute inset-0 -z-10 grid-fade opacity-55"/>
        <div className="container-shell relative">
          <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div><span className="eyebrow">{eyebrow}</span></div>
            <div>
              <h1 className="text-balance max-w-5xl text-[clamp(3.4rem,7.2vw,7rem)] font-semibold leading-[.88] tracking-[-.07em]">{title}</h1>
              <p className="text-pretty mt-7 max-w-2xl text-base leading-7 text-[#626d65] sm:text-lg sm:leading-8">{intro}</p>
            </div>
          </div>
          <div className="mt-16 sm:mt-20">{children}</div>
        </div>
      </section>
    </main>
    <Footer/>
  </>;
}
