import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ChapaProvider } from "@/lib/payments/chapa";

export async function POST(request: Request) {
  const raw = await request.text();
  const provider = new ChapaProvider();
  const verifiedWebhook = await provider.verifyWebhook(raw, request.headers);
  if (!verifiedWebhook.valid || !verifiedWebhook.txRef) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const admin = createAdminClient();
  const eventKey = verifiedWebhook.eventId || crypto.createHash("sha256").update(raw).digest("hex");
  const { data: existing } = await admin.from("payment_events").select("id").eq("provider", "chapa").eq("event_key", eventKey).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  const verification = await provider.verifyPayment(verifiedWebhook.txRef);
  const eventPayload = verifiedWebhook.raw ?? {};

  const { data: tx } = await admin.from("transactions").select("*").eq("tx_ref", verifiedWebhook.txRef).eq("provider", "chapa").maybeSingle();
  if (tx) {
    const amountMatches = Math.abs(Number(tx.amount) - verification.amount) < 0.001;
    const currencyMatches = tx.currency === verification.currency;
    await admin.from("payment_events").insert({ provider: "chapa", event_key: eventKey, tx_ref: tx.tx_ref, event_type: (eventPayload as any)?.event || "transaction", payload: eventPayload, verified: amountMatches && currencyMatches });
    if (!amountMatches || !currencyMatches) return NextResponse.json({ error: "Transaction mismatch" }, { status: 409 });
    if (verification.status === "paid") {
      const { error } = await admin.rpc("finalize_paid_transaction", { p_transaction_id: tx.id, p_provider_reference: verification.providerReference || null });
      if (error) return NextResponse.json({ error: "Settlement update failed" }, { status: 500 });
    } else {
      await admin.from("transactions").update({ status: verification.status, provider_reference: verification.providerReference || tx.provider_reference, verified_at: new Date().toISOString() }).eq("id", tx.id);
    }
    return NextResponse.json({ ok: true, kind: "product" });
  }

  const { data: billing } = await admin.from("billing_orders").select("*").eq("tx_ref", verifiedWebhook.txRef).eq("provider", "chapa").maybeSingle();
  if (!billing) return NextResponse.json({ error: "Unknown transaction" }, { status: 404 });

  const amountMatches = Math.abs(Number(billing.amount) - verification.amount) < 0.001;
  const currencyMatches = billing.currency === verification.currency;
  await admin.from("payment_events").insert({ provider: "chapa", event_key: eventKey, tx_ref: billing.tx_ref, event_type: (eventPayload as any)?.event || "subscription", payload: eventPayload, verified: amountMatches && currencyMatches });
  if (!amountMatches || !currencyMatches) return NextResponse.json({ error: "Billing mismatch" }, { status: 409 });

  if (verification.status === "paid") {
    const { error } = await admin.rpc("finalize_subscription_billing", { p_billing_order_id: billing.id, p_provider_reference: verification.providerReference || null });
    if (error) return NextResponse.json({ error: "Subscription settlement failed" }, { status: 500 });
  } else {
    await admin.from("billing_orders").update({ status: verification.status, provider_reference: verification.providerReference || billing.provider_reference, verified_at: new Date().toISOString() }).eq("id", billing.id);
  }
  return NextResponse.json({ ok: true, kind: "subscription" });
}
