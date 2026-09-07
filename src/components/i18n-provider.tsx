"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { dictionaries, type Locale } from "@/lib/i18n/dictionaries";

type Context = { locale: Locale; setLocale: (locale: Locale) => void; dict: typeof dictionaries.en | typeof dictionaries.am };
const I18nContext = createContext<Context | null>(null);

export function I18nProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `linqo_locale=${next};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = next === "am" ? "am" : "en";
  };
  const value = useMemo(() => ({ locale, setLocale, dict: dictionaries[locale] }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
