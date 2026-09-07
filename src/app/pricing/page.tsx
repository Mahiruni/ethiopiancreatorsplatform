import { Check, Sparkles } from "lucide-react";
import { MarketingPage } from "@/components/marketing/page-shell";
import { ButtonLink } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "ETB 0", cadence:"forever", desc: "For a clean digital identity.", features: ["Public profile", "Up to 8 links", "Standard themes", "Standard analytics", "Profile QR"] },
  { name: "Pro", price: "ETB 499", cadence:"every 30 days", desc: "For creators building a business.", features: ["Advanced customization", "Advanced analytics", "Up to 50 links", "Digital products", "Brand controls"], featured: true },
  { name: "Business", price: "ETB 1,499", cadence:"every 30 days", desc: "For teams and organizations.", features: ["Up to 200 links", "Team architecture", "Advanced reporting", "Premium themes", "Priority support"] },
];

export default function Pricing() {
  return <MarketingPage eyebrow="Pricing" title="Start free. Upgrade when Linqo earns its place." intro="Simple plans with server-enforced access. Paid features activate only after the configured payment provider verifies the transaction.">
    <div className="grid gap-4 lg:grid-cols-3">
      {plans.map((p,index) => <article key={p.name} className={`relative overflow-hidden rounded-[30px] border p-7 sm:p-8 ${p.featured ? "border-[#0d5b42] bg-[#0d5b42] text-white shadow-[0_26px_80px_rgba(13,91,66,.18)]" : "border-black/[.09] bg-white/70"}`}>
        {p.featured && <div className="absolute right-0 top-0 size-36 translate-x-12 -translate-y-12 rounded-full border-[28px] border-white/[.05]"/>}
        <div className="relative flex items-center justify-between gap-4">
          <div><div className={`text-[10px] font-bold uppercase tracking-[.15em] ${p.featured?"text-white/45":"text-[#8b938e]"}`}>0{index+1}</div><h2 className="mt-2 text-xl font-semibold">{p.name}</h2></div>
          {p.featured && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dff36a] px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[.1em] text-[#112015]"><Sparkles size={12}/>Most popular</span>}
        </div>

        <div className="relative mt-10"><div className="text-4xl font-semibold tracking-[-.055em] sm:text-5xl">{p.price}</div><div className={`mt-2 text-xs font-medium ${p.featured?"text-white/50":"text-[#7b847e]"}`}>{p.cadence}</div></div>
        <p className={`relative mt-5 text-sm leading-6 ${p.featured?"text-white/62":"text-[#69736d]"}`}>{p.desc}</p>

        <div className={`relative my-7 h-px ${p.featured?"bg-white/10":"bg-black/[.08]"}`}/>
        <ul className="relative space-y-3 text-sm">{p.features.map((f) => <li className="flex gap-2.5" key={f}><Check size={16} className={`mt-0.5 shrink-0 ${p.featured?"text-[#dff36a]":"text-[#0d5b42]"}`} />{f}</li>)}</ul>
        <ButtonLink href={p.name === "Free" ? "/signup" : "/login?next=/dashboard/payments"} className="relative mt-9 w-full" variant={p.featured ? "secondary" : "primary"}>{p.name === "Free" ? "Get started free" : `Choose ${p.name}`}</ButtonLink>
      </article>)}
    </div>

    <div className="mt-8 rounded-[26px] border border-black/[.08] bg-[#eceee7] px-6 py-5 text-sm leading-6 text-[#667069] sm:flex sm:items-center sm:justify-between sm:gap-8"><span>Need a simple page first? Start on Free and upgrade only when advanced customization, analytics or commerce becomes useful.</span><span className="mt-3 block shrink-0 font-bold text-[#0d5b42] sm:mt-0">No forced upgrade.</span></div>
  </MarketingPage>;
}
