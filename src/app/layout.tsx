import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { publicEnv } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_APP_URL),
  title: { default: "Linqo — Everything you are. One beautiful link.", template: "%s | Linqo" },
  description: "The Ethiopian digital identity and creator-commerce platform. Build one beautiful page for your links, work, products and payments.",
  openGraph: { type: "website", siteName: "Linqo" },
  robots: { index: true, follow: true }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const stored = cookieStore.get("linqo_locale")?.value;
  const locale: Locale = stored === "am" ? "am" : "en";
  return <html lang={locale} suppressHydrationWarning><body><I18nProvider initialLocale={locale}>{children}</I18nProvider></body></html>;
}
