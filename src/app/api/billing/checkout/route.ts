import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { billingPlanSchema, getBillingPlan } from "@/lib/billing";
import { publicEnv } from "@/lib/env";
import { getPaymentProvider } from "@/lib/payments";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    await enforceRateLimit(ip, "billing-checkout", 6, 300);
  } catch (error) {
    if ((error as Error).message === "RATE_LIMITED") {
      return NextResponse.json({ error: "Too many billing attempts. Try again later." }, { status: 429 });
    }
  }

  const parsed = billingPlanSchema.safeParse((await request.json().catch(() => null))?.plan);
  if (!parsed.success) return NextResponse.json({ error: "Invalid subscription plan." }, { status: 400 });

  const supabase = await createClient();
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,display_name")
    .eq("user_id", auth.user.id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!profile) return NextResponse.json({ error: "Complete onboarding before upgrading." }, { status: 409 });

  const providerName = process.env.PAYMENT_DEFAULT_PROVIDER || "unavailable";
  const provider = getPaymentProvider(providerName);
  const plan = getBillingPlan(parsed.data);
  const txRef = `linqo-plan-${crypto.randomUUID()}`;
  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from("billing_orders")
    .insert({
      profile_id: profile.id,
      tx_ref: txRef,
      provider: provider.name,
      plan: parsed.data,
      amount: plan.amount,
      currency: plan.currency,
      status: "pending",
    })
    .select("id,tx_ref")
    .single();
  if (orderError || !order) return NextResponse.json({ error: "Unable to create billing order." }, { status: 500 });

  try {
    const result = await provider.createPayment({
      txRef,
      amount: plan.amount,
      currency: plan.currency,
      email: auth.user.email,
      firstName: profile.display_name?.split(/\s+/)[0],
      callbackUrl: `${publicEnv.NEXT_PUBLIC_APP_URL}/api/payments/${provider.name}/webhook`,
      returnUrl: `${publicEnv.NEXT_PUBLIC_APP_URL}/dashboard/payments?billing=${encodeURIComponent(txRef)}`,
      title: plan.name,
      description: plan.description,
      metadata: { billing_order_id: order.id, plan: parsed.data },
    });
    await admin.from("billing_orders").update({
      provider_reference: result.providerReference || null,
      checkout_url: result.checkoutUrl,
    }).eq("id", order.id);
    return NextResponse.json({ checkoutUrl: result.checkoutUrl });
  } catch {
    await admin.from("billing_orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: "Payment provider is not configured for subscriptions." }, { status: 503 });
  }
}
