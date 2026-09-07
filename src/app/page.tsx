"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Brush,
  CheckCircle2,
  Globe2,
  Languages,
  Link2,
  MapPin,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  WalletCards,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { HeroProfilePreview } from "@/components/marketing/profile-preview";
import { ButtonLink } from "@/components/ui/button";
import { demoProfiles } from "@/lib/demo-data";
import { useI18n } from "@/components/i18n-provider";

const essentials = [
  { icon: Link2, title: "One link for everything", body: "Socials, websites, WhatsApp, Telegram, portfolios, booking links and more — arranged beautifully." },
  { icon: ShoppingBag, title: "Sell from your page", body: "Turn attention into income with digital products and secure post-payment delivery." },
  { icon: BarChart3, title: "Know what works", body: "Privacy-conscious views, clicks, referrers, devices and revenue trends without data overload." },
  { icon: Brush, title: "Make it unmistakably yours", body: "Themes, typography, backgrounds and button systems that still feel refined on a small phone." },
  { icon: WalletCards, title: "Payments without lock-in", body: "A modular provider layer prepared for Ethiopian rails and international options where supported." },
  { icon: QrCode, title: "Online meets offline", body: "A canonical QR for profiles, products and links — ready for packaging, menus, events and print." },
];

const localSignals = [
  { icon: Languages, label: "English + አማርኛ", detail: "Centralized localization" },
  { icon: Smartphone, label: "+251 ready", detail: "Phone auth architecture" },
  { icon: WalletCards, label: "ETB commerce", detail: "Local-first payment model" },
  { icon: MapPin, label: "Built for Ethiopia", detail: "Mobile bandwidth conscious" },
];

