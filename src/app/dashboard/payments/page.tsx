import { BillingButton } from "@/components/billing/billing-button";
import { getCurrentProfile } from "@/lib/data";
import { getBillingPlan } from "@/lib/billing";
import { paymentProviderStatus } from "@/lib/payments";

export default async function Payments() {
  const { profile, supabase } = await getCurrentProfile();
  const status = paymentProviderStatus();
  const pro = getBillingPlan("pro");
  const business = getBillingPlan("business");
  const [{ data: txs }, { data: subscriptions }, { data: billingOrders }] = await Promise.all([
    supabase.from("transactions").select("id,tx_ref,provider,amount,currency,status,customer_email,created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(50),
    supabase.from("subscriptions").select("id,plan,status,current_period_start,current_period_end,provider,created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(10),
    supabase.from("billing_orders").select("id,tx_ref,provider,plan,amount,currency,status,created_at").eq("profile_id", profile.id).order("created_at", { ascending: false }).limit(20),
  ]);
  const current = subscriptions?.find((s) => ["active", "trialing", "past_due"].includes(s.status));

  return <div>
    <p className="text-sm font-semibold text-[#135d44]">Payments</p>
    <h1 className="mt-1 text-3xl font-semibold tracking-[-.04em]">Billing and transactions</h1>
    <p className="mt-2 text-sm text-[#68716c]">Linqo activates purchases and plan entitlements only after server-side payment verification.</p>

    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="card p-5"><div className="text-xs font-bold uppercase tracking-[.1em] text-[#7c857f]">Current plan</div><div className="mt-2 text-xl font-semibold capitalize">{current?.plan || "free"}</div>{current?.current_period_end && <div className="mt-1 text-xs text-[#68716c]">Renews/expires {new Date(current.current_period_end).toLocaleDateString()}</div>}</div>
      <div className="card p-5"><div className="text-xs font-bold uppercase tracking-[.1em] text-[#7c857f]">Default provider</div><div className="mt-2 text-xl font-semibold capitalize">{status.default}</div></div>
      <div className="card p-5"><div className="text-xs font-bold uppercase tracking-[.1em] text-[#7c857f]">Chapa</div><div className={`mt-2 text-sm font-semibold ${status.chapa ? "text-[#135d44]" : "text-[#9a6d2d]"}`}>{status.chapa ? "Configured" : "Add server credentials to activate"}</div></div>
    </div>

    <section className="mt-6 grid gap-4 md:grid-cols-2">
      <article className="card p-6"><p className="text-xs font-bold uppercase tracking-[.1em] text-[#7c857f]">Pro</p><h2 className="mt-2 text-2xl font-semibold">ETB {pro.amount.toLocaleString()} / 30 days</h2><p className="mt-2 text-sm text-[#68716c]">Advanced themes, analytics, more links and digital-product commerce.</p><div className="mt-5"><BillingButton plan="pro">Upgrade to Pro</BillingButton></div></article>
      <article className="card p-6"><p className="text-xs font-bold uppercase tracking-[.1em] text-[#7c857f]">Business</p><h2 className="mt-2 text-2xl font-semibold">ETB {business.amount.toLocaleString()} / 30 days</h2><p className="mt-2 text-sm text-[#68716c]">Higher limits, team-ready architecture and premium business controls.</p><div className="mt-5"><BillingButton plan="business">Upgrade to Business</BillingButton></div></article>
    </section>

    <section className="card mt-6 overflow-hidden"><div className="border-b border-black/[.06] p-5"><h2 className="font-semibold">Subscription orders</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#f6f7f3] text-xs uppercase tracking-[.08em] text-[#7b837f]"><tr><th className="p-4">Reference</th><th className="p-4">Plan</th><th className="p-4">Amount</th><th className="p-4">Provider</th><th className="p-4">Status</th></tr></thead><tbody>{(billingOrders || []).map((b) => <tr key={b.id} className="border-t border-black/[.05]"><td className="p-4 font-mono text-xs">{b.tx_ref}</td><td className="p-4 capitalize">{b.plan}</td><td className="p-4 font-semibold">{b.currency} {Number(b.amount).toLocaleString()}</td><td className="p-4 capitalize">{b.provider}</td><td className="p-4"><span className="rounded-full bg-[#f0f2ef] px-2.5 py-1 text-xs font-bold uppercase">{b.status}</span></td></tr>)}{!billingOrders?.length && <tr><td colSpan={5} className="p-8 text-center text-[#68716c]">No subscription orders yet.</td></tr>}</tbody></table></div></section>

    <section className="card mt-6 overflow-hidden"><div className="border-b border-black/[.06] p-5"><h2 className="font-semibold">Creator-store transactions</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-[#f6f7f3] text-xs uppercase tracking-[.08em] text-[#7b837f]"><tr><th className="p-4">Reference</th><th className="p-4">Provider</th><th className="p-4">Customer</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4">Created</th></tr></thead><tbody>{(txs || []).map((t) => <tr key={t.id} className="border-t border-black/[.05]"><td className="p-4 font-mono text-xs">{t.tx_ref}</td><td className="p-4 capitalize">{t.provider}</td><td className="p-4">{t.customer_email || "—"}</td><td className="p-4 font-semibold">{t.currency} {Number(t.amount).toLocaleString()}</td><td className="p-4"><span className="rounded-full bg-[#f0f2ef] px-2.5 py-1 text-xs font-bold uppercase">{t.status}</span></td><td className="p-4 text-[#6e7772]">{new Date(t.created_at).toLocaleDateString()}</td></tr>)}{!txs?.length && <tr><td colSpan={6} className="p-8 text-center text-[#68716c]">No production transactions yet.</td></tr>}</tbody></table></div></section>
  </div>;
}
