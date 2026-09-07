"use client";
import { ArrowRight, BarChart3, Brush, Link2, QrCode, ShoppingBag, WalletCards } from "lucide-react";
import Link from "next/link";
import { MarketingHeader } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { HeroProfilePreview } from "@/components/marketing/profile-preview";
import { ButtonLink } from "@/components/ui/button";
import { demoProfiles } from "@/lib/demo-data";
import { useI18n } from "@/components/i18n-provider";

const features = [
  {icon:Link2,title:"One link for everything",body:"Connect social accounts, websites, portfolios, stores, booking pages and contact channels in one place."},
  {icon:ShoppingBag,title:"Sell online",body:"List digital products and services, then deliver paid files securely after server-side payment verification."},
  {icon:WalletCards,title:"Get paid",body:"A modular payment layer prepared for Ethiopian providers and international options where supported."},
  {icon:BarChart3,title:"Understand your audience",body:"Privacy-conscious views, clicks, referrers, devices and revenue trends — without collecting more than you need."},
  {icon:Brush,title:"Make it yours",body:"Premium themes, typography, backgrounds and button systems that stay fast and accessible."},
  {icon:QrCode,title:"Share anywhere",body:"Generate a canonical profile QR for print, social media, packaging, menus and event signage."}
];

export default function Home(){
  const { dict } = useI18n();
  return <><MarketingHeader/><main>
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28"><div className="absolute inset-0 grid-fade"/><div className="container-shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
      <div><div className="mb-5 inline-flex rounded-full border border-[#135d44]/15 bg-[#135d44]/5 px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-[#135d44]">{dict.hero.eyebrow}</div><h1 className="max-w-3xl text-[clamp(3rem,8vw,6.7rem)] font-semibold leading-[.91] tracking-[-.07em]">{dict.hero.title}</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#5f6964]">{dict.hero.body}</p><div className="mt-8 flex flex-wrap gap-3"><ButtonLink href="/signup">{dict.hero.primary}<ArrowRight size={17}/></ButtonLink><ButtonLink href="/explore" variant="secondary">{dict.hero.secondary}</ButtonLink></div><div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-[#6c756f]"><span>Free to start</span><span>English + አማርኛ</span><span>Mobile-first</span></div></div>
      <div className="relative"><div className="absolute -inset-10 -z-10 rounded-full bg-[#135d44]/10 blur-3xl"/><HeroProfilePreview/></div>
    </div></section>

    <section className="py-20"><div className="container-shell"><div className="max-w-2xl"><span className="text-xs font-bold uppercase tracking-[.14em] text-[#135d44]">Built to do more</span><h2 className="mt-3 text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Your identity, audience and business — together.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(({icon:Icon,title,body})=><article key={title} className="card p-6 sm:p-7"><span className="grid size-11 place-items-center rounded-2xl bg-[#edf3ef] text-[#135d44]"><Icon size={21}/></span><h3 className="mt-6 text-xl font-semibold tracking-tight">{title}</h3><p className="mt-3 text-sm leading-6 text-[#66706b]">{body}</p></article>)}</div></div></section>

    <section className="bg-[#172019] py-20 text-white"><div className="container-shell"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><span className="text-xs font-bold uppercase tracking-[.14em] text-[#96b9a8]">Made for real people</span><h2 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-.045em] sm:text-5xl">Creators, professionals and businesses across Ethiopia.</h2></div><Link href="/explore" className="inline-flex items-center gap-2 text-sm font-semibold text-[#c9dfd4]">Explore profiles <ArrowRight size={16}/></Link></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{demoProfiles.map((profile)=><Link href={`/${profile.username}`} key={profile.username} className="group rounded-[26px] border border-white/10 bg-white/[.055] p-5 transition hover:bg-white/[.08]"><div className="grid size-12 place-items-center rounded-full text-sm font-bold text-white" style={{background:profile.accent}}>{profile.display_name.split(" ").map(v=>v[0]).join("").slice(0,2)}</div><div className="mt-8 text-xs text-white/50">{profile.tagline}</div><h3 className="mt-1 text-lg font-semibold">{profile.display_name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{profile.bio}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white/75 group-hover:text-white">linqo.app/{profile.username}<ArrowRight size={13}/></span></Link>)}</div></div></section>

    <section className="py-24"><div className="container-shell"><div className="brand-gradient overflow-hidden rounded-[36px] px-6 py-14 text-white sm:px-12 sm:py-16 lg:flex lg:items-end lg:justify-between"><div><p className="text-sm font-semibold text-white/70">One identity. One link. Everything connected.</p><h2 className="mt-3 max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Own the link people remember.</h2></div><ButtonLink href="/signup" variant="secondary" className="mt-8 lg:mt-0">Create your Linqo</ButtonLink></div></div></section>
  </main><Footer/></>;
}
