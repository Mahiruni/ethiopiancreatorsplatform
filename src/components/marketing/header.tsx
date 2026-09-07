"use client";
import { Menu, X, Languages } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const { dict, locale, setLocale } = useI18n();
  const links = [["/features",dict.nav.features],["/features#creators",dict.nav.creators],["/features#business",dict.nav.businesses],["/pricing",dict.nav.pricing],["/explore",dict.nav.explore]];
  return <header className="sticky top-0 z-50 border-b border-black/[.06] bg-[#f6f7f3]/85 backdrop-blur-xl">
    <div className="container-shell flex h-18 items-center justify-between gap-6">
      <Logo />
      <nav className="hidden items-center gap-6 text-sm text-[#47514c] lg:flex" aria-label="Primary">
        {links.map(([href,label]) => <Link key={href} href={href} className="hover:text-black">{label}</Link>)}
      </nav>
      <div className="hidden items-center gap-2 sm:flex">
        <button onClick={() => setLocale(locale === "en" ? "am" : "en")} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm hover:bg-black/[.04]" aria-label="Change language"><Languages size={17}/>{locale.toUpperCase()}</button>
        <ButtonLink href="/login" variant="ghost">{dict.nav.signIn}</ButtonLink>
        <ButtonLink href="/signup">{dict.nav.getStarted}</ButtonLink>
      </div>
      <button className="grid size-11 place-items-center rounded-full hover:bg-black/[.04] sm:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
    </div>
    {open && <div id="mobile-nav" className="border-t border-black/[.06] bg-white px-4 py-4 sm:hidden">
      <nav className="flex flex-col gap-1">{links.map(([href,label]) => <Link onClick={()=>setOpen(false)} key={href} href={href} className="rounded-xl px-3 py-3 text-base hover:bg-black/[.04]">{label}</Link>)}</nav>
      <div className="mt-4 grid grid-cols-2 gap-2"><ButtonLink href="/login" variant="secondary">{dict.nav.signIn}</ButtonLink><ButtonLink href="/signup">{dict.nav.getStarted}</ButtonLink></div>
      <button onClick={() => setLocale(locale === "en" ? "am" : "en")} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm hover:bg-black/[.04]"><Languages size={17}/>{locale === "en" ? "አማርኛ" : "English"}</button>
    </div>}
  </header>;
}
