"use client";

import { Languages, Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/components/i18n-provider";

export function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const { dict, locale, setLocale } = useI18n();
  const links = [
    ["/features", dict.nav.features],
    ["/features#creators", dict.nav.creators],
    ["/features#business", dict.nav.businesses],
    ["/pricing", dict.nav.pricing],
    ["/explore", dict.nav.explore],
  ];

  return (
    <header className="sticky top-0 z-50 bg-transparent pt-3 sm:pt-4">
      <div className="container-shell">
        <div className="glass-nav flex h-16 items-center justify-between gap-5 rounded-[22px] px-3.5 sm:px-4 lg:px-5">
          <div className="flex min-w-0 items-center gap-7">
            <Logo />
            <nav className="hidden items-center gap-1 text-[13px] font-semibold text-[#4d5851] lg:flex" aria-label="Primary">
              {links.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full px-3 py-2 transition hover:bg-black/[.04] hover:text-[#10130f]">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              onClick={() => setLocale(locale === "en" ? "am" : "en")}
              className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-[#59645d] transition hover:bg-black/[.04] hover:text-black"
              aria-label="Change language"
            >
              <Languages size={16} />
              {locale === "en" ? "EN" : "አማ"}
            </button>
            <ButtonLink href="/login" variant="ghost">{dict.nav.signIn}</ButtonLink>
            <ButtonLink href="/signup">{dict.nav.getStarted}</ButtonLink>
          </div>

          <button
            className="grid size-11 place-items-center text-[#18201b] sm:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Toggle menu"
          >
            {open ? <X size={23} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="glass-nav mt-2 overflow-hidden rounded-[22px] p-3 sm:hidden">
            <nav className="flex flex-col" aria-label="Mobile primary">
              {links.map(([href, label]) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={href}
                  href={href}
                  className="rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-[#26302a] transition hover:bg-black/[.04]"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="my-2 h-px bg-black/[.07]" />
            <button
              onClick={() => setLocale(locale === "en" ? "am" : "en")}
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[#59645d]"
            >
              <Languages size={17} />
              {locale === "en" ? "Switch to አማርኛ" : "Switch to English"}
            </button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <ButtonLink href="/login" variant="secondary">{dict.nav.signIn}</ButtonLink>
              <ButtonLink href="/signup">{dict.nav.getStarted}</ButtonLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