export default function Home() {
  const { dict } = useI18n();

  return (
    <>
      <MarketingHeader />
      <main>
        <section className="marketing-noise relative overflow-hidden pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24">
          <div className="absolute inset-0 -z-10 grid-fade opacity-65" />
          <div className="container-shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
            <div className="max-w-[760px]">
              <div className="eyebrow">{dict.hero.eyebrow}</div>
              <h1 className="text-balance mt-6 text-[clamp(3.65rem,8.3vw,7.6rem)] font-semibold leading-[.86] tracking-[-.075em] text-[#10130f]">
                {dict.hero.title}
              </h1>
              <p className="text-pretty mt-8 max-w-[610px] text-[17px] leading-7 text-[#59645d] sm:text-xl sm:leading-8">
                {dict.hero.body}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href="/signup" className="justify-center sm:justify-start">{dict.hero.primary}<ArrowRight size={17}/></ButtonLink>
                <ButtonLink href="/explore" variant="secondary" className="justify-center sm:justify-start">{dict.hero.secondary}</ButtonLink>
              </div>
              <div className="mt-9 grid max-w-xl grid-cols-2 gap-x-5 gap-y-4 border-t border-black/[.08] pt-5 text-xs font-semibold text-[#69736d] sm:flex sm:flex-wrap sm:gap-x-7">
                {["Free to start", "No credit card", "English + አማርኛ", "Mobile-first"].map((item)=><span key={item} className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#0d5b42]"/>{item}</span>)}
              </div>
            </div>

            <div className="relative lg:translate-x-4">
              <div className="absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d5b42]/10 blur-3xl sm:size-[520px]" />
              <HeroProfilePreview />
            </div>
          </div>
        </section>

        <section className="border-y border-black/[.07] bg-[#fbfaf5] py-5">
          <div className="container-shell grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-black/[.07] bg-black/[.07] sm:grid-cols-4">
            {localSignals.map(({icon:Icon,label,detail})=><div key={label} className="bg-[#fbfaf5] px-4 py-5 sm:px-5"><Icon size={18} className="text-[#0d5b42]"/><div className="mt-3 text-sm font-bold tracking-[-.02em]">{label}</div><div className="mt-1 text-[11px] leading-4 text-[#778078]">{detail}</div></div>)}
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="container-shell">
            <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div><span className="eyebrow">The creator OS</span></div>
              <div>
                <h2 className="text-balance text-[clamp(2.8rem,5.8vw,5.5rem)] font-semibold leading-[.94] tracking-[-.062em]">Your identity, audience and business. <span className="text-[#718078]">Finally in one place.</span></h2>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#667069] sm:text-lg">Start with a simple profile. Add commerce, analytics, QR sharing and brand control only when you need them. Linqo stays calm as your work gets more ambitious.</p>
              </div>
            </div>

            <div className="mt-14 grid gap-4 lg:grid-cols-12">
              {essentials.map(({icon:Icon,title,body},i)=>{
                const span = i === 0 || i === 3 ? "lg:col-span-7" : i === 1 || i === 4 ? "lg:col-span-5" : "lg:col-span-6";
                return <article key={title} className={`editorial-card min-h-[260px] p-7 sm:p-8 ${span}`}>
                  <div className="flex items-start justify-between gap-4"><span className="grid size-12 place-items-center rounded-[17px] bg-[#e4ece6] text-[#0d5b42]"><Icon size={21}/></span><span className="text-[11px] font-bold tracking-[.14em] text-[#9aa19c]">0{i+1}</span></div>
                  <div className="mt-16 max-w-xl"><h3 className="text-2xl font-semibold tracking-[-.035em] sm:text-[28px]">{title}</h3><p className="mt-3 max-w-lg text-sm leading-6 text-[#6a746d] sm:text-[15px]">{body}</p></div>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#0c1712] py-24 text-white sm:py-28">
          <div className="container-shell">
            <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
              <div>
                <span className="eyebrow !text-[#c4d8ce]">Local by design</span>
                <h2 className="text-balance mt-6 max-w-3xl text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[.95] tracking-[-.06em]">Made in Ethiopia. Designed to travel.</h2>
              </div>
              <div className="lg:pb-1"><p className="max-w-xl text-base leading-7 text-white/60 sm:text-lg">Linqo respects how people actually connect here: mobile-first, multilingual, social-led and increasingly commerce-driven — while keeping an architecture that can scale across Africa.</p></div>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-3">
              <article className="rounded-[28px] border border-white/10 bg-white/[.045] p-7"><Globe2 className="text-[#dff36a]"/><h3 className="mt-10 text-xl font-semibold">Language that belongs</h3><p className="mt-3 text-sm leading-6 text-white/55">English and Amharic are part of the product architecture, not decorative translations added later.</p></article>
              <article className="rounded-[28px] border border-white/10 bg-white/[.045] p-7"><ShieldCheck className="text-[#dff36a]"/><h3 className="mt-10 text-xl font-semibold">Commerce with trust</h3><p className="mt-3 text-sm leading-6 text-white/55">Verified webhooks, private delivery and provider abstraction keep payment outcomes server-authoritative.</p></article>
              <article className="rounded-[28px] border border-white/10 bg-white/[.045] p-7"><Zap className="text-[#dff36a]"/><h3 className="mt-10 text-xl font-semibold">Fast on real networks</h3><p className="mt-3 text-sm leading-6 text-white/55">Public profiles prioritize lightweight rendering, responsive media and useful content over ornamental effects.</p></article>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="container-shell">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div><span className="eyebrow">Built for many kinds of ambition</span><h2 className="text-balance mt-5 max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">One platform. Many identities.</h2></div>
              <Link href="/explore" className="inline-flex items-center gap-2 text-sm font-bold text-[#0d5b42]">Explore profiles <ArrowRight size={16}/></Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {demoProfiles.map((profile,index)=><Link href={`/${profile.username}`} key={profile.username} className="group editorial-card min-h-[320px] p-5">
                <div className="flex items-start justify-between"><div className="grid size-14 place-items-center rounded-full text-sm font-bold text-white" style={{background:profile.accent}}>{profile.display_name.split(" ").map(v=>v[0]).join("").slice(0,2)}</div><span className="grid size-9 place-items-center rounded-full border border-black/[.08] bg-white/65 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"><ArrowUpRight size={15}/></span></div>
                <div className="mt-20 text-[10px] font-bold uppercase tracking-[.13em] text-[#8a938d]">{String(index+1).padStart(2,"0")} · {profile.tagline}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-[-.03em]">{profile.display_name}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#69736d]">{profile.bio}</p>
                <span className="mt-6 block text-xs font-semibold text-[#0d5b42]">linqo.app/{profile.username}</span>
              </Link>)}
            </div>
          </div>
        </section>

        <section className="pb-24 sm:pb-32">
          <div className="container-shell">
            <div className="relative overflow-hidden rounded-[36px] bg-[#0d5b42] px-6 py-14 text-white sm:px-10 sm:py-16 lg:px-14 lg:py-20">
              <div className="absolute -right-24 -top-32 size-80 rounded-full border-[64px] border-white/[.05]" />
              <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-sm font-semibold text-white/60">One identity. One link. Everything connected.</p>
                  <h2 className="text-balance mt-4 max-w-4xl text-[clamp(3rem,6vw,6rem)] font-semibold leading-[.92] tracking-[-.065em]">Own the link people remember.</h2>
                  <p className="mt-6 max-w-xl text-sm leading-6 text-white/60 sm:text-base">Create your profile in minutes. Make it unmistakably yours as you grow.</p>
                </div>
                <ButtonLink href="/signup" variant="secondary" className="relative justify-center">Create your Linqo <ArrowRight size={16}/></ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
