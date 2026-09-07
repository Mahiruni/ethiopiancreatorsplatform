import { Check } from "lucide-react";
import { MarketingPage } from "@/components/marketing/page-shell";
import { ButtonLink } from "@/components/ui/button";

const plans = [
  { name: "Free", price: "ETB 0", desc: "For a clean digital identity.", features: ["Public profile", "Up to 8 links", "Standard themes", "Standard analytics", "Profile QR"] },
  { name: "Pro", price: "ETB 499 / 30 days", desc: "For creators building a business.", features: ["Advanced customization", "Advanced analytics", "Up to 50 links", "Digital products", "Brand controls"], featured: true },
  { name: "Business", price: "ETB 1,499 / 30 days", desc: "For teams and organizations.", features: ["Up to 200 links", "Team architecture", "Advanced reporting", "Premium themes", "Priority support"] },
];

export default function Pricing() {
  return <MarketingPage eyebrow="Pricing" title="Start free. Upgrade when Linqo earns its place." intro="Plan access is enforced on the server. Paid access activates only after the configured payment provider verifies the transaction.">
    <div className="grid gap-4 lg:grid-cols-3">{plans.map((p) => <article key={p.name} className={`card p-7 ${p.featured ? "ring-2 ring-[#135d44]" : ""}`}>
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{p.name}</h2>{p.featured && <span className="rounded-full bg-[#135d44] px-3 py-1 text-xs font-bold text-white">Most flexible</span>}</div>
      <div className="mt-8 text-3xl font-semibold tracking-tight">{p.price}</div>
      <p className="mt-2 text-sm text-[#68716c]">{p.desc}</p>
      <ul className="mt-7 space-y-3 text-sm">{p.features.map((f) => <li className="flex gap-2" key={f}><Check size={17} className="mt-0.5 text-[#135d44]" />{f}</li>)}</ul>
      <ButtonLink href={p.name === "Free" ? "/signup" : "/login?next=/dashboard/payments"} className="mt-8 w-full" variant={p.featured ? "primary" : "secondary"}>{p.name === "Free" ? "Get started free" : `Choose ${p.name}`}</ButtonLink>
    </article>)}</div>
  </MarketingPage>;
}
