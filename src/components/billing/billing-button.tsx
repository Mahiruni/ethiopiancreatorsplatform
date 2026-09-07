"use client";

import { useState, type ReactNode } from "react";

type BillingPlan = "pro" | "business";

export function BillingButton({ plan, children }: { plan: BillingPlan; children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function startCheckout() {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const result = await response.json();
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent("/dashboard/payments")}`);
        return;
      }
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || "Unable to start checkout.");
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to start checkout.");
      setLoading(false);
    }
  }

  return <div>
    <button disabled={loading} onClick={startCheckout} className="inline-flex w-full items-center justify-center rounded-full bg-[#135d44] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
      {loading ? "Opening secure checkout…" : children}
    </button>
    {message && <p role="alert" className="mt-2 text-xs text-[#a14646]">{message}</p>}
  </div>;
}
